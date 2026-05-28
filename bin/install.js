#!/usr/bin/env node
'use strict';

const os = require('node:os');
const path = require('node:path');
const { discoverCharacters } = require('../src/catalog');
const { parseArgs, usage } = require('../src/cli');
const { buildInstallTasks, executeTasks } = require('../src/install');
const { AGENTS } = require('../src/providers');
const { runTui } = require('../src/tui');

async function main() {
  const repoRoot = path.resolve(__dirname, '..');
  const opts = parseArgs(process.argv.slice(2));
  const characters = discoverCharacters(repoRoot);

  if (opts.help) {
    process.stdout.write(usage());
    return;
  }

  if (opts.list) {
    printList(characters);
    return;
  }

  let selectedAgents = opts.agents;
  let selectedCharacters = opts.allCharacters
    ? characters.map((character) => character.name)
    : opts.characters;

  if (!opts.nonInteractive && (!selectedAgents.length || !selectedCharacters.length)) {
    const selected = await runTui({
      characters,
      preselectedAgents: selectedAgents,
      preselectedCharacters: selectedCharacters,
    });
    selectedAgents = selected.agents;
    selectedCharacters = selected.characters;
  }

  validateSelections({ selectedAgents, selectedCharacters, characters });

  const tasks = buildInstallTasks({
    repoRoot,
    homeDir: os.homedir(),
    selectedAgents,
    selectedCharacters,
    characters,
    overrides: {
      claudeDir: opts.claudeDir,
      codexDir: opts.codexDir,
    },
  });

  printTaskSummary(tasks, opts);
  const result = executeTasks(tasks, opts, (line) => process.stdout.write(`${line}\n`));
  process.stdout.write(
    `\nDone. planned=${result.planned} written=${result.written} skipped=${result.skipped}\n`,
  );
}

function printList(characters) {
  process.stdout.write('Agents:\n');
  for (const agent of AGENTS) process.stdout.write(`  ${agent.id}\t${agent.label}\n`);
  process.stdout.write('\nCharacters:\n');
  for (const character of characters) {
    process.stdout.write(`  ${character.name}\t${character.description}\n`);
  }
}

function validateSelections({ selectedAgents, selectedCharacters, characters }) {
  const validAgents = new Set(AGENTS.map((agent) => agent.id));
  const validCharacters = new Set(characters.map((character) => character.name));

  if (!selectedAgents.length) throw new Error('select at least one agent');
  if (!selectedCharacters.length) throw new Error('select at least one character');

  for (const agent of selectedAgents) {
    if (!validAgents.has(agent)) throw new Error(`unknown agent: ${agent}`);
  }
  for (const character of selectedCharacters) {
    if (!validCharacters.has(character)) throw new Error(`unknown character: ${character}`);
  }
}

function printTaskSummary(tasks, opts) {
  process.stdout.write(`Installing ${tasks.length} file(s)${opts.dryRun ? ' (dry-run)' : ''}\n`);
}

main().catch((error) => {
  process.stderr.write(`anime-persona-skills: ${error.message}\n`);
  process.exit(1);
});
