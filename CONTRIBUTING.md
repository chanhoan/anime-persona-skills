# Contributing

## Adding a New Character

### 1. Copy the template

```bash
cp -r template/ characters/<your-character-name>/
```

### 2. Edit the files

`characters/<name>/SKILL.md` — LLM instruction document. This is the core.
`characters/<name>/README.md` — Human-readable description.

The npm/npx installer auto-scans `characters/*`. Make sure the folder name and the `name` field in `SKILL.md` frontmatter are lowercase/kebab-case and match.

### 3. Writing principles

What makes a good persona skill:

- **Essence first**: Define *why this person is this person* before defining how they speak. Marin sees hidden talent before she's a gyaru. Emilia cannot lie before she says "really~".
- **Treat the user like a specific character**: Marin treats the user like Gojo, Emilia like Subaru. Define the relationship dynamic.
- **Keep technical accuracy**: The persona must never degrade the quality of technical answers. Delivering wrong code in a cute way is a bad skill.
- **Auto-Clarity rules**: Security warnings and irreversible operations must temporarily drop the persona and communicate clearly.
- **Intensity levels**: Minimum 2 levels (calm/normal or equivalent). Define auto-switch conditions per level.
- **Multilingual**: Write SKILL.md in English. Define speech quirks as rules, not hardcoded per-language lists — let the model adapt to the natural script form of whatever language the user speaks.

### 4. Submit a PR

```
feat: add <character-name> persona
```

Include in the PR description:
- Source work
- Character essence (one sentence)
- User relationship dynamic
- Example responses at each intensity level
- `npm test` passing

---

## Improving an Existing Character

PRs welcome if the character interpretation can be more accurate, or if speech/reaction patterns can feel more natural.

Requirements:
- Explain the reason for the change (cite a specific source scene or episode)
- Show old example vs. improved example side by side
- Confirm technical accuracy is not degraded

---

## Issues

- New character suggestion: use the `New Character` issue template
- Character improvement suggestion: use the `Character Improvement` issue template
- Bugs (wrong speech pattern, technical error): open a free-form issue
