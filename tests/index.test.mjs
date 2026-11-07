import assert from 'node:assert/strict';
import { test } from 'node:test';
import { meetupNote } from '../dist/index.js';

test('the notice replaces Friday with Saturday', () => {
  const notice = meetupNote();
  assert.match(notice, /Saturday/);
  assert.doesNotMatch(notice, /Friday/);
});
test('the time is still 11:00', () => assert.match(meetupNote(), /11:00/));
