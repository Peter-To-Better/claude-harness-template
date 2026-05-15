---
description: Execute tasks.md for a planned feature, delegating to sub-agents per task type. Updates checkboxes as tasks complete.
argument-hint: <feature-slug>
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, Agent
---

<!--
  Why this command exists:
  Without a deterministic task checklist, AI implementation drifts —
  forgets steps, does them in the wrong order, declares completion
  prematurely. This command treats `tasks.md` as the binding contract:
  walk it top to bottom, check each box as you go, never skip ahead.

  Delegating each task to the right sub-agent keeps the main context
  clean and lets specialized agents (migration-writer, graphql-feature,
  test-writer) own their domain.
-->

You are starting the **Implement** phase for feature **$ARGUMENTS**.

## Required reading (in order)

1. `specs/$ARGUMENTS/spec.md` — the WHAT, for reference
2. `specs/$ARGUMENTS/plan.md` — the HOW
3. `specs/$ARGUMENTS/tasks.md` — the binding checklist
4. `AGENTS.md` — HARD rules

If any of the three spec files are missing, stop and tell the user to run `/spec` or `/plan` first.

## Workflow rules (HARD)

1. **Walk `tasks.md` top to bottom.** Do not skip ahead.
2. **One task at a time.** Complete and verify before moving on.
3. **Check the box** in `tasks.md` immediately when a task is done (`- [ ]` → `- [x]`).
4. **Delegate to sub-agents by task type:**
   - Migration task → `migration-writer`
   - GraphQL feature (resolver/DTO/field resolver) → `graphql-feature`
   - Frontend (Next.js page / Apollo / Chakra) → `frontend-feature`
   - New Nx lib → `nx-lib-creator`
   - Tests → `test-writer`
   - Code review (Phase 4 final step) → `code-reviewer`
5. **If a sub-agent returns blocking issues**, stop, surface them to the user, do not proceed to the next task.
6. **Never declare the feature complete** until every task is checked and code-reviewer returns no blocking issues.

## After each task

Print a one-line update:

```
[T3 ✓] Added DTO libs/user/src/dto/archive.input.ts
```

## After all tasks complete

Run final verification:

```bash
pnpm nx affected:test --base=main
pnpm nx affected:lint --base=main
```

Then delegate to `code-reviewer` for a final pass.

## Final report

Print:

1. Total tasks completed
2. Files created / modified (top 10)
3. Test result summary
4. Code-reviewer verdict (blocking / should fix / clean)
5. Suggested commit message in the project's `<type>(scope): description` format
6. Suggested branch name in `<type>/<scope>-<kebab-description>` format

Do NOT commit or push automatically. The user owns those decisions.
