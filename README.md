# saucedemo-e2e

A TypeScript end-to-end test project using Playwright for the Sauce Demo sample application.

## Setup

From the project root:

```bash
npm install
npx playwright install
```

## Run tests

```bash
npm test
```

## Project files

- `package.json` — project metadata and test scripts
- `tsconfig.json` — TypeScript compiler options
- `playwright.config.ts` — Playwright test configuration
- `tests/saucedemo.spec.ts` — example test file

## Notes

- `npm test` runs the Playwright test runner.
- Use `npm run test:headed` to run tests with a visible browser window.


## Assumptions & limitations

- Tests target the public demo site at https://www.saucedemo.com; availability or UI changes on that site may break tests.
- Local environment must have a Chrome-compatible browser installed (Playwright will download browser binaries with npx playwright install).
- Tests are not hardened for flaky network conditions.

## What I'd improve with more time

- Add environment-specific configs for CI vs local (disable slowMo in CI).
- Add test tags and filtration, and a small CI pipeline (GitHub Actions) with Playwright reporter artifacts.
