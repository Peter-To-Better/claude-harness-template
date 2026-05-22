# claude-harness-template

A complete **Nx monorepo starter** wired up with a production-quality **Claude Code Harness** so you can start building features with `/spec → /plan → /implement` from day one.

> **Stack**: Nx 22 · NestJS 11 · GraphQL (Apollo) · TypeORM 0.3 · Next.js 16 · React 19 · Chakra UI 3

This template is **opinionated and stack-specific** — not a fill-in-the-blank generic kit. If your stack matches, you get a working harness in one `git clone`. If not, fork and adapt.

Built incrementally alongside the [Harness Engineering 學習筆記](https://peter-to-better-blog.lanya.dev/posts/harness-engineering-%E5%AD%B8%E7%BF%92%E7%AD%86%E8%A8%98-ep-0) series.

> Status: **WIP** — Ep-6 Skills complete (8 sub-agents, 3 commands, 1 skill). Hooks, MCP, CI integration coming in Ep-7 ~ Ep-8.

## Quick start

```bash
# 1. Clone the workspace
git clone https://github.com/Peter-To-Better/claude-harness-template my-project
cd my-project

# 2. Install
pnpm install

# 3. Open in Claude Code (or your AI agent of choice).
#    The 8 sub-agents + 3 slash commands + skills load on session start.

# 4. Ship your first feature using SDD
#    /spec user-archive
#    (answer open questions)
#    /plan user-archive
#    /implement user-archive
```

Backend / frontend / GraphQL wiring / database integration get added by `/implement` runs — the template **does not pre-wire** those, because doing so would lock you into a specific schema. The HARD rules in `AGENTS.md` guarantee Claude Code wires them up correctly when you ask.

## Workspace layout

```text
claude-harness-template/
├── apps/
│   ├── server/             # NestJS 11 app (Jest 30)
│   ├── server-e2e/         # NestJS e2e tests
│   └── client/             # Next.js 16 App Router (React 19)
├── libs/
│   ├── models/             # TypeORM entities + shared types (import: @my-org/models)
│   ├── graphql/            # GraphQL codegen output + operations (import: @my-org/graphql)
│   └── user/               # Demo feature lib (import: @my-org/user)
├── specs/                  # SDD artifacts — one folder per feature, committed
├── .claude/
│   ├── settings.json       # Nx Claude marketplace plugins
│   ├── agents/             # 8 sub-agents (Ep-4, Ep-5, Ep-6)
│   ├── commands/           # 3 slash commands (Ep-5)
│   └── skills/             # Reusable knowledge modules (Ep-6)
├── .github/                # Nx auto-managed AI tooling (skills, CI monitor)
├── AGENTS.md               # Project rules + sub-agent index
└── nx.json, tsconfig.base.json, pnpm-workspace.yaml, …
```

## Sub-agents at a glance

| Agent              | Tools        | Model  | Purpose                                       |
| :----------------- | :----------- | :----- | :-------------------------------------------- |
| `spec-writer`      | Read + Write | sonnet | Drafts SDD `spec.md` (called by `/spec`)      |
| `code-reviewer`    | Read-only    | sonnet | Quality, security, HARD-rule violation review |
| `migration-writer` | Read + Write | sonnet | TypeORM migration generation                  |
| `test-writer`      | Read + Write | sonnet | Jest + NestJS + RTL tests                     |
| `graphql-feature`  | Read + Write | sonnet | End-to-end GraphQL feature scaffolding        |
| `frontend-feature` | Read + Write | sonnet | Next.js page + Apollo + Chakra                |
| `nx-lib-creator`   | Read + Write | sonnet | New Nx library with full wiring               |
| `dep-auditor`      | Read-only    | sonnet | CVE audit; preloads the `cve-triage` skill    |

## SDD workflow at a glance

```text
/spec <feature-name>   →  specs/<slug>/spec.md          (WHAT)
                            ↓  (human resolves open questions)
/plan <slug>           →  specs/<slug>/plan.md +
                          specs/<slug>/tasks.md          (HOW)
                            ↓
/implement <slug>      →  walks tasks.md, delegates to
                          sub-agents, checks boxes,
                          runs verification, returns
                          commit + branch suggestion
```

## Design principles

1. **Opinionated, stack-coupled** — pre-filled for the exact stack, no `<!-- replace -->` placeholders
2. **Everything explained, nothing magical** — every harness file has a "why this exists" comment
3. **HARD vs SOFT rules separated** — HARD rules block (CI, schema, production), SOFT rules suggest
4. **Always shippable** — `main` is always usable
5. **Forking is a feature** — if your stack differs, fork and adapt

## What's NOT in the box (by design)

- GraphQL / TypeORM / Apollo / Chakra `npm install` and module wiring — added by your first few `/implement` runs
- Database container — bring your own Postgres or `/spec setup-postgres`
- Auth / JWT — bring your own or `/spec setup-auth`
- CI workflows — coming in Ep-8

The point of a harness is that **Claude Code can extend the workspace correctly given the rules**, not that the template ships every feature pre-built.

## License

MIT
