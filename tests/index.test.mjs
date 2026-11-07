import assert from 'node:assert/strict';
import { test } from 'node:test';
import { handleReply } from '../dist/index.js';

test('reads a valid successful response', async () => {
  assert.equal(await handleReply(async () => ({ ok: true, status: 200, json: async () => ({ text: 'Ready' }) })), 'Ready');
});
test('rejects non-OK status even if the body looks valid', async () => {
  await assert.rejects(handleReply(async () => ({ ok: false, status: 503, json: async () => ({ text: 'Not a result' }) })), /HTTP 503/);
});
test('rejects unexpected response data', async () => {
  await assert.rejects(handleReply(async () => ({ ok: true, status: 200, json: async () => ({ text: 42 }) })), /no text/);
});
test('does not disguise a network failure', async () => {
  await assert.rejects(handleReply(async () => { throw new Error('Offline'); }), /Offline/);
});
