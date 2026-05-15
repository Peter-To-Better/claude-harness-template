# AGENTS.md

> 寫給 AI coding agent 的專案規則手冊。人類請看 `README.md`。
> 違反 **HARD** 規則會直接弄壞 CI、schema 或 production — 絕對不能踩。

## Tech Stack

- **Monorepo**: Nx 22 + pnpm
- **Backend**: NestJS 11 + GraphQL (Apollo) + TypeORM 0.3
- **Frontend**: Next.js 16 (App Router) + React 19 + Chakra UI 3 + Apollo Client 3
- **Database**: PostgreSQL via TypeORM
- **Validation**: Zod (runtime) + class-validator (DTO)
- **Runtime**: Node.js 22

## Commands

- `pnpm server` — start NestJS GraphQL backend
- `pnpm client` — start Next.js frontend
- `pnpm gql` — run GraphQL codegen (mandatory after `.graphql` edits)
- `pnpm migration:generate --name=<Name>` — generate migration from entity diff
- `pnpm migration:run` — apply migrations
- `pnpm migration:revert` — revert last migration
- `pnpm nx affected:test --base=main` — run affected tests
- `pnpm nx affected:lint --base=main` — run affected lint

## Sub-agents (delegate proactively)

Use the `Agent` tool to delegate to specialized sub-agents:

| Sub-agent          | Use when                                                     |
| :----------------- | :----------------------------------------------------------- |
| `code-reviewer`    | After any non-trivial code change. Read-only.                |
| `migration-writer` | Entity changed → TypeORM migration needed                    |
| `test-writer`      | New feature or bug fix → Jest + NestJS tests                 |
| `graphql-feature`  | New GraphQL query/mutation/subscription end-to-end           |
| `frontend-feature` | New Next.js page or feature using Apollo + Chakra UI         |
| `nx-lib-creator`   | New shared lib needed → `nx g @nx/js:lib` + path aliasing    |

Prefer sub-agent for any task >5 file operations or that needs deep, focused expertise.

## Nx Rules (HARD)

- All tasks via Nx: `nx run`, `nx run-many`, `nx affected`
- NEVER invoke underlying tools directly (no `tsc`, `webpack`, `next build`)
- Inspect repo with `nx_workspace` tool; project details with `nx_project_details`
- Consult `nx_docs` for Nx config — do NOT guess

## Architecture Rules (HARD)

- TypeORM **QueryBuilder only** — do not wrap with helper abstractions
- Class / service names must NOT contain `Manager`
- All DTOs export via barrel `index.ts` — no deep imports (`@my-org/user/dto/create-user.dto` is forbidden)
- Validation: `zod` for runtime, `class-validator` for DTO decorators

## Entity ↔ GraphQL Rules (HARD)

- **Properties typed `Relation<T>` MUST NOT have `@Field` decorator**
- `Relation<T>` is for TypeORM only
- GraphQL relations resolve via **field resolvers**, not entity-level decorators
- Violating these crashes schema generation or runtime queries

## Migration Rules (HARD)

- Every migration must be reversible — provide both `up` and `down`
- NEVER drop and replace a column in the same migration; use two-step migration
- `NOT NULL` on existing table requires either default value or two-step migration
- Index creation on large tables uses `CONCURRENTLY`
- `schema.gql` is generated — NEVER edit by hand

## Git Workflow (HARD)

- Branch format: `<type>/<scope>-<kebab-description>`
- Allowed types: `feat`, `fix`, `refactor`, `chore`, `test`, `docs`
- No abbreviations, no camelCase / PascalCase
- Violating branch naming will fail CI

## Boundaries

### ✅ DO

- Use `pnpm gql` immediately after editing any `.graphql` file
- Run `pnpm migration:generate` after editing entities
- Create new libs via `nx g @nx/js:lib`
- Reference files by relative path (`apps/server/src/foo.ts`)

### 🟡 ASK FIRST

- Upgrading major versions of Nx / NestJS / Next.js / TypeORM
- Modifying `nx.json`, `tsconfig.base.json`, `codegen.yml`
- Adding new GraphQL scalars
- Changing files inside `.claude/` (the harness itself)
- Any database migration that drops a column or table

### 🛑 NEVER

- Edit `schema.gql` (generated file — get overwritten on every codegen run)
- Edit anything under `libs/**/.generated/`
- Add `@Field` decorator to `Relation<T>` properties
- Use `Manager` in class or service naming
- Commit secrets, `.env`, or files in `apps/server/secrets/`
- Run `git push --force` on `main`
- Skip hooks with `--no-verify`

## Conditional References (按需閱讀)

- Entity / GraphQL relations → `docs/entity-graphql.md`
- Migration workflow → `docs/migrations.md`
- Frontend conventions (`apps/client/`) → `docs/frontend.md`
- Architecture / module structure → `docs/architecture.md`

<!-- HARNESS_TEMPLATE_VERSION: 0.2.0 -->
