import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readSettings } from '../dist/index.js';

test('reads the configured address and model', () => {
  assert.deepEqual(readSettings({ LLM_BASE_URL: ' https://example.invalid/v1 ', LLM_MODEL: ' demo ' }),
    { baseUrl: 'https://example.invalid/v1', model: 'demo' });
});
test('rejects a missing or blank model', () => {
  for (const model of [undefined, '  ']) {
    assert.throws(() => readSettings({ LLM_BASE_URL: 'https://example.invalid/v1', LLM_MODEL: model }), /Missing LLM_MODEL/);
  }
});
test('rejects a missing address', () => assert.throws(() => readSettings({ LLM_MODEL: 'demo' }), /Missing LLM_BASE_URL/));
