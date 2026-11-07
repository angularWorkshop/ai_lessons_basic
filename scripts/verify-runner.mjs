import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';
import { createProject } from '../lib/project.mjs';

const dir = mkdtempSync(join(tmpdir(), 'edutec-ai-basic-runner-'));
for (const [name, content] of Object.entries(createProject('13.01', 'lesson'))) {
  const path = join(dir, name);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

const bins = fileURLToPath(new URL('../node_modules/.bin/', import.meta.url));
const runner = spawn(process.execPath, ['scripts/status.mjs'], {
  cwd: dir,
  env: { ...process.env, PATH: bins + delimiter + process.env.PATH },
  stdio: ['ignore', 'pipe', 'pipe'],
});
let output = '';
runner.stdout.on('data', chunk => { output += chunk; });
runner.stderr.on('data', chunk => { output += chunk; });

async function waitFor(marker) {
  const deadline = Date.now() + 20_000;
  while (!output.includes(marker) && Date.now() < deadline && runner.exitCode === null) await sleep(50);
  assert.ok(output.includes(marker), output);
}

try {
  await waitFor('ASSIGNMENT STATUS: NOT COMPLETED');
  writeFileSync(join(dir, 'src/index.ts'), createProject('13.01', 'answer')['src/index.ts']);
  await waitFor('ASSIGNMENT STATUS: COMPLETED');
  console.log('The status runner starts, detects a save, and changes NOT COMPLETED to COMPLETED.');
} finally {
  runner.kill();
}
