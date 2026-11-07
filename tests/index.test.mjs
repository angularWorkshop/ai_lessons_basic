import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildRequest } from '../dist/index.js';

test('preserves the model name', () => assert.equal(buildRequest('demo', 'Where?').model, 'demo'));
test('sends system instruction before the user question', () => {
  const question = 'Where is order A48?';
  assert.deepEqual(buildRequest('demo', question).messages, [
    { role: 'system', content: 'Use only confirmed facts.' },
    { role: 'user', content: question },
  ]);
});
test('uses the provided question, not a fixed sample', () => {
  assert.equal(buildRequest('demo', 'What time?').messages[1]?.content, 'What time?');
});
