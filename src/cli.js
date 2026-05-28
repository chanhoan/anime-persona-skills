const path = require('node:path');
const { AGENTS } = require('./providers');

function parseArgs(argv) {
  const opts = {
    agents: [],
    characters: [],
    allAgents: false,
    allCharacters: false,
    dryRun: false,
    force: false,
    list: false,
    nonInteractive: false,
    help: false,
    claudeDir: null,
    codexDir: null,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    switch (arg) {
      case '--':
        break;
      case '--agent':
        opts.agents.push(requireValue(argv, ++i, '--agent'));
        break;
      case '--character':
        opts.characters.push(requireValue(argv, ++i, '--character'));
        break;
      case '--all-agents':
        opts.allAgents = true;
        break;
      case '--all-characters':
        opts.allCharacters = true;
        break;
      case '--dry-run':
        opts.dryRun = true;
        break;
      case '--force':
        opts.force = true;
        break;
      case '--list':
        opts.list = true;
        break;
      case '--non-interactive':
        opts.nonInteractive = true;
        break;
      case '--claude-dir':
        opts.claudeDir = path.resolve(requireValue(argv, ++i, '--claude-dir'));
        break;
      case '--codex-dir':
        opts.codexDir = path.resolve(requireValue(argv, ++i, '--codex-dir'));
        break;
      case '-h':
      case '--help':
        opts.help = true;
        break;
      default:
        throw new Error(`unknown flag: ${arg}`);
    }
  }

  opts.agents = unique(opts.allAgents ? AGENTS.map((agent) => agent.id) : opts.agents);
  opts.characters = unique(opts.characters);

  if (opts.nonInteractive) {
    const hasAgentSelection = opts.allAgents || opts.agents.length > 0;
    const hasCharacterSelection = opts.allCharacters || opts.characters.length > 0;
    if (!hasAgentSelection || !hasCharacterSelection) {
      throw new Error(
        'non-interactive mode requires --agent/--all-agents and --character/--all-characters',
      );
    }
  }

  return opts;
}

function requireValue(argv, index, flag) {
  const value = argv[index];
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value`);
  return value;
}

function unique(values) {
  return [...new Set(values)];
}

function usage() {
  return `Usage:
  anime-persona-skills
  anime-persona-skills --agent codex --character marin
  anime-persona-skills --all-agents --all-characters --dry-run

Options:
  --agent <id>          Select target agent. Repeatable: claude, codex
  --character <name>   Select character. Repeatable.
  --all-agents         Select all supported agents.
  --all-characters     Select all discovered characters.
  --dry-run            Print planned writes without changing files.
  --force              Overwrite existing installed files.
  --list               Print available agents and characters.
  --non-interactive    Disable TUI and require explicit selections.
  --claude-dir <path>  Override Claude skills directory.
  --codex-dir <path>   Override Codex skills directory.
`;
}

module.exports = { parseArgs, usage };
