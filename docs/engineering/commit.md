# commit

## What it does

Turns whatever is in your working tree into a clean, readable git history. The agent reads the diff and your recent log, splits the work into one commit per logical change, and writes each message in [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format: `type(scope): subject`, with a body that explains why.

## When to reach for it

You don't have to. It's model-invoked, so the agent loads it on its own whenever it's about to commit. Type `/sahildavid-dev:commit` when you want to trigger it yourself, for example at the end of a session with a pile of unrelated changes.

## Common questions

**Does it push?** No. It commits locally and shows you the log. Pushing stays your call.

**What if my repo already has its own scopes?** It reads `git log` first and reuses the scopes you already have.

**What happens when a hook fails?** It fixes what the hook caught, or asks you. It never skips hooks with `--no-verify`.

**Will it commit my `.env`?** No. It stops and warns you if the diff contains secrets.

## It's working if

- `git log --oneline` reads like release notes.
- No commit mixes a fix with a refactor.
- Every subject is imperative, lowercase and under 72 characters.
- Breaking changes carry a `!` and a `BREAKING CHANGE:` footer.
