# Repository Guidelines

## Project Structure & Module Organization

This repository is a Markdown collection of anime persona skills for Claude Code/ECC.

- `characters/<name>/SKILL.md` contains the actual persona instructions loaded by the skill system.
- `characters/<name>/README.md` explains the character skill for human readers.
- `template/` provides the starting structure for new character skills.
- `README.md` lists available characters and installation examples.
- `CONTRIBUTING.md` defines the expected character research and PR content.

When adding a character, copy `template/` into `characters/<lowercase-name>/` and update both files.

## Build, Test, and Development Commands

There is no build step or package manager. Validate changes by reading rendered Markdown and checking file layout.

```bash
cp -r template/ characters/<character-name>/
rg --files
sed -n '1,220p' characters/<character-name>/SKILL.md
```

Use `rg` for fast inspection. Keep shell examples executable.

## Coding Style & Naming Conventions

Write skill files in Markdown with YAML front matter at the top of each `SKILL.md`. Use lowercase kebab-case for skill and folder names, for example `characters/marin/`.

Persona text may be Korean or English, but keep technical instructions precise. Preserve:

- character essence before catchphrases
- user relationship dynamic
- speech patterns and intensity levels
- Auto-Clarity rules for security, destructive actions, and confusing sequences
- boundaries for code, commits, PRs, and normal-mode exit

Avoid generic AI phrasing. Code, commands, and commit messages stay normal and professional.

## Testing Guidelines

No automated tests are configured. Review each new or changed skill manually:

- Confirm `SKILL.md` front matter has `name` and `description`.
- Confirm activation and stop phrases are documented.
- Confirm examples demonstrate each intensity level.
- Confirm technical advice in examples is correct.
- Confirm `README.md` matches the skill behavior.

## Commit & Pull Request Guidelines

Git history currently uses Conventional Commit style, for example:

```text
feat: initial release
feat: add <character-name> persona
```

Use `feat:` for new characters and `fix:` for corrections to existing persona behavior or technical advice.

Pull requests should include source work, character essence in one sentence, user relationship dynamic, example responses for each intensity level, and confirmation that technical accuracy is preserved. Link issues when applicable.

## Security & Configuration Tips

Do not include credentials, private user data, or paid API keys in examples. For destructive commands or security warnings inside persona skills, temporarily drop persona style and state the risk plainly before resuming the character.
