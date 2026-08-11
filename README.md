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
