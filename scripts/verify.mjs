import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { labs } from '../lib/labs.mjs';
import { createProject } from '../lib/project.mjs';

const tsc = createRequire(import.meta.url).resolve('typescript/bin/tsc');
const folder = mkdtempSync(join(tmpdir(), 'edutec-ai-basic-'));
const run = (cwd, ...args) => spawnSync(process.execPath, args, { cwd, encoding: 'utf8' });
const regressions = new Map([
  ['13.01', [source => source.replace('Meeting Saturday', 'Meeting Friday or Saturday'), 'replaces Friday']],
  ['13.03', [source => source.replace('  return [...messages,', "  if (messages[0]) messages[0].content = 'Changed';\n  return [...messages,"), 'without changing the input']],
  ['14.03', [source => source.replace(
    "  if (!response.ok) throw new Error('HTTP ' + response.status);\n  const body = await response.json();",
    "  const body = await response.json();\n  if (!response.ok) throw new Error('HTTP ' + response.status);",
  ), 'before reading']],
  ['14.05', [source => source.replace(
    'await ask([...history, next]);',
    'await ask([...history, next]).catch(error => { history = []; throw error; });',
  ), 'does not add a turn or erase']],
]);

for (const id of labs.keys()) {
  const cwd = join(folder, id);
  const starter = createProject(id, 'lesson');
  const answer = createProject(id, 'answer');
  assert.equal(starter['tests/index.test.mjs'], answer['tests/index.test.mjs']);
  for (const [name, content] of Object.entries(starter)) {
    const file = join(cwd, name);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, content);
  }
  let result = run(cwd, tsc);
  assert.equal(result.status, 0, id + ' starter must typecheck\n' + result.stdout + result.stderr);
  result = run(cwd, '--test', 'tests/index.test.mjs');
  assert.equal(result.status, 1, id + ' must start with a failed test');
  assert.match(result.stdout, /^not ok \d+ - /m, id + ' must fail on behavior');
  assert.doesNotMatch(result.stdout, /ERR_MODULE_NOT_FOUND|SyntaxError/, id + ' must not fail to load');
  const failureCount = Number(result.stdout.match(/^# fail (\d+)/m)?.[1]);

  writeFileSync(join(cwd, 'src/index.ts'), answer['src/index.ts']);
  result = run(cwd, tsc);
  assert.equal(result.status, 0, id + ' answer must typecheck\n' + result.stdout + result.stderr);
  result = run(cwd, '--test', 'tests/index.test.mjs');
  assert.equal(result.status, 0, id + ' solution must pass the starter tests\n' + result.stdout + result.stderr);
  const passCount = Number(result.stdout.match(/^# pass (\d+)/m)?.[1]);
  assert.ok(passCount >= 2);
  console.log(id + ': ' + failureCount + ' starter failure(s); ' + passCount + ' tests pass with reference fix');
  const regression = regressions.get(id);
  if (regression) {
    const [breakSolution, failedTest] = regression;
    const wrong = breakSolution(answer['src/index.ts']);
    assert.notEqual(wrong, answer['src/index.ts'], id + ' regression fixture was not applied');
    writeFileSync(join(cwd, 'src/index.ts'), wrong);
    result = run(cwd, tsc);
    assert.equal(result.status, 0, id + ' regression fixture must compile');
    result = run(cwd, '--test', 'tests/index.test.mjs');
    assert.equal(result.status, 1, id + ' must reject a plausible wrong solution');
    assert.match(result.stdout, new RegExp('^not ok \\d+ - .*' + failedTest, 'm'));
  }
}
console.log('Verified ' + labs.size + ' editor labs and ' + regressions.size + ' negative regressions.');
