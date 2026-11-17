# Engineering

Daily code work.

## User-invoked

Reachable only when you type them (Claude Code: `disable-model-invocation: true`; Codex: `policy.allow_implicit_invocation: false` in `agents/openai.yaml`).

- **[review](./review/SKILL.md)**: Review a GitHub pull request through four parallel lenses, verify every finding, and post warm inline comments only after you say go. Handles re-reviews.

## Model-invoked

Model or user reachable (rich trigger phrasing so the model can reach for them).

- **[commit](./commit/SKILL.md)**: Make git commits that follow Conventional Commits, one logical change per commit.
