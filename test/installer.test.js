const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { discoverCharacters } = require('../src/catalog');
const { parseArgs } = require('../src/cli');
const { buildInstallTasks, executeTasks } = require('../src/install');
const { checkboxSelect } = require('../src/tui');

const repoRoot = path.resolve(__dirname, '..');

function tempHome() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'anime-persona-skills-'));
}

test('discovers character skills from characters directory', () => {
  const characters = discoverCharacters(repoRoot);
  const expectedNames = fs
    .readdirSync(path.join(repoRoot, 'characters'))
    .filter((name) =>
      fs.existsSync(path.join(repoRoot, 'characters', name, 'SKILL.md')),
    )
    .sort();

  assert.deepEqual(
    characters.map((c) => c.name).sort(),
    expectedNames,
  );
  for (const character of characters) {
    assert.ok(character.skillPath.endsWith(path.join(character.name, 'SKILL.md')));
    assert.ok(character.readmePath.endsWith(path.join(character.name, 'README.md')));
    assert.ok(character.description.length > 20);
  }
});

test('parses repeatable agents and characters plus dry-run flags', () => {
  const opts = parseArgs([
    '--agent',
    'claude',
    '--agent',
    'codex',
    '--character',
    'marin',
    '--character',
    'emilia',
    '--dry-run',
    '--force',
  ]);

  assert.deepEqual(opts.agents, ['claude', 'codex']);
  assert.deepEqual(opts.characters, ['marin', 'emilia']);
  assert.equal(opts.dryRun, true);
  assert.equal(opts.force, true);
});

test('builds Claude and Codex install tasks for selected characters', () => {
  const characters = discoverCharacters(repoRoot);
  const home = tempHome();
  const tasks = buildInstallTasks({
    repoRoot,
    homeDir: home,
    selectedAgents: ['claude', 'codex'],
    selectedCharacters: ['marin'],
    characters,
  });

  assert.deepEqual(
    tasks.map((task) => path.relative(home, task.dest)).sort(),
    [
      '.claude/skills/marin/README.md',
      '.claude/skills/marin/SKILL.md',
      '.codex/skills/marin/README.md',
      '.codex/skills/marin/SKILL.md',
    ],
  );
});

test('honors Claude and Codex config environment directories by default', () => {
  const characters = discoverCharacters(repoRoot);
  const home = tempHome();
  const oldClaudeConfigDir = process.env.CLAUDE_CONFIG_DIR;
  const oldCodexHome = process.env.CODEX_HOME;
  process.env.CLAUDE_CONFIG_DIR = path.join(home, 'custom-claude');
  process.env.CODEX_HOME = path.join(home, 'custom-codex');

  try {
    const tasks = buildInstallTasks({
      repoRoot,
      homeDir: home,
      selectedAgents: ['claude', 'codex'],
      selectedCharacters: ['marin'],
      characters,
    });

    assert.deepEqual(
      tasks.map((task) => path.relative(home, task.dest)).sort(),
      [
        'custom-claude/skills/marin/README.md',
        'custom-claude/skills/marin/SKILL.md',
        'custom-codex/skills/marin/README.md',
        'custom-codex/skills/marin/SKILL.md',
      ],
    );
  } finally {
    restoreEnv('CLAUDE_CONFIG_DIR', oldClaudeConfigDir);
    restoreEnv('CODEX_HOME', oldCodexHome);
  }
});

function restoreEnv(name, value) {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

test('dry-run reports tasks without writing files', () => {
  const characters = discoverCharacters(repoRoot);
  const home = tempHome();
  const tasks = buildInstallTasks({
    repoRoot,
    homeDir: home,
    selectedAgents: ['codex'],
    selectedCharacters: ['emilia'],
    characters,
  });

  const result = executeTasks(tasks, { dryRun: true, force: false });

  assert.equal(result.planned, 2);
  assert.equal(result.written, 0);
  assert.equal(fs.existsSync(path.join(home, '.codex/skills/emilia/SKILL.md')), false);
});

test('installs files, skips existing files, and overwrites with force', () => {
  const characters = discoverCharacters(repoRoot);
  const home = tempHome();
  const tasks = buildInstallTasks({
    repoRoot,
    homeDir: home,
    selectedAgents: ['claude'],
    selectedCharacters: ['marin'],
    characters,
  });

  const first = executeTasks(tasks, { dryRun: false, force: false });
  assert.equal(first.written, 2);
  assert.equal(first.skipped, 0);

  const skillDest = path.join(home, '.claude/skills/marin/SKILL.md');
  fs.writeFileSync(skillDest, 'local edit\n');

  const second = executeTasks(tasks, { dryRun: false, force: false });
  assert.equal(second.written, 0);
  assert.equal(second.skipped, 2);
  assert.equal(fs.readFileSync(skillDest, 'utf8'), 'local edit\n');

  const third = executeTasks(tasks, { dryRun: false, force: true });
  assert.equal(third.written, 2);
  assert.match(fs.readFileSync(skillDest, 'utf8'), /^---\nname: marin/m);
});

test('checkboxSelect resolves all items when stdin is not a TTY', async () => {
  const items = [
    { id: 'claude', label: 'Claude Code' },
    { id: 'codex', label: 'Codex' },
  ];
  const result = await checkboxSelect('Pick agents', items);
  assert.deepEqual(result, ['claude', 'codex']);
});

test('checkboxSelect resolves empty array when items list is empty (non-TTY)', async () => {
  const result = await checkboxSelect('Pick agents', []);
  assert.deepEqual(result, []);
});

test('non-interactive mode requires explicit agent and character selections', () => {
  assert.throws(
    () => parseArgs(['--non-interactive']),
    /requires --agent\/--all-agents and --character\/--all-characters/,
  );
});
