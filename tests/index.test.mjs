import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createSession } from '../dist/index.js';

test('passes the first user message and returns the reply', async () => {
  const session = createSession(async messages => {
    assert.deepEqual(messages, [{ role: 'user', content: 'Order A48?' }]);
    return 'Ready';
  });
  assert.equal(await session.send('Order A48?'), 'Ready');
});
test('sends earlier turns before the follow-up', async () => {
  const calls = [];
  const session = createSession(async messages => { calls.push(messages); return 'Ready'; });
  await session.send('Order A48?');
  await session.send('And tomorrow?');
  assert.deepEqual(calls[1], [
    { role: 'user', content: 'Order A48?' },
    { role: 'assistant', content: 'Ready' },
    { role: 'user', content: 'And tomorrow?' },
  ]);
});
test('a failed exchange does not add a turn or erase earlier history', async () => {
  const calls = [];
  const session = createSession(async messages => {
    calls.push(messages);
    if (calls.length === 2) throw new Error('Offline');
    return 'Ready';
  });
  await session.send('Order A48?');
  await assert.rejects(session.send('Failed turn'), /Offline/);
  await session.send('Retry');
  assert.deepEqual(calls[2], [
    { role: 'user', content: 'Order A48?' },
    { role: 'assistant', content: 'Ready' },
    { role: 'user', content: 'Retry' },
  ]);
});
test('reset discards old turns', async () => {
  const calls = [];
  const session = createSession(async messages => { calls.push(messages); return 'Ready'; });
  await session.send('Old question');
  session.reset();
  await session.send('New question');
  assert.deepEqual(calls[1], [{ role: 'user', content: 'New question' }]);
});
