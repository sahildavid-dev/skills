# sahildavid-dev

## 0.2.0

### Minor Changes

- Adds `review`, a user-invoked skill that reviews a GitHub pull request through four parallel lenses (Correctness, Safety, Fit, Intent and proof), verifies every finding against the code before showing it, and posts warm inline comments only after you approve. Handles re-reviews: resolves fixed threads, follows up on open ones, and checks fixes for regressions.
- The plugin is now named `sahildavid-dev`, so skills run as `/sahildavid-dev:<skill>`. Reinstall with `claude plugin install sahildavid-dev@sahildavid-dev`.

## 0.1.0

### Minor Changes

- First release. Adds `commit`, a model-invoked skill that makes git commits following Conventional Commits, one logical change per commit.
