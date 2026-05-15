---
description: Translate a spec into a technical implementation plan plus task checklist. Outputs specs/<slug>/plan.md and specs/<slug>/tasks.md.
argument-hint: <feature-slug>
allowed-tools: Read, Write, Edit, Glob, Grep
---

<!--
  Why this command exists:
  The gap between WHAT (spec) and HOW (code) is where most AI code drifts.
  A written plan forces architectural decisions to be made BEFORE writing
  code, so they can be reviewed, challenged, and version-controlled.

  The task list at the end is the deterministic checklist `/implement`
  consumes — each task is a unit of work that an agent can complete and
  mark done.
-->

You are starting the **Plan** phase of Spec-Driven Development. The feature slug is **$ARGUMENTS**.

## Required reading (in order)

1. `specs/$ARGUMENTS/spec.md` — the WHAT
2. `AGENTS.md` — load all HARD rules. Your plan MUST comply with every one.
3. `docs/architecture.md` if it exists
4. Any entity / module file the feature will touch

If `specs/$ARGUMENTS/spec.md` does not exist, stop and tell the user to run `/spec` first.

## Output

Produce TWO files in `specs/$ARGUMENTS/`:

### `plan.md` — technical design

Structure:

```markdown
# Plan: <feature title>

## Architecture decisions

- **Module placement**: which lib(s) / app(s) the code lives in, why
- **Data model changes**: new entities, columns, indexes, migration strategy
- **GraphQL surface**: new queries / mutations / types; any field resolver changes
- **Frontend surface**: new pages / components / hooks
- **Public API changes**: anything affecting other consumers

## HARD rule compliance

For each AGENTS.md HARD rule that this plan could affect, state explicitly how compliance is maintained:

- Relation<T> + @Field — [how this plan avoids it]
- Manager naming — [confirmed not used]
- DTO barrel exports — [where DTOs live, what gets exported]
- Nx invocation — [no direct tsc/webpack]
- schema.gql — [acknowledged as generated]
- ... etc.

## Risks & trade-offs

- What could go wrong? Two-step migration needed?
- What did we explicitly NOT do, and why?

## Test strategy

- Which behaviors are covered by which tests?
- New fixtures / factories needed?
```

### `tasks.md` — implementation checklist

Decompose the plan into atomic, ordered tasks. Each task must:

- Be completable in <30 minutes
- Have a single, verifiable outcome
- Reference the file(s) it touches

Format:

```markdown
# Tasks: <feature title>

## Phase 1 — Foundations
- [ ] T1: Create entity `apps/server/.../user.entity.ts` with new column X
- [ ] T2: Generate migration via `pnpm migration:generate --name=AddUserX`

## Phase 2 — Backend
- [ ] T3: Add DTO `libs/user/src/dto/x.input.ts` + barrel export
- [ ] T4: Add resolver method `apps/server/.../user.resolver.ts`
- [ ] T5: Add service method `libs/user/src/user.service.ts`

## Phase 3 — Frontend
- [ ] T6: Add GraphQL operation `libs/graphql/src/operations/x.graphql`
- [ ] T7: Run `pnpm gql`
- [ ] T8: Add page `apps/client/src/app/x/page.tsx`

## Phase 4 — Verification
- [ ] T9: Add tests via test-writer sub-agent
- [ ] T10: Run `pnpm nx affected:test --base=main`
- [ ] T11: Run `pnpm nx affected:lint --base=main`
- [ ] T12: Delegate to code-reviewer sub-agent
```

## After both files are written

Print:

1. Path of both files
2. **Total task count** and rough effort estimate
3. The exact next-step command: `/implement $ARGUMENTS`
4. Any **unresolved** items from the spec that block implementation
