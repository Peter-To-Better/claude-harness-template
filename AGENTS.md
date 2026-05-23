<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

# claude-harness-template

> 寫給 AI coding agent 的專案規則手冊。人類請看 `README.md`。
> 違反 **HARD** 規則會直接弄壞 CI、schema 或 production — 絕對不能踩。

## Tech Stack

- **Monorepo**: Nx 22 + pnpm
- **Backend**: NestJS 11 + GraphQL (Apollo) + TypeORM 0.3
- **Frontend**: Next.js 16 (App Router) + React 19 + Chakra UI 3 + Apollo Client 3
- **Database**: PostgreSQL via TypeORM
- **Validation**: Zod (runtime) + class-validator (DTO)
- **Test**: Jest 30 (backend) + React Testing Library (frontend)
- **Runtime**: Node.js 22

## Commands

- `pnpm server` — start NestJS GraphQL backend on **port 3000** (`nx serve @org/server`)
- `pnpm client` — start Next.js frontend on **port 4500** (`nx dev @org/client`, port in `apps/client/project.json`)
- `pnpm build` — build all (`nx run-many -t build`)
- `pnpm test` — run affected tests (`nx affected -t test --base=main`)
- `pnpm lint` — run affected lint (`nx affected -t lint --base=main`)
- `pnpm typecheck` — run affected typecheck
- `pnpm graph` — visualize project dependencies

> Use these shortcuts. If you need to invoke a different Nx target directly, prefix with `pnpm nx ...`. Never use globally-installed `nx`.

> Database migration / GraphQL codegen commands will be added by the first `/implement` that wires up the relevant feature.

## Spec-Driven Workflow

For any feature larger than a one-line change, follow **Spec → Plan → Implement**:

1. `/spec <feature-name>` — produce `specs/<slug>/spec.md` (problem, user stories, acceptance criteria, open questions)
2. Human resolves the open questions
3. `/plan <slug>` — produce `specs/<slug>/plan.md` + `tasks.md` (architecture decisions, ordered task checklist)
4. `/implement <slug>` — walk `tasks.md` top to bottom, delegating to sub-agents

`specs/` is committed to git. Specs are versioned alongside code.

## Sub-agents (delegate proactively)

Use the `Agent` tool to delegate to specialized sub-agents:

| Sub-agent          | Use when                                                     |
| :----------------- | :----------------------------------------------------------- |
| `spec-writer`      | `/spec` delegates here — drafts a structured spec.md         |
| `code-reviewer`    | After any non-trivial code change. Read-only.                |
| `migration-writer` | Entity changed → TypeORM migration needed                    |
| `test-writer`      | New feature or bug fix → Jest + NestJS tests                 |
| `graphql-feature`  | New GraphQL query/mutation/subscription end-to-end           |
| `frontend-feature` | New Next.js page or feature using Apollo + Chakra UI         |
| `nx-lib-creator`   | New shared lib needed → `nx g @nx/js:lib` + path aliasing    |
| `dep-auditor`      | Audit dependencies for CVEs; preloads the `cve-triage` skill |

Prefer sub-agent for any task >5 file operations or that needs deep, focused expertise.

## Skills

Reusable knowledge modules in `.claude/skills/`. Loaded on demand (or preloaded into a sub-agent):

| Skill        | Provides                                                          |
| :----------- | :---------------------------------------------------------------- |
| `cve-triage` | CVSS bands, GHSA vs CVE, upgrade-vs-override criteria, false positives |

## Hooks (deterministic guardrails)

`.claude/settings.json` registers PreToolUse hooks that BLOCK certain actions outright (exit code 2):

| Hook                          | What it blocks                                              |
| :---------------------------- | :---------------------------------------------------------- |
| `block-generated.js`          | Edits to `schema.gql`, `libs/**/.generated/`, `*.generated.*` |
| `guard-bash.js`               | `rm -rf /`, `DROP TABLE`, `git push --force`, `--no-verify`, `migration:revert` on `main` |

These are HARD constraints — not advisories. Agents cannot bypass them.

To extend, edit `.claude/scripts/*.js` (the JS files document why each pattern is blocked).

## MCP servers

`.mcp.json` at repo root lists project-scope MCP servers (commit to git, shared with team). Each example is commented-out by default — uncomment and supply env vars to enable:

| Server     | Use case                                                            |
| :--------- | :------------------------------------------------------------------ |
| `postgres` | Live DB schema lookup for `migration-writer` / `graphql-feature`    |
| `github`   | PR / issue context for `code-reviewer` / `dep-auditor`              |

Per-user / cross-project MCP servers go via `claude mcp add --scope user`, not into `.mcp.json`.

## Architecture Rules (HARD)

- TypeORM **QueryBuilder only** — do not wrap with helper abstractions
- Class / service names must NOT contain `Manager`
- All DTOs export via barrel `index.ts` — no deep imports (`@my-org/user/dto/create-user.dto` is forbidden)
- Validation: `zod` for runtime, `class-validator` for DTO decorators
- Import alias convention: `@my-org/<lib-name>` for shared libs (see `tsconfig.base.json`)

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

- Create new libs via `nx g @nx/js:lib` (delegate to `nx-lib-creator`)
- Run `pnpm nx affected:test --base=main` before declaring a feature done
- Reference files by relative path (`apps/server/src/foo.ts`)

### 🟡 ASK FIRST

- Upgrading major versions of Nx / NestJS / Next.js / TypeORM
- Modifying `nx.json`, `tsconfig.base.json`
- Adding new GraphQL scalars
- Changing files inside `.claude/` (the harness itself)
- Any database migration that drops a column or table

### 🛑 NEVER

- Edit `schema.gql` (generated file — will be overwritten on every codegen run)
- Edit anything under `libs/**/.generated/`
- Add `@Field` decorator to `Relation<T>` properties
- Use `Manager` in class or service naming
- Commit secrets, `.env`, or files in `apps/server/secrets/`
- Run `git push --force` on `main`
- Skip hooks with `--no-verify`

<!-- HARNESS_TEMPLATE_VERSION: 0.6.0 -->
