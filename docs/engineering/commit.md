# commit

## What it does

Turns whatever is in your working tree into a clean, readable git history. The agent reads the diff and your recent log, splits the work into one commit per logical change, and writes each message in [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format: `type(scope): subject`, with a body that explains why.

## When to reach for it

You don't have to. It's model-invoked, so the agent loads it on its own whenever it's about to commit. Type `/sd:commit` when you want to trigger it yourself, for example at the end of a session with a pile of unrelated changes.

## Common questions

**Does it push?** No. It commits locally and shows you the log. Pushing stays your call.

**What if my repo has its own commit rules?** It reads commitlint config, commit hooks and `CONTRIBUTING.md` first and follows them, and reuses the scopes already in `git log`.

**I already staged what I want. Will it add more?** No. If anything is staged, it commits exactly that and leaves the rest alone.

**Where do ticket ids go?** If your branch is named like `feature/ABC-123-thing`, it adds `Refs: ABC-123` to the footer, unless the repo wants them somewhere else.

**Can it split one file across two commits?** Yes. It stages part of a file by applying a patch to the index, so it never hangs on the interactive `git add -p`.

**What happens when a hook fails?** It fixes what the hook caught and commits again. It never skips hooks with `--no-verify`, and never amends the previous commit to recover.

**Will it commit my `.env`?** No. It stops and warns you if the diff contains secrets.

## It's working if

- `git log --oneline` reads like release notes.
- No commit mixes a fix with a refactor.
- Every subject is imperative, lowercase and under 72 characters.
- Breaking changes carry a `!` and a `BREAKING CHANGE:` footer, even when nobody pointed them out.
- Bodies explain real reasons, or stay empty.
