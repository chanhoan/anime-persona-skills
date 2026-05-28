const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');
const { AGENTS } = require('./providers');

async function runTui({ characters, preselectedAgents, preselectedCharacters }) {
  const rl = readline.createInterface({ input, output });
  try {
    const agents = preselectedAgents.length
      ? preselectedAgents
      : await promptMultiSelect(rl, 'AI 모델/agent 앱 선택', AGENTS);
    const selectedCharacters = preselectedCharacters.length
      ? preselectedCharacters
      : await promptMultiSelect(
          rl,
          '캐릭터 선택',
          characters.map((character) => ({
            id: character.name,
            label: `${character.name} - ${character.description.slice(0, 70)}`,
          })),
        );

    output.write('\n선택 요약\n');
    output.write(`Agents: ${agents.join(', ')}\n`);
    output.write(`Characters: ${selectedCharacters.join(', ')}\n`);
    const confirm = (await rl.question('설치할까? [Y/n] ')).trim().toLowerCase();
    if (confirm === 'n' || confirm === 'no') {
      throw new Error('installation cancelled');
    }

    return { agents, characters: selectedCharacters };
  } finally {
    rl.close();
  }
}

async function promptMultiSelect(rl, title, items) {
  output.write(`\n${title}\n`);
  items.forEach((item, index) => {
    output.write(`  ${index + 1}. ${item.label}\n`);
  });
  output.write('쉼표로 여러 개 선택, Enter = 전체 선택\n');

  const answer = (await rl.question('> ')).trim();
  if (!answer) return items.map((item) => item.id);

  const indexes = answer.split(',').map((part) => Number.parseInt(part.trim(), 10));
  if (indexes.some((index) => !Number.isInteger(index) || index < 1 || index > items.length)) {
    throw new Error(`invalid selection: ${answer}`);
  }

  return indexes.map((index) => items[index - 1].id);
}

module.exports = { runTui, promptMultiSelect };
