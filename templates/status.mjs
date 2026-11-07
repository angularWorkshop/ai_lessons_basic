import { watchFile } from 'node:fs';
import { spawn } from 'node:child_process';

let pending = false;
let running = false;

function check() {
  if (running) {
    pending = true;
    return;
  }
  running = true;
  console.log('\nChecking src/index.ts ...');
  const processCheck = spawn('npm', ['test'], { stdio: 'inherit', shell: process.platform === 'win32' });
  processCheck.once('error', () => console.error('Could not start npm test.'));
  processCheck.once('close', code => {
    console.log(code === 0 ? 'ASSIGNMENT STATUS: COMPLETED' : 'ASSIGNMENT STATUS: NOT COMPLETED');
    running = false;
    if (pending) {
      pending = false;
      check();
    }
  });
}

watchFile('src/index.ts', { interval: 600 }, check);
check();
