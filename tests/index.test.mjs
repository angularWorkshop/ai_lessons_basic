import assert from 'node:assert/strict';
import { test } from 'node:test';
import { estimateCost } from '../dist/index.js';

test('applies one unit for input and two for output', () => assert.equal(estimateCost({ input: 3, output: 4 }), 11));
test('zero is a known value', () => assert.equal(estimateCost({ input: 0, output: 0 }), 0));
test('unknown usage stays unknown', () => assert.equal(estimateCost(), null));
