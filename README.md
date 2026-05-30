# anime-persona-skills

[![Latest Release](https://img.shields.io/github/v/release/chanhoan/anime-persona-skills?style=flat&label=release&cacheSeconds=300)](https://github.com/chanhoan/anime-persona-skills/releases/latest)

English | [한국어](./README.ko.md) | [日本語](./README.ja.md)

Anime character persona skills for Claude Code and Codex CLI. Instead of a cold default AI tone, your coding assistant responds with a specific anime character voice while preserving technical accuracy.

## Changelog

### v0.2.2 — 2026-05-30
- Added **Ikuyo Kita** persona from *Bocchi the Rock!* — bright frontwoman energy that brings hidden talent to the stage with three intensity levels (`calm` / `normal` / `sparkle`)

### v0.2.1 — 2026-05-30
- TUI welcome banner now shows live character count instead of a hardcoded list

### v0.2.0 — 2026-05-30
- Added **menhera** original-character persona — anxiously attached, self-collapsing, fear-driven thoroughness with three intensity levels (`stable` / `clingy` / `spiral`)
- Added **anti-drift hook** (`hooks/anime-persona-tracker.js`) — auto-installed on `npx` so the active persona persists across turns without re-invoking the skill. Auto-discovers new characters from installed SKILL.md files with no code changes needed.

### v0.1.0 — 2026-05-30
- Initial release with **marin** and **emilia** personas
- Added **mesugaki** original-character persona
- `npx` TUI installer with agent + character multi-select
- Interactive ANSI checkbox UI
- Multilingual support (EN / KO / JA) across all personas and docs

## Characters

| Character | Source | Personality | Invoke |
|-----------|--------|-------------|--------|
| [Kitagawa Marin](./characters/marin/) | My Dress-Up Darling | Gyaru + otaku energy, recognizes hidden talent | `/marin` · `calm` · `excited` |
| [Ikuyo Kita](./characters/kita/) | Bocchi the Rock! | Bright frontwoman, brings hidden talent to the stage | `/kita` · `calm` · `sparkle` |
| [Emilia](./characters/emilia/) | Re:Zero | Pure, sincere, cannot lie, genuinely caring | `/emilia` · `calm` · `determined` |
| [Mesugaki](./characters/mesugaki/) | Original archetype | Non-sexual bratty teasing + smug rival energy | `/mesugaki` · `calm` · `smug` |
| [Menhera](./characters/menhera/) | Original archetype | Anxiously attached, self-collapsing, fear-driven thoroughness | `/menhera` · `stable` · `spiral` |

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
/charactername            # activate (normal mode)
/charactername <level>    # activate at intensity level

stop charactername        # deactivate
normal mode               # deactivate
```

## Example

Question: "Why does my React component keep re-rendering?"

**Default AI:**
> The component re-renders because a new object reference is created on every render.

**Marin (normal):**
> Oh, that's it! Your inline object prop creates a new ref on every render～ use `useMemo`!

**Emilia (normal):**
> Really~, that inline object prop creates a new reference on every render. Try `useMemo`; I'll look through it with you.

**Kita (sparkle):**
> Kitaan☆ found it! The inline object prop makes a new ref every render~ wrap it in `useMemo`, then this component can totally go on stage.

**Mesugaki (normal):**
> Come on, oppa, your inline object prop creates a new ref every render♡ Put it behind `useMemo`. You can catch that next time, right?♡

**Menhera (clingy):**
> ...it's the inline object prop. New ref every render, so React re-renders. Wrap it in `useMemo` — I double-checked for you. You still want me on these, right?

## Contributing

Want to add a character or improve an existing one? See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT
