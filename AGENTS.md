# Repository Guidelines

## Project Structure & Module Organization
- Monorepo managed with pnpm workspaces and Turbo.
- `apps/backend/`: NestJS API. Source in `apps/backend/src/`, Prisma schema/migrations in `apps/backend/prisma/`, tests in `apps/backend/test/`.
- `apps/frontend/`: React + Vite UI. Source in `apps/frontend/src/`, tests in `apps/frontend/test/` (Vitest + Testing Library + MSW).
- `packages/`: shared utilities such as `packages/shared-types/`, `packages/eslint-config/`, and `packages/tsconfig/`.

## Build, Test, and Development Commands
- `pnpm install`: install workspace dependencies.
- `pnpm dev`: run all dev servers via Turbo.
- `pnpm --filter @node-admin/backend start:dev`: run the NestJS API with watch mode.
- `pnpm --filter @node-admin/frontend dev`: run the Vite dev server.
- `pnpm build`: Turbo build across apps/packages.
- `pnpm lint`: run ESLint across the repo.
- `pnpm test`: run Jest (backend) and Vitest (frontend) via Turbo.
- `pnpm --filter @node-admin/backend exec prisma generate`: regenerate Prisma Client when schema changes.

## Coding Style & Naming Conventions
- TypeScript-first codebase; follow workspace ESLint rules from `@node-admin/eslint-config`.
- Prettier is enforced; key settings: 2-space indentation, single quotes, no semicolons, trailing commas, 100-char line width.
- Pre-commit runs `lint-staged` (Prettier on staged files).
- Test file patterns: backend `*.spec.ts`, frontend `*.test.tsx`.

## Testing Guidelines
- Backend: Jest (`pnpm --filter @node-admin/backend test`, `test:watch`, `test:cov`, `test:e2e`).
- Frontend: Vitest (`pnpm --filter @node-admin/frontend test`), tests live in `apps/frontend/test/` with MSW mocks in `apps/frontend/test/mocks/`.
- Keep tests colocated with the relevant app and name files to match the existing patterns.

## Commit & Pull Request Guidelines
- Commit messages follow Conventional Commits with optional scopes (e.g., `feat:`, `fix(ci):`, `refactor(system):`).
- PRs should include a clear description, link relevant issues, and add screenshots for UI changes.
- Ensure CI parity locally: run `pnpm build`, `pnpm lint`, and `pnpm test` before requesting review.

## Security & Configuration Tips
- Backend requires PostgreSQL; copy `apps/backend/.env.example` to `apps/backend/.env` and set `DATABASE_URL`.
