# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BuildWorks (project-compass) is a Hebrew, RTL project-management app for engineering/construction projects, generated with Lovable (Vite + React 18 + TypeScript + shadcn-ui + Tailwind CSS). There is no backend — all data is mock data mutated in React state.

## Commands

```sh
npm i               # install dependencies
npm run dev         # dev server on port 8080
npm run build       # production build
npm run lint        # eslint
npm run test        # run tests once (vitest)
npm run test:watch  # vitest watch mode
npx vitest run src/test/example.test.ts   # run a single test file
```

Tests use Vitest + Testing Library with jsdom, configured in `vitest.config.ts`; picks up `src/**/*.{test,spec}.{ts,tsx}` with setup in `src/test/setup.ts`.

## Architecture

**Data layer — everything flows through one context.** `src/contexts/ProjectDataContext.tsx` is the single source of truth: it seeds React state from `src/data/mockData.ts` and exposes all CRUD operations, computed stats, and per-project lookup helpers via the `useProjectData()` hook. There is no persistence — refreshing the page resets to mock data. All entity types (Project, Task, Decision, Activity, FileAttachment, BudgetItem) are defined in `src/types/project.ts`.

The context also implements cross-entity automations that must be preserved when modifying it:
- Most mutations auto-log an `Activity` entry (via internal `logActivity`) and show a toast.
- Project `progress` is derived from completed-task ratio (`computeProjectProgress`), recomputed after task changes.
- Project `budget` totals are recomputed from budget items.
- Approving a decision (`approveDecision`) cascades: a `linkedTaskId` task moves to status `ready`, and a `linkedBudgetItemId` budget item moves to `in_progress`, each with its own activity log entry.

**Routing** (`src/App.tsx`): `react-router-dom` with top-level pages in `src/pages/` (`/dashboard`, `/projects`, `/tasks`, `/decisions`, `/activity`, `/settings`) and a nested project detail route — `/projects/:projectId` renders `ProjectDetail` as a layout with child tabs from `src/pages/project/` (overview, activity, files, tasks, budget, gantt).

**Component organization** in `src/components/`:
- `ui/` — stock shadcn-ui primitives (don't hand-edit these; they follow shadcn conventions)
- `layout/` — `MainLayout` (sidebar + main), `AppSidebar`, `PageHeader`
- `dashboard/` — dashboard cards/widgets
- `modals/` — create/edit dialogs for projects, tasks, budget, files, plus `ConfirmDialog`

**Path alias**: `@/` → `src/` (configured in both `vite.config.ts` and `vitest.config.ts`).

## Conventions

- **Hebrew + RTL**: `index.html` sets `lang="he" dir="rtl"`. All user-facing strings (labels, toasts, activity titles) are in Hebrew — keep new UI text in Hebrew and mind RTL layout when styling.
- **Styling**: Tailwind with the design system defined as HSL CSS variables in `src/index.css` (including custom `--success`/`--warning`/`--info` tokens) and mapped in `tailwind.config.ts`. Use the semantic tokens rather than raw colors.
- **Toasts**: the app uses the shadcn `toast` from `@/hooks/use-toast` (rendered by `<Toaster />`); a Sonner toaster is also mounted.
- Lovable auto-commits to this repo when the project is edited via lovable.dev, and `vite.config.ts` loads `lovable-tagger` in dev mode — keep that plugin wiring intact.
