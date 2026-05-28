const path = require('node:path');

const AGENTS = [
  {
    id: 'claude',
    label: 'Claude Code',
    baseDir(homeDir, overrides) {
      return overrides.claudeDir || path.join(homeDir, '.claude', 'skills');
    },
  },
  {
    id: 'codex',
    label: 'Codex CLI',
    baseDir(homeDir, overrides) {
      return overrides.codexDir || path.join(homeDir, '.codex', 'skills');
    },
  },
];

function getAgent(id) {
  return AGENTS.find((agent) => agent.id === id);
}

module.exports = { AGENTS, getAgent };
