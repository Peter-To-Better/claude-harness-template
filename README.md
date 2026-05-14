# claude-harness-template

A drop-in starter for a production-quality **Claude Code Harness**.
Built incrementally alongside the [Harness Engineering 學習筆記](https://yourdomain.example/) series.

> Status: **WIP** — Ep-4 sub-agents complete. Hooks, slash commands, and CI integration coming in Ep-5 ~ Ep-7.

## Quick start

```bash
# 1. Clone next to your project
git clone https://github.com/<you>/claude-harness-template
cp -r claude-harness-template/.claude  your-project/
cp    claude-harness-template/AGENTS.md your-project/

# 2. Open AGENTS.md and replace every <!-- replace: ... --> block
#    with the values for your project.

# 3. Restart Claude Code in your project. The sub-agents will load.
```

## What's in here

| Path                            | What it does                                | Covered in |
| :------------------------------ | :------------------------------------------ | :--------- |
| `AGENTS.md`                     | Project-level rules read by every session   | Ep-1, Ep-4 |
| `.claude/agents/code-reviewer.md`   | Read-only quality + security review     | Ep-4       |
| `.claude/agents/migration-writer.md`| Safe, reversible DB migration writer    | Ep-4       |
| `.claude/agents/test-writer.md`     | Test author with priorities & anti-patterns | Ep-4   |
| `.claude/settings.json`         | Team-wide hooks (coming Ep-6)               | Ep-2, Ep-6 |
| `.claude/commands/`             | Slash commands (coming Ep-5)                | Ep-5       |
| `.github/workflows/`            | CI integration (coming Ep-7)                | Ep-7       |

## Design principles

1. **Convention over configuration** — no settings if a sensible default works
2. **Drop-in, not framework-coupled** — works for any language / stack
3. **Everything explained, nothing magical** — every file has a "why this exists" comment
4. **Hard vs Soft rules separated** — HARD rules block, SOFT rules suggest
5. **Always shippable** — `main` is always usable, no half-done work

## License

MIT
