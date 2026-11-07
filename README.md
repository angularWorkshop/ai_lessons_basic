# Edutec AI Basic Practice

This repository contains the starter and reference projects for the 10 editor labs in AI Basic (sections 13–14). The full course text and the no-code practice stay in Edutec.

- Start with a branch named `lesson-basic-13-01` (IDs run from 13-01 to 14-05).
- The matching `answer-basic-13-01` branch contains the reference implementation.
- Open `src/index.ts`, complete the TODO, and check the terminal. To verify manually, run `npm test`.
- Projects use a mock model. Do not add an API key or change the tests.

`npm ci && npm test` on `main` checks every starter, tests each reference fix in the corresponding starter, and verifies that the status runner detects a save. `npm run branches` prepares the Git refs locally. After a verified change, `npm run branches -- --update` appends commits to the existing refs; publishing is a separate fast-forward Git push.
