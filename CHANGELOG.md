# sahildavid-dev

## 0.2.1

### Patch Changes

- `commit` now reads the repo's own commit rules (commitlint, hooks, CONTRIBUTING) and follows them, carries ticket ids from the branch name into the footer, commits exactly what you staged, and hunts the diff for breaking changes instead of waiting to be told.
- `commit` no longer uses the interactive `git add -p`, which hangs in an agent. It stages part of a file by building a patch and applying it to the index ([SPLITTING.md](./skills/engineering/commit/SPLITTING.md)).
- `commit` recovers from a failed hook by committing again, never by amending, and never writes a reason into the body that it doesn't actually know.
- Adds the plugin icon.

## 0.2.0

### Minor Changes

- Adds `review`, a user-invoked skill that reviews a GitHub pull request through four parallel lenses (Correctness, Safety, Fit, Intent and proof), verifies every finding against the code before showing it, and posts warm inline comments only after you approve. Handles re-reviews: resolves fixed threads, follows up on open ones, and checks fixes for regressions.
- The plugin is now named `sahildavid-dev`, so skills run as `/sahildavid-dev:<skill>`. Reinstall with `claude plugin install sahildavid-dev@sahildavid-dev`.

## 0.1.0

### Minor Changes

- First release. Adds `commit`, a model-invoked skill that makes git commits following Conventional Commits, one logical change per commit.
