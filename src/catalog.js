const fs = require('node:fs');
const path = require('node:path');

function parseFrontmatter(content, filePath) {
  if (!content.startsWith('---\n')) {
    throw new Error(`${filePath} missing YAML front matter`);
  }

  const end = content.indexOf('\n---', 4);
  if (end === -1) {
    throw new Error(`${filePath} has unterminated YAML front matter`);
  }

  const raw = content.slice(4, end).split('\n');
  const data = {};
  let currentKey = null;

  for (const line of raw) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (match) {
      currentKey = match[1];
      const value = match[2].trim();
      data[currentKey] = value === '>' || value === '|' ? '' : unquote(value);
      continue;
    }

    if (currentKey && line.startsWith('  ')) {
      data[currentKey] = `${data[currentKey]} ${line.trim()}`.trim();
    }
  }

  if (!data.name) throw new Error(`${filePath} front matter missing name`);
  if (!data.description) throw new Error(`${filePath} front matter missing description`);

  return data;
}

function unquote(value) {
  return value.replace(/^['"]|['"]$/g, '');
}

function discoverCharacters(repoRoot) {
  const charactersDir = path.join(repoRoot, 'characters');
  const entries = fs.readdirSync(charactersDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const name = entry.name;
      const dir = path.join(charactersDir, name);
      const skillPath = path.join(dir, 'SKILL.md');
      const readmePath = path.join(dir, 'README.md');

      if (!fs.existsSync(skillPath)) throw new Error(`${name} missing SKILL.md`);
      if (!fs.existsSync(readmePath)) throw new Error(`${name} missing README.md`);

      const frontmatter = parseFrontmatter(fs.readFileSync(skillPath, 'utf8'), skillPath);
      return {
        name: frontmatter.name,
        folder: name,
        description: frontmatter.description,
        dir,
        skillPath,
        readmePath,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = { discoverCharacters, parseFrontmatter };
