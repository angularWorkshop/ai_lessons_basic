import assert from 'node:assert/strict';
import { test } from 'node:test';
import { meetupNote } from '../dist/index.js';

test('the notice says Saturday', () => assert.match(meetupNote(), /Saturday/));
test('the time is still 11:00', () => assert.match(meetupNote(), /11:00/));
