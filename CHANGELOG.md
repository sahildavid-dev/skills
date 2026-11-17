# sd

## 0.3.0

### Minor Changes

- The plugin is now named `sd`, so skills run as `/sd:review` and `/sd:commit`, easy to tell apart from other `review` skills. Existing installs keep the old name: run `claude plugin uninstall sahildavid-dev@sahildavid-dev`, then `claude plugin install sd@sahildavid-dev`. npx installs are unchanged and still run as `/review`.

## 0.2.2

### Patch Changes

- `review` no longer depends on a `REVIEW.md`. It lists every doc in the repo and reads its standards by tier: review checklists and existing review commands, agent and contributor rules (including nested `CLAUDE.md` and `AGENTS.md`), design and architecture docs, ADRs, specs, and the PR template's checklist. It also learns unwritten rules by comparing each changed file with its untouched siblings ([STANDARDS.md](./skills/engineering/review/STANDARDS.md)).
- `review` hands every lens one rule digest with sources, ends each review with the standards it used, and offers to draft a `REVIEW.md` when the repo has none.

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
