#!/usr/bin/env node
// PreToolUse hook: block dangerous bash commands.
//
// Triggered before any Bash tool call. Reads the command from stdin,
// checks against patterns that have caused incidents in the past, and
// blocks with exit code 2 if matched.
//
// Why this exists:
//   Some commands are catastrophically destructive (rm -rf /, DROP TABLE
//   in prod). Others bypass team safeguards (--no-verify, git push --force
//   on main). Relying on Agent compliance is probabilistic — a hook makes
//   it structurally impossible (Ep-2 of the series).
//
// To add or remove patterns, edit BLOCKED below. Each entry is:
//   { pattern: RegExp, reason: string }

const BLOCKED = [
  {
    pattern: /\brm\s+-rf\s+\//,
    reason: 'rm -rf with absolute root path — refuse unconditionally',
  },
  {
    pattern: /\bDROP\s+(TABLE|DATABASE|SCHEMA)\b/i,
    reason: 'DROP TABLE/DATABASE/SCHEMA in ad-hoc bash — use a reversible migration via the migration-writer sub-agent',
  },
  {
    pattern: /\bgit\s+push.*--force(?!-with-lease)/,
    reason: 'git push --force without --force-with-lease — risk of overwriting team work',
  },
  {
    pattern: /\bgit\s+(commit|push).*--no-verify/,
    reason: '--no-verify bypasses pre-commit hooks (your decision-making layer) — never appropriate from an agent',
  },
  {
    pattern: /\bpnpm\s+migration:revert\b.*\bmain\b/,
    reason: 'migration:revert against main branch — extreme caution; needs human approval',
  },
];

let raw = '';
process.stdin.on('data', (chunk) => { raw += chunk; });
process.stdin.on('end', () => {
  let input;
  try { input = JSON.parse(raw); } catch { process.exit(0); }

  const command = input?.tool_input?.command ?? '';
  if (!command) process.exit(0);

  for (const { pattern, reason } of BLOCKED) {
    if (pattern.test(command)) {
      process.stderr.write(
        `🛑 BLOCKED COMMAND\n\n` +
        `Command:  ${command}\n` +
        `Reason:   ${reason}\n\n` +
        `If you genuinely need to run this, ask the human user to run it\n` +
        `directly in their terminal. Agents do not get a bypass for these.\n`
      );
      process.exit(2);
    }
  }
  process.exit(0);
});
