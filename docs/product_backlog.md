# Product Backlog — Count Numbers Up Fast

**App:** Count Numbers Up Fast  
**Stack:** React + Vite + TypeScript + shadcn-ui (Lovable-generated)  
**Goal:** Animated counter that counts up to a target number with configurable speed.

---

## Legend

| Symbol | Meaning                           |
| ------ | --------------------------------- |
| **P0** | Must-have — blocks launch         |
| **P1** | Important — needed soon           |
| **P2** | Nice-to-have — future enhancement |
| **P3** | Low priority / Backlog            |
| **S**  | Small — ≤ 2 hours                 |
| **M**  | Medium — 2–6 hours                |
| **L**  | Large — 6+ hours                  |

---

## Phase 1: Hygiene

| #   | Task                       | Priority | Effort | Status      | Details |
| --- | -------------------------- | -------- | ------ | ----------- | ------- |
| 1.3 | Remove unused dependencies | P1       | M      | Not started | **File:** `package.json` lines 17–65 (dependencies) and lines 67–89 (devDependencies). The app uses only 1 component (`src/components/Counter.tsx`) which imports `button`, `input` from shadcn-ui and `lucide-react` icons. **Production deps to REMOVE (25):** `@hookform/resolvers`, `@radix-ui/react-accordion`, `@radix-ui/react-alert-dialog`, `@radix-ui/react-aspect-ratio`, `@radix-ui/react-avatar`, `@radix-ui/react-checkbox`, `@radix-ui/react-collapsible`, `@radix-ui/react-context-menu`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-hover-card`, `@radix-ui/react-menubar`, `@radix-ui/react-navigation-menu`, `@radix-ui/react-popover`, `@radix-ui/react-progress`, `@radix-ui/react-radio-group`, `@radix-ui/react-scroll-area`, `@radix-ui/react-select`, `@radix-ui/react-separator`, `@radix-ui/react-slider`, `@radix-ui/react-switch`, `@radix-ui/react-tabs`, `@radix-ui/react-toggle`, `@radix-ui/react-toggle-group`. **Also remove:** `@tanstack/react-query` (used only in `App.tsx` `QueryClientProvider` wrapper — remove wrapper too), `cmdk`, `date-fns`, `embla-carousel-react`, `input-otp`, `next-themes`, `react-day-picker`, `react-hook-form`, `react-resizable-panels`, `react-router-dom` (only 2 trivial routes `/` and `*` in `src/App.tsx` — inline or remove routing), `recharts`, `vaul`, `zod`. **Dev dep to REMOVE:** `lovable-tagger` (line 82). **KEEP:** `react`, `react-dom`, `lucide-react`, `sonner`, `@radix-ui/react-slot` (used by shadcn Button), `@radix-ui/react-label` (used by shadcn Input), `@radix-ui/react-tooltip` (used in `App.tsx`), `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss-animate`. Also delete the corresponding unused `src/components/ui/*.tsx` wrapper files (40+ files) after confirming they are not imported. |

**Further thinking — 1.3:** Do this as a **single focused PR** after trimming routing (`react-router-dom` → render `Index` only or Vite multi-page) and removing `QueryClientProvider` if nothing uses React Query. Order: (1) grep imports across `src/` for what Counter + `App` + `main` need; (2) drop packages in batches and run `npm run build` + `npm test` + `npm run test:e2e` after each batch; (3) delete orphaned `src/components/ui/*` in one pass; (4) optionally replace `sonner`’s `next-themes` coupling with a fixed `theme="light"` to remove `next-themes`. **Risk:** shadcn re-exports and Tailwind content paths—verify `tailwind.config.ts` still scans only used files.

---

## Cross-Project Observability & Debugging System

**Local progress (this repo only):** Playwright smoke (`e2e/smoke.spec.ts`, port **4173** in `playwright.config.ts`). Unit tests and V8 coverage via `npm test` / `npm run test:coverage`. **Supabase / Sentry / Clarity / Langfuse** below are **not** implemented here yet.

**Goal:** Give AI agents and developers real production debugging context across all side projects.

**Stack baseline:**

- Supabase: canonical event and debug case database
- Sentry: errors and technical observability across all platforms
- Microsoft Clarity: session replay for browser apps
- Langfuse: AI traces and evals (only where AI exists)
- Playwright: synthetic screenshots and regression checks

**Sources of truth:**

- Supabase: product telemetry and unified debug cases
- Sentry: technical failures
- Clarity: user session replay
- Langfuse: AI traces and prompt failures

**Outcome:** Any failure can be inspected via one Supabase debug case record that links all evidence.

### Phase 1 - Core Foundation (Supabase + Sentry)

**Goal:** Create a single debugging pipeline used by every project.

#### Task 1 - Create Supabase Observability Schema

Create tables:

- `projects`
- `sessions`
- `workflow_runs`
- `issues`
- `feedback`
- `ai_traces`
- `debug_cases`
- `artifacts`

Example structure:

`projects`

- `id`
- `name`
- `platform_type` (`n8n | chrome_extension | web_app`)
- `repo_url`
- `created_at`

`workflow_runs`

- `id`
- `project_id`
- `execution_id`
- `platform`
- `status`
- `input_json`
- `output_json`
- `started_at`
- `ended_at`

`issues`

- `id`
- `project_id`
- `severity`
- `title`
- `description`
- `source` (`sentry | n8n | user_report | ai_eval`)
- `status`
- `created_at`

`debug_cases`

- `id`
- `project_id`
- `issue_id`
- `workflow_run_id`
- `sentry_issue_url`
- `clarity_session_url`
- `screenshot_url`
- `ai_trace_id`
- `status`
- `created_at`

Acceptance criteria:

- One database can store failures from every project.

#### Task 2 - Standardize Event Logging Library

Create a small reusable helper used by:

- n8n
- Chrome extensions
- web apps
- local scripts

Example events:

- `workflow_run_started`
- `workflow_run_completed`
- `workflow_run_failed`
- `user_feedback`
- `ai_trace_failed`
- `feature_event`

Acceptance criteria:

- All projects send structured events to Supabase.

#### Task 3 - Install Sentry Across All Projects

Platforms:

- web apps
- Chrome extensions
- Node scripts
- backend services

Configure:

- release version
- environment
- project tags

Acceptance criteria:

- Every runtime reports errors to one Sentry organization.

#### Task 4 - Link Sentry Issues to Supabase

Create webhook or worker that:

- receives Sentry issue events
- inserts `issues` row
- creates `debug_cases` record

Acceptance criteria:

- Every Sentry issue creates a debug case.

### Phase 3 - Browser Observability

**Goal:** Capture user behavior before bugs.

#### Task 7 - Add Microsoft Clarity to Web Apps

Add Clarity script to:

- Lovable apps
- personal web apps

Capture:

- session recordings
- heatmaps
- user click paths

Acceptance criteria:

- Each user session has replay available.

#### Task 8 - Link Clarity Sessions to Debug Cases

When bug is reported, store `clarity_session_url` inside `debug_cases`.

Acceptance criteria:

- Each bug can link to a session replay.

### Phase 6 - Synthetic Debug Evidence

**Goal:** Automatically detect UI breakage.

#### Task 13 - Playwright Visual Checks

Create daily test:

- open web app
- open extension popup
- take screenshot

Compare with baseline.

Acceptance criteria:

- Visual regressions detected automatically.

### Phase 7 - Debug Context Broker

**Goal:** Allow AI agents to debug from real evidence.

Create service or n8n workflow: `debug-broker`

Input:

- `debug_case_id`

Fetch:

- Supabase events
- Sentry issue
- Clarity session
- screenshots
- Langfuse trace

Return:

- debug bundle JSON

Example:

```json
{
  "issue_summary": "",
  "stack_trace": "",
  "workflow_inputs": {},
  "workflow_outputs": {},
  "session_replay": "",
  "screenshot": "",
  "ai_trace": "",
  "repro_steps": []
}
```

Acceptance criteria:

- AI agent can debug using one bundle.

### Operational Rules

All projects must:

- log events to Supabase
- report errors to Sentry
- create `debug_case` on failures

Debug cases are the primary object AI agents read.
