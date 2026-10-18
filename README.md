# Count Numbers Up Fast

A small web app with an animated counter that counts up to a target number. You set **count to** and **speed (fps)**; the display updates smoothly until it hits the target, then shows a short completion message.

## Stack

- **React 18** with **TypeScript**
- **Vite** for dev and build
- **Tailwind CSS** and **shadcn-ui**-style components (Button, Input, Tooltip)
- **lucide-react** for icons

## Run locally

```sh
npm ci
npm run dev
```

The dev server listens on port **8080** (see `vite.config.ts`). Open the URL shown in the terminal (e.g. `http://localhost:8080`).

```sh
npm run build
npm run preview
```

## Tests

```sh
npm test
npm run test:coverage
npm run test:e2e
```

Unit tests use **Vitest** and **Testing Library**. `npm run test:coverage` prints a V8 coverage report for app code (`src/lib`, `Counter`, `App`, `src/pages`), excluding shadcn UI wrappers. End-to-end smoke tests use **Playwright** (Chromium).

## Documentation

- [Changelog](docs/CHANGELOG.md) (completed / shipped changes)
- [Product backlog](docs/product_backlog.md) (open tasks and cross-project observability notes)

## License

This project is licensed under the **GNU General Public License v3.0 or later** — see the [LICENSE](LICENSE) file.

## Local type verification

Run `npm run typecheck` from this repository root before handing off TypeScript changes. It checks the existing application and build configuration without emitting JavaScript. `npm run build` bundles with Vite and does not perform this type check.

Use `npm ci` for repeatable setup with the committed npm lockfile. This replaces the current checkout's dependency directory; run it inside the intended worktree.
