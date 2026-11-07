import assert from 'node:assert/strict';
import { test } from 'node:test';
import { addUserMessage } from '../dist/index.js';

test('starts a conversation with the new message', () => {
  assert.deepEqual(addUserMessage([], 'Hello'), [{ role: 'user', content: 'Hello' }]);
});
test('appends after the previous reply without changing the input', () => {
  const first = { role: 'assistant', content: 'Ready' };
  const history = [first];
  const before = structuredClone(history);
  assert.deepEqual(addUserMessage(history, 'Status?'), [...before, { role: 'user', content: 'Status?' }]);
  assert.deepEqual(history, before);
});
