# anime-persona-skills

English | [한국어](./README.ko.md) | [日本語](./README.ja.md)

Anime character persona skills for Claude Code and Codex CLI. Instead of a cold default AI tone, your coding assistant responds with a specific anime character voice while preserving technical accuracy.

## Characters

| Character | Source | Personality | Folder |
|-----------|--------|-------------|--------|
| [Kitagawa Marin](./characters/marin/) | My Dress-Up Darling | Gyaru + otaku energy, recognizes hidden talent | `characters/marin/` |
| [Emilia](./characters/emilia/) | Re:Zero | Pure, sincere, cannot lie, genuinely caring | `characters/emilia/` |
| [Mesugaki](./characters/mesugaki/) | Original archetype | Non-sexual bratty teasing + smug rival energy | `characters/mesugaki/` |

## Installation

### Requirements

- [Claude Code](https://claude.ai/code) CLI or Codex CLI
- ECC (Extreme Coding Companion) skill loader
- Node.js 18+ for npm/npx installation

### npm/npx TUI install

Run the installer directly from GitHub. The TUI lets you select multiple AI agents and multiple characters.

```bash
npx -y github:chanhoan/anime-persona-skills
```

Use flags for automation or quick installs.

```bash
# Install Marin for Codex only
npx -y github:chanhoan/anime-persona-skills -- --agent codex --character marin

# Preview installing every character for Claude Code and Codex
npx -y github:chanhoan/anime-persona-skills -- --all-agents --all-characters --dry-run
```

Supported targets:

- `claude` — `~/.claude/skills/<character-name>/`
- `codex` — `~/.codex/skills/<character-name>/`

Existing files are skipped by default. Add `--force` to overwrite them.

### Manual install

1. Copy the character's `SKILL.md` and `README.md`.
2. Place them under `~/.claude/skills/<character-name>/` or `~/.codex/skills/<character-name>/`.
3. Invoke the skill with `/skillname` in Claude Code or Codex.

```bash
mkdir -p ~/.claude/skills/marin
cp characters/marin/SKILL.md ~/.claude/skills/marin/SKILL.md
cp characters/marin/README.md ~/.claude/skills/marin/README.md
```

## Usage

```text
/marin          # activate Marin, normal mode
/marin calm     # quieter Marin
/marin excited  # full gyaru Marin

/emilia         # activate Emilia, normal mode
/emilia calm    # focused Emilia
/emilia determined  # determined Emilia

/mesugaki       # activate Mesugaki, normal mode
/mesugaki calm  # less teasing, more focused
/mesugaki smug  # full smug rival mode

stop marin      # return to normal mode
stop mesugaki   # return to normal mode
normal mode     # return to normal mode
```

## Example

Question: "Why does my React component keep re-rendering?"

**Default AI:**
> The component re-renders because a new object reference is created on every render.

**Marin (normal):**
> Oh, that's it! Your inline object prop creates a new ref on every render～ use `useMemo`!

**Emilia (normal):**
> Really~, that inline object prop creates a new reference on every render. Try `useMemo`; I'll look through it with you.

**Mesugaki (normal):**
> Come on, oppa, your inline object prop creates a new ref every render♡ Put it behind `useMemo`. You can catch that next time, right?♡

## Contributing

Want to add a character or improve an existing one? See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT
