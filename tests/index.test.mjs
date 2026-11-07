import assert from 'node:assert/strict';
import { test } from 'node:test';
import { handleReply } from '../dist/index.js';

test('reads a valid successful response', async () => {
  assert.equal(await handleReply(async () => ({ ok: true, status: 200, json: async () => ({ text: 'Ready' }) })), 'Ready');
});
test('rejects non-OK status before reading a valid-looking body', async () => {
  let bodyReads = 0;
  const json = async () => { bodyReads++; return { text: 'Not a result' }; };
  await assert.rejects(handleReply(async () => ({ ok: false, status: 503, json })), /HTTP 503/);
  assert.equal(bodyReads, 0);
});
test('rejects unexpected response data', async () => {
  await assert.rejects(handleReply(async () => ({ ok: true, status: 200, json: async () => ({ text: 42 }) })), /no text/);
});
test('does not disguise a network failure', async () => {
  await assert.rejects(handleReply(async () => { throw new Error('Offline'); }), /Offline/);
});
