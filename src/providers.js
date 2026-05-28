const path = require('node:path');

const AGENTS = [
  {
    id: 'claude',
    label: 'Claude Code',
    baseDir(homeDir, overrides) {
      const configDir = process.env.CLAUDE_CONFIG_DIR || path.join(homeDir, '.claude');
      return overrides.claudeDir || path.join(configDir, 'skills');
    },
  },
  {
    id: 'codex',
    label: 'Codex CLI',
    baseDir(homeDir, overrides) {
      const configDir = process.env.CODEX_HOME || path.join(homeDir, '.codex');
      return overrides.codexDir || path.join(configDir, 'skills');
    },
  },
];

function getAgent(id) {
  return AGENTS.find((agent) => agent.id === id);
}

module.exports = { AGENTS, getAgent };
