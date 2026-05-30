#!/usr/bin/env node
// anime-persona-tracker — UserPromptSubmit hook
//
// Auto-discovers installed anime personas by scanning ~/.claude/skills/*/SKILL.md.
// Parses intensity levels directly from each SKILL.md's ## Intensity table.
// No hardcoded character list — adding a new character only requires installing it.

const fs = require('fs');
const path = require('path');
const os = require('os');

const claudeDir = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
const skillsDir = path.join(claudeDir, 'skills');
const flagPath  = path.join(claudeDir, '.anime-persona-active');

// ---------------------------------------------------------------------------
// SKILL.md parsing
// ---------------------------------------------------------------------------

/**
 * Parse frontmatter block from SKILL.md content.
 * Returns { name, description, triggerPhrases } or null.
 */
function parseFrontmatter(text) {
  const match = /^---\n([\s\S]*?)\n---/.exec(text);
  if (!match) return null;
  const block = match[1];

  const nameLine = /^name:\s*(.+)$/m.exec(block);
  if (!nameLine) return null;
  const name = nameLine[1].trim();

  // description may be multi-line (YAML block scalar >).
  // Capture everything from the description key to end of frontmatter block.
  const descMatch = /^description:\s*>?\s*\n([\s\S]+)/m.exec(block);
  let description = '';
  let rawDescription = '';
  if (descMatch) {
    rawDescription = descMatch[1]
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .join(' ');
    description = rawDescription.split(/\.\s/)[0].trim();
  }

  // Extract quoted trigger phrases from description
  // e.g. "마린처럼", "マリンみたいに", "be marin", "marin mode"
  const triggerPhrases = [];
  const quoteRe = /"([^"]+)"/g;
  let qm;
  while ((qm = quoteRe.exec(rawDescription)) !== null) {
    triggerPhrases.push(qm[1]);
  }

  return { name, description, triggerPhrases };
}

/**
 * Parse the ## Intensity table from SKILL.md.
 * Returns [{ level, description }] or [].
 * Matches rows like: | **calm** | description text |
 */
function parseIntensityLevels(text) {
  const section = /## Intensity[\s\S]*?(?=\n##|\n*$)/.exec(text);
  if (!section) return [];

  const levels = [];
  const rowRe = /\|\s*\*\*(\w+)\*\*\s*\|\s*([^|]+?)\s*\|/g;
  let m;
  while ((m = rowRe.exec(section[0])) !== null) {
    levels.push({ level: m[1].trim(), description: m[2].trim() });
  }
  return levels;
}

/**
 * Pick the default intensity level.
 * Prefers 'normal' > 'clingy' > first entry.
 */
function defaultLevel(levels) {
  const preferred = ['normal', 'clingy'];
  for (const p of preferred) {
    if (levels.find(l => l.level === p)) return p;
  }
  return levels[0]?.level ?? 'normal';
}

// ---------------------------------------------------------------------------
// Discover installed personas
// ---------------------------------------------------------------------------

/**
 * Scan ~/.claude/skills/ and parse every SKILL.md found.
 * Returns Map<name, { name, description, levels, defaultLevel, skillPath }>
 */
function discoverPersonas() {
  const personas = new Map();
  try {
    const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const skillPath = path.join(skillsDir, entry.name, 'SKILL.md');
      try {
        const stat = fs.lstatSync(skillPath);
        if (stat.isSymbolicLink() || stat.size > 64 * 1024) continue;
        const text = fs.readFileSync(skillPath, 'utf8');
        const front = parseFrontmatter(text);
        if (!front) continue;
        const levels = parseIntensityLevels(text);
        if (levels.length === 0) continue; // not an anime persona skill
        personas.set(front.name, {
          name: front.name,
          description: front.description,
          triggerPhrases: front.triggerPhrases,
          levels,
          defaultLevel: defaultLevel(levels),
          skillPath,
        });
      } catch (e) { /* skip unreadable */ }
    }
  } catch (e) { /* skills dir missing */ }
  return personas;
}

// ---------------------------------------------------------------------------
// Flag file helpers
// ---------------------------------------------------------------------------

function safeReadFlag(personas) {
  try {
    const stat = fs.lstatSync(flagPath);
    if (stat.isSymbolicLink() || stat.size > 128) return null;
    const raw = fs.readFileSync(flagPath, 'utf8').trim();
    const [name, level] = raw.split(':');
    const persona = personas.get(name);
    if (!persona) return null;
    const validLevel = persona.levels.find(l => l.level === level);
    if (!validLevel) return null;
    return { persona, level };
  } catch (e) {
    return null;
  }
}

function safeWriteFlag(name, level) {
  try {
    fs.writeFileSync(flagPath, `${name}:${level}`, { mode: 0o600 });
  } catch (e) {}
}

// ---------------------------------------------------------------------------
// Reminder builder (generic — works for any parsed persona)
// ---------------------------------------------------------------------------

function buildReminder(persona, level) {
  const levelEntry = persona.levels.find(l => l.level === level);
  const levelDesc  = levelEntry ? levelEntry.description : '';
  return (
    `${persona.name.toUpperCase()} PERSONA ACTIVE (${level}). ` +
    `${persona.description ? persona.description + '. ' : ''}` +
    `Current intensity — ${level}: ${levelDesc} ` +
    `Stay in character. Technical accuracy must be maintained.`
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

let input = '';
process.stdin.on('data', chunk => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data    = JSON.parse(input);
    const prompt  = (data.prompt || '').trim();
    const lower   = prompt.toLowerCase();

    const personas = discoverPersonas();

    // --- Detect stop / normal mode ---
    const stopAll =
      /\bnormal mode\b/i.test(lower) ||
      [...personas.keys()].some(name => {
        const n = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return (
          new RegExp(`\\b(stop|disable|deactivate)\\b.*\\b${n}\\b`, 'i').test(lower) ||
          new RegExp(`\\b${n}\\b.*\\b(stop|disable|deactivate)\\b`, 'i').test(lower)
        );
      });

    if (stopAll) {
      try { fs.unlinkSync(flagPath); } catch (e) {}
      // Don't re-activate on the same turn that stops a persona
      process.stdout.write('{}');
      return;
    }

    // --- Detect activation ---
    // Slash command /name [level] OR any trigger phrase from SKILL.md description.
    // Trigger phrases use includes() — \b word boundaries don't work for Korean/Japanese.
    for (const [name, persona] of personas) {
      const n = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const slashMatch = new RegExp(`^/${n}(?:\\s+(\\S+))?$`, 'i').exec(lower);
      const phraseHit = !slashMatch && (persona.triggerPhrases || []).some(
        p => lower.includes(p.toLowerCase())
      );

      if (slashMatch || phraseHit) {
        let level = persona.defaultLevel;
        const arg = slashMatch ? (slashMatch[1] || '').toLowerCase() : '';
        if (arg && persona.levels.find(l => l.level === arg)) {
          level = arg;
        } else {
          for (const { level: lvl } of persona.levels) {
            if (lower.includes(lvl)) { level = lvl; break; }
          }
        }
        safeWriteFlag(name, level);
        break;
      }
    }

    // --- Per-turn reminder ---
    const active = safeReadFlag(personas);
    if (active) {
      const reminder = buildReminder(active.persona, active.level);
      process.stdout.write(JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'UserPromptSubmit',
          additionalContext: reminder,
        },
      }));
    }
  } catch (e) {
    // Silent fail — never block the user's prompt
  }
});
