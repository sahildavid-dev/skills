# review

## What it does

Reviews a GitHub pull request the way a careful senior engineer would. It reads the repo's own rules and the PR's intent, checks the head out in a scratch worktree, and reads every changed file in full along with the code that calls it. Four reviewers then work in parallel, each through one lens: **Correctness**, **Safety**, **Fit** and **Intent and proof**. Every finding is checked against the code before you see it, so what reaches the author is real. Comments are warm, short, and come with a fix. Nothing is posted until you say go.

It also handles later rounds. On a re-review it looks only at what changed since the last round, resolves threads that were fixed, follows up on the ones that weren't, and checks the fixes didn't break anything else.

## When to reach for it

Whenever a PR needs a review: yours before you ask a colleague, a teammate's, or an open source contribution. Run it again after the author pushes fixes.

```
/sd:review 42
/sd:review https://github.com/owner/repo/pull/42
```

## Common questions

**Will it post without asking?** No. It shows you the verdict and every comment, writes the full draft to a file you can edit, and waits. You can post as is, post after editing, or post it as a pending review to finish in GitHub.

**How does it know my repo's rules?** It goes looking, and doesn't need any one file to exist. It lists every doc in the repo and reads them by priority: a `REVIEW.md` or existing review command if you have one, agent and contributor files (`CLAUDE.md`, `AGENTS.md`, Copilot and Cursor rules, `CONTRIBUTING.md`, including nested ones), design and architecture docs, ADRs, the spec for this feature, and your PR template's checklist. Then it learns the unwritten rules by comparing each changed file with its untouched siblings. Every review ends with the list of what it read.

**Do I need a `REVIEW.md`?** No, but it makes the review stricter: every line in it is a hard rule. If you don't have one, it offers to draft one from what it found.

**What if my repo has no docs at all?** It still runs all four lenses in full and holds the PR to the patterns in your existing code.

**Will it run the PR's code?** No, not unless you ask. It reads CI results instead, because a PR from a fork can run anything.

**Can it approve or merge?** Never. That stays with you.

**What about my own PRs?** GitHub doesn't let you request changes on your own PR, so it posts as a comment and puts the verdict in the body.

## It's working if

- Authors fix the comments instead of arguing with them.
- Most comments come with a fix, many as one click suggestions.
- A review rarely has more than 15 comments, and nits never outnumber real findings.
- Re-reviews close threads, not just add new ones.
- The summary lists the standards it used and what it skipped, so a clean review means clean.
