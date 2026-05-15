---
description: Write a structured spec for a new feature using SDD methodology. Outputs specs/<slug>/spec.md.
argument-hint: <feature-name>
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(mkdir:*)
---

<!--
  Why this command exists:
  Jumping straight from "I want feature X" to code is the #1 cause of
  AI-generated code drifting from intent. SDD inserts a deterministic
  artifact (spec.md) between human intent and AI implementation, so
  every later step (plan, implement, review) has a single source of truth.

  This command delegates to the `spec-writer` sub-agent so the spec
  drafting happens in an isolated context — keeping research and
  clarifying-question noise out of the main conversation.
-->

You are starting the **Specify** phase of Spec-Driven Development for the feature: **$ARGUMENTS**.

## Your job

1. **Slugify the feature name** to kebab-case (e.g. "Archive User" → `archive-user`)
2. **Create the directory** `specs/<slug>/` if it doesn't exist
3. **Delegate to the `spec-writer` sub-agent** with the feature name and slug

The sub-agent will produce `specs/<slug>/spec.md` containing:

- **Why** — problem statement and business motivation
- **What** — user stories with EARS-notation acceptance criteria
- **Out of scope** — explicit non-goals (forces hard scope decisions)
- **Open questions** — unresolved items needing clarification before `/plan`

## Important

- Do NOT write code in this phase. The spec describes WHAT, not HOW.
- Do NOT make implementation decisions. Those belong to `/plan`.
- If the feature name is ambiguous, ask **one** clarifying question before delegating, not five.

## After the sub-agent returns

Print:

1. The full path of `specs/<slug>/spec.md`
2. The list of **open questions** (so the user can answer before `/plan`)
3. The exact next-step command: `/plan <slug>`
