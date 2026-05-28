const fs = require('node:fs');
const path = require('node:path');
const { getAgent } = require('./providers');

function buildInstallTasks({
  homeDir,
  selectedAgents,
  selectedCharacters,
  characters,
  overrides = {},
}) {
  const characterByName = new Map(characters.map((character) => [character.name, character]));
  const tasks = [];

  for (const agentId of selectedAgents) {
    const agent = getAgent(agentId);
    if (!agent) throw new Error(`unknown agent: ${agentId}`);

    for (const characterName of selectedCharacters) {
      const character = characterByName.get(characterName);
      if (!character) throw new Error(`unknown character: ${characterName}`);

      const destDir = path.join(agent.baseDir(homeDir, overrides), character.name);
      tasks.push({
        agent: agent.id,
        character: character.name,
        kind: 'SKILL.md',
        src: character.skillPath,
        dest: path.join(destDir, 'SKILL.md'),
      });
      tasks.push({
        agent: agent.id,
        character: character.name,
        kind: 'README.md',
        src: character.readmePath,
        dest: path.join(destDir, 'README.md'),
      });
    }
  }

  return tasks;
}

function executeTasks(tasks, { dryRun, force }, reporter = () => {}) {
  const result = {
    planned: tasks.length,
    written: 0,
    skipped: 0,
  };

  for (const task of tasks) {
    if (dryRun) {
      reporter(`would write ${task.dest}`);
      continue;
    }

    if (fs.existsSync(task.dest) && !force) {
      result.skipped += 1;
      reporter(`skip existing ${task.dest}`);
      continue;
    }

    fs.mkdirSync(path.dirname(task.dest), { recursive: true });
    fs.copyFileSync(task.src, task.dest);
    result.written += 1;
    reporter(`${fs.existsSync(task.dest) ? 'wrote' : 'write failed'} ${task.dest}`);
  }

  return result;
}

module.exports = { buildInstallTasks, executeTasks };
