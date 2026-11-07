import { readFileSync } from 'node:fs';
import { labs } from './labs.mjs';

const runner = readFileSync(new URL('../templates/status.mjs', import.meta.url), 'utf8');
const json = value => JSON.stringify(value, null, 2) + '\n';

const packageFile = json({
  name: 'edutec-ai-basic-lab',
  private: true,
  type: 'module',
  scripts: { start: 'node scripts/status.mjs', test: 'tsc && node --test tests/index.test.mjs', typecheck: 'tsc --noEmit' },
  devDependencies: { typescript: '5.9.3' },
});

const tsconfig = json({
  compilerOptions: {
    target: 'ES2022', module: 'NodeNext', moduleResolution: 'NodeNext',
    strict: true, noEmitOnError: true, rootDir: 'src', outDir: 'dist',
  },
  include: ['src/**/*.ts'],
});

const instructions = {
  '13.01': ['Исправь день встречи, сохрани время.', 'Fix the meetup day; keep the time.'],
  '13.02': ['Добавь описание проблемы к номеру заказа.', 'Include the problem next to the order number.'],
  '13.03': ['Добавь сообщение в конец нового массива.', 'Append a message without changing the input array.'],
  '13.04': ['Считай пустой заголовок незаполненным.', 'Treat a blank title as missing input.'],
  '13.05': ['Дождись результата перед сборкой строки.', 'Wait for the result before building the status.'],
  '14.01': ['Проверь имя модели до выполнения запроса.', 'Check the model name before sending a request.'],
  '14.02': ['Добавь вопрос пользователя после системного правила.', 'Include the user question after the system instruction.'],
  '14.03': ['Обработай HTTP-ошибку до чтения ответа.', 'Handle an HTTP error before reading the reply.'],
  '14.04': ['Примени отдельные ставки для входа и выхода.', 'Apply separate rates to input and output.'],
  '14.05': ['Передай историю вместе с новым сообщением.', 'Send the history along with the new message.'],
};

export function branchName(id, mode) {
  if (!labs.has(id) || !['lesson', 'answer'].includes(mode)) throw new Error('Unknown lab or branch mode');
  return mode + '-basic-' + id.replace('.', '-');
}

export function createProject(id, mode) {
  const branch = branchName(id, mode);
  const lab = labs.get(id);
  return {
    'package.json': packageFile,
    'tsconfig.json': tsconfig,
    '.stackblitzrc': json({ startCommand: 'npm start' }),
    '.gitignore': 'node_modules/\ndist/\n',
    'README.md': '# AI Basic ' + id + '\n\n' + instructions[id].join('\n\n')
      + '\n\nOpen `src/index.ts` and check the terminal. Manual check: `npm test`. '
      + 'No API key or network request is used.\n\nBranch: `' + branch + '`.\n',
    'src/index.ts': mode === 'lesson' ? lab.starter : lab.solution,
    'tests/index.test.mjs': lab.tests,
    'scripts/status.mjs': runner,
  };
}
