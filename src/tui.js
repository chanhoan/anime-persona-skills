'use strict';

const readline = require('node:readline');
const { AGENTS } = require('./providers');

// ── ANSI helpers ────────────────────────────────────────────────────────────
const ESC = '\x1b[';
const HIDE_CURSOR = '\x1b[?25l';
const SHOW_CURSOR = '\x1b[?25h';
const CLEAR_LINE  = '\x1b[2K\r';
const up = (n) => `${ESC}${n}A`;

const bold   = (s) => `\x1b[1m${s}\x1b[0m`;
const dim    = (s) => `\x1b[2m${s}\x1b[0m`;
const cyan   = (s) => `\x1b[36m${s}\x1b[0m`;
const pink   = (s) => `\x1b[35m${s}\x1b[0m`;
const green  = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;

// ── Banner (portrait left, text right) ──────────────────────────────────────
const MARIN_ART = require('./marin-ascii');
const ART_WIDTH = MARIN_ART.WIDTH; // 40

const RIGHT_TEXT = [
  '',
  '',
  `  ${yellow('★')} ${bold('anime-persona-skills')}`,
  `  ${dim('  persona skills for AI coding agents')}`,
  '',
  `  ${pink('♡')}  ${bold('marin')}   ${dim('· My Dress-Up Darling')}`,
  `  ${pink('♡')}  ${bold('emilia')}  ${dim('· Re:Zero')}`,
  `  ${pink('♡')}  ${dim('+more coming soon')}`,
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  `  ${dim('↵')}  ${bold('Press Enter')} ${dim('to install')}`,
  '',
];

function buildBanner() {
  const artLines = MARIN_ART.render();

  // sparkle line — dynamically fill full width (art + sep + right text)
  // visible width needed: ART_WIDTH(40) + sep(3) + longest right text(~39) = ~82
  const TARGET = ART_WIDTH + 3 + 42;
  const gemPat = [yellow('✦'), pink('✧'), yellow('✦'), pink('✦'), yellow('✧'), pink('✦')];
  const sparkleItems = [];
  let gi = 0;
  while (sparkleItems.length === 0 || sparkleItems.length * 2 - 1 < TARGET) {
    sparkleItems.push(gi % 2 === 0 ? gemPat[Math.floor(gi / 2) % gemPat.length] : dim('·'));
    gi++;
  }
  const sparkleLine = sparkleItems.join(' ');

  const rows = artLines.map((artLine, i) => {
    const text = RIGHT_TEXT[i] || '';
    return artLine + '   ' + text;
  });

  return [sparkleLine, ...rows, sparkleLine].join('\n');
}

const BANNER = buildBanner();

// ── Arrow-key checkbox select ───────────────────────────────────────────────
function checkboxSelect(title, items) {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY) {
      reject(new Error('interactive selection requires a TTY; use --non-interactive with explicit --agent and --character flags'));
      return;
    }

    const out = process.stdout;
    let cursor = 0;
    const selected = new Set(); // none pre-selected

    function render(firstRender) {
      if (!firstRender) out.write(up(items.length + 2));

      out.write(CLEAR_LINE + bold(cyan(`  ${title}`) + '\n'));
      out.write(CLEAR_LINE + dim('  ↑↓: navigate  space: select/deselect  a: toggle all  enter: confirm\n'));

      for (let i = 0; i < items.length; i++) {
        const isCursor   = i === cursor;
        const isSelected = selected.has(i);
        const check = isSelected ? pink('◉') : dim('○');
        const label = isCursor
          ? bold(`  ${check}  ${items[i].label}`)
          : `  ${check}  ${dim(items[i].label)}`;
        out.write(CLEAR_LINE + label + '\n');
      }
    }

    out.write(HIDE_CURSOR);
    render(true);

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    function cleanup() {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdin.removeListener('data', onKey);
      process.stdin.removeListener('error', onError);
      out.write(SHOW_CURSOR);
    }

    function onError(err) {
      cleanup();
      reject(err);
    }

    function onKey(key) {
      if (key === '\x03') { cleanup(); process.exit(0); }

      if (key === '\x1b[A' || key === 'k') {           // up
        cursor = (cursor - 1 + items.length) % items.length;
      } else if (key === '\x1b[B' || key === 'j') {    // down
        cursor = (cursor + 1) % items.length;
      } else if (key === ' ') {                         // space — toggle
        if (selected.has(cursor)) selected.delete(cursor);
        else selected.add(cursor);
      } else if (key === 'a') {                         // a — toggle all
        if (selected.size === items.length) selected.clear();
        else items.forEach((_, i) => selected.add(i));
      } else if (key === '\r' || key === '\n') {        // enter — confirm
        cleanup();
        const ids = [...selected].sort().map((i) => items[i].id);
        resolve(ids);
        return;
      }

      render(false);
    }

    process.stdin.on('data', onKey);
    process.stdin.once('error', onError);
  });
}

// ── Main TUI ─────────────────────────────────────────────────────────────────
function waitForEnter() {
  return new Promise((resolve) => {
    if (!process.stdin.isTTY) { resolve(); return; }
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    function onKey(key) {
      if (key === '\x03') { process.exit(0); }
      if (key === '\r' || key === '\n') {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.removeListener('data', onKey);
        resolve();
      }
    }
    process.stdin.on('data', onKey);
  });
}

async function runTui({ characters, preselectedAgents, preselectedCharacters }) {
  process.stdout.write('\n' + BANNER + '\n\n');
  await waitForEnter();
  process.stdout.write('\n');

  const agents = preselectedAgents.length
    ? preselectedAgents
    : await checkboxSelect('Select AI agents', AGENTS);

  process.stdout.write('\n');

  const selectedCharacters = preselectedCharacters.length
    ? preselectedCharacters
    : await checkboxSelect(
        'Select characters',
        characters.map((c) => ({
          id: c.name,
          label: `${c.name}  ${dim('—')}  ${c.description.slice(0, 60)}`,
        })),
      );

  process.stdout.write('\n');
  process.stdout.write(bold('  Summary\n'));
  process.stdout.write(`  Agents:     ${green(agents.join(', '))}\n`);
  process.stdout.write(`  Characters: ${green(selectedCharacters.join(', '))}\n\n`);

  const confirmed = await confirmPrompt('  Install? [Y/n] ');
  if (!confirmed) throw new Error('installation cancelled');

  return { agents, characters: selectedCharacters };
}

function confirmPrompt(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (ans) => {
      rl.close();
      const t = ans.trim().toLowerCase();
      resolve(t !== 'n' && t !== 'no');
    });
  });
}

module.exports = { runTui, checkboxSelect };
