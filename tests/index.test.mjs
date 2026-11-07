import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ticketState } from '../dist/index.js';

test('a missing title needs input', () => assert.equal(ticketState(), 'needs-input'));
test('whitespace is not a title', () => assert.equal(ticketState('   '), 'needs-input'));
test('a title with text is ready', () => assert.equal(ticketState(' A48 '), 'ready'));
