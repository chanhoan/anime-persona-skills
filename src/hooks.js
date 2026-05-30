'use strict';

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const HOOK_FILENAME = 'anime-persona-tracker.js';
const HOOK_MARKER = 'anime-persona-tracker'; // used to detect existing entry (idempotent)

function getClaudeDir(overrides = {}) {
  return (
    overrides.claudeDir ||
    process.env.CLAUDE_CONFIG_DIR ||
    path.join(os.homedir(), '.claude')
  );
}

/**
 * Copy the hook script to ~/.claude/hooks/ and register it in
 * ~/.claude/settings.json under hooks.UserPromptSubmit.
 * Both operations are idempotent.
 */
function installHook(repoRoot, { claudeDir, dryRun = false, force = false } = {}) {
  const targetDir = getClaudeDir({ claudeDir });
  const hooksDir = path.join(targetDir, 'hooks');
  const hookSrc = path.join(repoRoot, 'hooks', HOOK_FILENAME);
  const hookDest = path.join(hooksDir, HOOK_FILENAME);
  const settingsPath = path.join(targetDir, 'settings.json');

  const result = { hookWritten: false, hookSkipped: false, settingsPatched: false };

  // --- 1. Copy hook script ---
  if (!dryRun) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  const hookExists = fs.existsSync(hookDest);
  if (!hookExists || force) {
    if (!dryRun) fs.copyFileSync(hookSrc, hookDest);
    result.hookWritten = true;
  } else {
    result.hookSkipped = true;
  }

  // --- 2. Patch settings.json ---
  let settings = {};
  try {
    const raw = fs.readFileSync(settingsPath, 'utf8');
    settings = JSON.parse(raw);
  } catch (e) {
    // Missing or invalid — start fresh
    settings = {};
  }

  if (!settings.hooks) settings.hooks = {};
  if (!Array.isArray(settings.hooks.UserPromptSubmit)) {
    settings.hooks.UserPromptSubmit = [];
  }

  // Idempotency: skip if a hook command already references this tracker
  const alreadyRegistered = settings.hooks.UserPromptSubmit.some((entry) =>
    (entry.hooks || []).some(
      (h) => typeof h.command === 'string' && h.command.includes(HOOK_MARKER),
    ),
  );

  if (!alreadyRegistered) {
    const entry = {
      hooks: [
        {
          type: 'command',
          command: `"${process.execPath}" "${hookDest}"`,
          timeout: 5,
          statusMessage: 'Tracking anime persona...',
        },
      ],
    };
    if (!dryRun) {
      settings.hooks.UserPromptSubmit.push(entry);
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + '\n', {
        mode: 0o600,
      });
    }
    result.settingsPatched = true;
  }

  return result;
}

module.exports = { installHook };
