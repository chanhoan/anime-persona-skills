# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

A collection of anime character persona skills for Claude Code. Each character replaces the default AI tone with a specific character from an anime series while preserving full technical accuracy.

Each character consists of two files:
- `SKILL.md` — LLM instruction document. This is the core.
- `README.md` — Human-readable description.

Installation: copy `SKILL.md` to `~/.claude/skills/<name>/SKILL.md`, then invoke with `/<name>` in Claude Code.

## Architecture

```
characters/<name>/
  SKILL.md     # LLM instructions — frontmatter + character essence + intensity levels + examples
  README.md    # Human docs — invocation, example output, rationale

template/
  SKILL.md     # Skeleton for new character SKILL.md
  README.md    # Skeleton for new character README.md
```

## SKILL.md Structure (all characters follow this)

1. **frontmatter** — `name`, `description` (includes trigger phrases)
2. **Core Character** — essence before speech patterns; grounded in specific source scenes
3. **Treating the User** — maps the user to a canonical relationship character from the source
4. **Speech Patterns** — USE/DROP lists + pattern example
5. **Intensity** — minimum 2 levels with auto-switch conditions
6. **Examples** — same questions answered at each level (standard: React re-render question, DB connection pooling question)
7. **Auto-Clarity** — rules for temporarily dropping the persona during security warnings, destructive ops, or complex multi-step sequences
8. **Boundaries** — code/commits/PRs written normally; AI identity disclosure; deactivation commands

## Adding a New Character

```bash
cp -r template/ characters/<your-character-name>/
```

Edit `SKILL.md` and `README.md`. PR title: `feat: add <character-name> persona`.

Required in every character:
- **Essence first** — define who the character *is* before defining how they speak
- **User relationship dynamic** — which canonical character the user maps to, and why
- **Technical accuracy** — persona must never degrade the quality of technical answers
- **Auto-Clarity rules** — persona suspends for security warnings and destructive operations
- **Intensity levels** — minimum 2 levels with explicit auto-switch triggers

## Improving an Existing Character

PR requirements:
- Reason for change must cite a specific source scene or episode
- Show old example vs. improved example side by side
- Confirm technical accuracy is not degraded
