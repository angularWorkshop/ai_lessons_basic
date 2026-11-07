import assert from 'node:assert/strict';
import { test } from 'node:test';
import { describeStatus } from '../dist/index.js';

test('uses the resolved status', async () => {
  assert.equal(await describeStatus(async () => 'in transit'), 'Status: in transit');
});
test('does not replace a resolved empty value with the promise', async () => {
  assert.equal(await describeStatus(async () => ''), 'Status: ');
});
