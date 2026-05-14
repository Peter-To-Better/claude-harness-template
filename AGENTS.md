# AGENTS.md

> 寫給 AI coding agent 看的專案手冊。人類請看 `README.md`。
> 這份檔案來自 [claude-harness-template](https://github.com/) — 請根據你的專案實際情況替換 `<!-- replace: ... -->` 區塊。

## Project Overview <!-- replace: 改成你的專案敘述 -->

This is a `<!-- replace: e.g. Nx monorepo / Next.js app / Python service -->` running on `<!-- replace: e.g. Node.js 22 / Python 3.12 -->`.

## Commands <!-- replace: 改成你的專案實際指令 -->

- `<!-- replace: dev command e.g. pnpm dev -->` — start local dev server
- `<!-- replace: build command e.g. pnpm build -->` — build for production
- `<!-- replace: test command e.g. pnpm test -->` — run test suite
- `<!-- replace: typecheck command e.g. pnpm typecheck -->` — type check
- `<!-- replace: lint command e.g. pnpm lint -->` — lint

## Sub-agents (delegate when appropriate)

Use the `Agent` tool to delegate to these specialized sub-agents:

- **`code-reviewer`** — read-only quality + security review after non-trivial changes
- **`migration-writer`** — generate database migrations from entity / schema diffs
- **`test-writer`** — write or update unit / integration tests for changed code

When unsure whether to delegate, prefer sub-agent for any task >5 file operations or that needs deep, focused expertise.

## Boundaries

### ✅ DO

- Read this file at session start
- Use `Agent(code-reviewer)` after writing or editing any production code
- Use `Agent(test-writer)` whenever you add a new feature or fix a bug
- Reference files by relative path (`src/foo.ts` not `/Users/.../src/foo.ts`)

### 🟡 ASK FIRST

- Adding new dependencies (`<!-- replace: e.g. pnpm add ... -->`)
- Modifying CI configuration in `.github/workflows/`
- Changing files inside `.claude/` (the harness itself)
- Any database migration that drops a column or table

### 🛑 NEVER

- Edit generated files (`<!-- replace: list your generated paths, e.g. schema.gql, libs/**/.generated/ -->`)
- Commit secrets, `.env`, or files in `<!-- replace: your secret path -->`
- Run `git push --force` on `main` / `master`
- Skip hooks with `--no-verify`

## Conditional References

Read these when working in the relevant area:

- Architecture & module structure → `docs/architecture.md`
- Testing conventions → `docs/testing.md`
- Database / migration workflow → `docs/migrations.md`

<!-- HARNESS_TEMPLATE_VERSION: 0.1.0 -->
