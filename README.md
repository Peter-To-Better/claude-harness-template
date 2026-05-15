# claude-harness-template

A production-quality **Claude Code Harness** for a specific stack:

> **Nx 22 · NestJS 11 · GraphQL (Apollo) · TypeORM 0.3 · Next.js 16 · React 19 · Chakra UI 3**

This template is **not generic** — it is opinionated, pre-filled, and deliberately tied to this stack. If your stack matches, you get a working Harness in one `git clone`. If not, fork and adapt.

Built incrementally alongside the [Harness Engineering 學習筆記](https://yourdomain.example/) series.

> Status: **WIP** — Ep-4 sub-agents complete (6 agents). Hooks, slash commands, and CI integration coming in Ep-5 ~ Ep-7.

## Quick start

```bash
# 1. Clone into your project root
git clone https://github.com/<you>/claude-harness-template tmp-harness
cp -r tmp-harness/.claude  ./
cp    tmp-harness/AGENTS.md ./
rm -rf tmp-harness

# 2. Open AGENTS.md and adjust any project-specific details:
#    - import path alias (currently @my-org/*)
#    - migrations directory path
#    - secrets directory path

# 3. Restart Claude Code. The 6 sub-agents load on session start.
```

## What's included

| Path                                 | Purpose                                                         | Article |
| :----------------------------------- | :-------------------------------------------------------------- | :------ |
| `AGENTS.md`                          | Stack-specific HARD rules, commands, sub-agent index            | Ep-1    |
| `.claude/agents/code-reviewer.md`    | Read-only quality + HARD-rule violation review                  | Ep-4    |
| `.claude/agents/migration-writer.md` | TypeORM 0.3 migration generation with safety rules              | Ep-4    |
| `.claude/agents/test-writer.md`      | Jest + NestJS Testing module + RTL test author                  | Ep-4    |
| `.claude/agents/graphql-feature.md`  | New GraphQL feature — DTO + resolver + field resolver + codegen | Ep-4    |
| `.claude/agents/frontend-feature.md` | New Next.js page using Apollo Client + Chakra UI                | Ep-4    |
| `.claude/agents/nx-lib-creator.md`   | `nx g @nx/js:lib` choreography + barrel + path alias            | Ep-4    |
| `.claude/settings.json`              | Team-wide hooks (coming Ep-7)                                   | Ep-7    |
| `.claude/commands/`                  | Slash commands (coming Ep-5)                                    | Ep-5    |
| `.claude/skills/`                    | Skills with progressive disclosure (coming Ep-6)                | Ep-6    |
| `.github/workflows/`                 | CI integration (coming Ep-8)                                    | Ep-8    |

## Design principles

1. **Opinionated, not generic** — pre-filled for the exact stack, no fill-in-the-blank
2. **Everything explained, nothing magical** — every file has a "why this exists" comment
3. **HARD vs SOFT rules separated** — HARD rules block, SOFT rules suggest
4. **Always shippable** — `main` is always usable, no half-done work
5. **Forking is a feature** — if your stack differs, fork freely

## Sub-agents at a glance

| Agent              | Tools        | Model  | Purpose                                       |
| :----------------- | :----------- | :----- | :-------------------------------------------- |
| `code-reviewer`    | Read-only    | sonnet | Quality, security, HARD-rule violation review |
| `migration-writer` | Read + Write | sonnet | TypeORM migration generation                  |
| `test-writer`      | Read + Write | sonnet | Jest + NestJS + RTL tests                     |
| `graphql-feature`  | Read + Write | sonnet | End-to-end GraphQL feature scaffolding        |
| `frontend-feature` | Read + Write | sonnet | Next.js page + Apollo + Chakra                |
| `nx-lib-creator`   | Read + Write | sonnet | New Nx library with full wiring               |

## License

MIT
