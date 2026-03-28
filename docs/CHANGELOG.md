# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Playwright smoke test (`e2e/smoke.spec.ts`) with `playwright.config.ts`; dev server for e2e uses port **4173** so runs do not attach to another app on **8080**.
- Pure counter helpers in `src/lib/counter-utils.ts` with `counter-utils.test.ts`.
- Unit tests: `Counter.test.tsx`, `App.test.tsx`, `NotFound.test.tsx`, `utils.test.ts`.
- Vitest V8 coverage (`@vitest/coverage-v8`), `npm run test:coverage`, thresholds for app-scoped files, HTML/text reporters; `coverage/` gitignored.

### Changed

- `package.json` name: `count-numbers-up-fast`.
- `README.md`: real project description, run/test instructions (including `test:coverage` and `test:e2e`).
- `Counter.tsx` uses shared `counter-utils`; target validation and FPS parsing tested at the helper layer.
- `src/index.css`: Google Fonts `@import` moved above `@tailwind` so the Vite CSS pipeline stops warning.

### Removed

- Duplicate Radix toast stack: `toaster.tsx`, `toast.tsx`, `hooks/use-toast.ts`, `components/ui/use-toast.ts`, dependency `@radix-ui/react-toast`; **Sonner** remains as the only toaster in `App.tsx`.
- Unused `src/components/NavLink.tsx`.
- Placeholder `src/test/example.test.ts`.
