import assert from 'node:assert/strict';
import { test } from 'node:test';
import { summarizeOrder } from '../dist/index.js';

test('uses the number and the issue', () => assert.equal(summarizeOrder('A48', 'late'), 'Order A48: late'));
test('works with a different order and issue', () => assert.equal(summarizeOrder('B02', 'no email'), 'Order B02: no email'));
