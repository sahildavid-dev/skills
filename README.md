# Skills

[![skills.sh](https://skills.sh/b/sahildavid-dev/skills)](https://skills.sh/sahildavid-dev/skills)

The agent skills I use every day for real engineering work. Built for Claude Code, Codex and any agent that reads `SKILL.md`.

I've spent 11 years shipping software, and the same thing keeps happening with coding agents: they're fast, but they don't share your standards unless you write them down. These skills are where I write them down. Each one is small, does one job, and works with any model. Take them, change them, make them yours.

## Getting Started (30 second setup)

### 1. Get the skills

A plugin updates itself. [skills.sh](https://skills.sh/sahildavid-dev/skills) copies editable files into your project, and you update them by hand. Pick one per agent, because installing both gives you every skill twice.

<details>
<summary><strong>Claude Code</strong></summary>

```bash
claude plugin marketplace add sahildavid-dev/skills
claude plugin install sahildavid-dev@sahildavid-dev
```

Or from inside a session: `/plugin marketplace add sahildavid-dev/skills`, then `/plugin install sahildavid-dev@sahildavid-dev`.

Skills then run as `/sahildavid-dev:<skill>`, for example `/sahildavid-dev:review 42`.

</details>

<details>
<summary><strong>Codex</strong></summary>

```bash
codex plugin marketplace add sahildavid-dev/skills
codex plugin add sahildavid-dev@sahildavid-dev
```

</details>

<details>
<summary><strong>Any other agent, or editable files</strong> (manual updates)</summary>

```bash
npx skills@latest add sahildavid-dev/skills -a <agent>  # cursor, opencode, windsurf, amp; omit -a to choose
```

To update, run `npx skills@latest update`, and re-run `add` to pick up new skills.

</details>

<details>
<summary><strong>Claude app</strong> (web, desktop, mobile)</summary>

Zip a skill folder (for example `skills/engineering/commit`) and upload it under Settings, Skills.

</details>

### 2. Check they're there

In Claude Code, type `/sahildavid-dev` and the skills appear in the autocomplete list. You can also run `/plugin` to see the plugin under **Installed**. In other agents, look in their skills or slash command list.

### 3. Use them

There are two kinds of skill here, and you use them differently:

- **Model-invoked** skills load on their own when the agent sees they fit. You just talk normally.
- **User-invoked** skills only run when you type them. These are the ones that act on the outside world, like posting to GitHub, so they wait for you.

**Commit** (model-invoked). Make some changes, then say:

```
commit this
```

The agent reads the diff, splits it into one commit per change, and writes Conventional Commit messages. It follows your repo's own commit rules if you have any (commitlint, hooks, `CONTRIBUTING.md`), and it never pushes. Want just one file in? Stage it yourself first and it commits exactly that.

**Review** (user-invoked). You need the [GitHub CLI](https://cli.github.com) signed in once with `gh auth login`. Then, from inside the repo:

```
/sahildavid-dev:review 42
/sahildavid-dev:review https://github.com/owner/repo/pull/42
/sahildavid-dev:review            # the PR for your current branch
```

You get a verdict and a one line summary of every comment. The full draft is saved to a file you can edit. Nothing is posted until you say go, and then you choose: post it, post your edited version, or post it as a pending review you finish in GitHub. After the author pushes fixes, run the same command again for the next round.

### 4. Teach it your rules (optional, recommended)

Add a `REVIEW.md` at the root of any repo (or in `.github/`). `/review` treats every line in it as a hard rule, ahead of everything else it reads. Write the rules you'd hate to see broken:

```markdown
# Review rules

- Database queries live in the repository layer, never in route handlers.
- Every new API route has a row in `docs/API.md`.
- No `any` in TypeScript. No unchecked casts.
- User facing strings live in the translation files, never inline.
```

`/review` also reads `CLAUDE.md`, `AGENTS.md`, `CONTRIBUTING.md` and your docs, so many repos are covered already.

### Updating

Plugin installs update themselves. With skills.sh, run `npx skills@latest update`. See [CHANGELOG.md](./CHANGELOG.md) for what changed.

## Why These Skills Exist

### #1: The Git History Nobody Can Read

**The Problem.** Agents commit like a tired developer at 2am: `update files`, `fix stuff`, one giant commit with a bug fix, a refactor and a README tweak all tangled together. Six months later, `git log` tells you nothing, `git bisect` lands on a commit that touches forty files, and nobody can write release notes.

**The Fix** is to use [`/commit`](./skills/engineering/commit/SKILL.md). The agent reads the diff and your recent history, splits the work into one commit per logical change, and writes each one as a [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/): `fix(cart): keep quantity when the item variant changes`. Your log starts reading like a changelog.

### #2: The Review Nobody Trusts

**The Problem.** AI code reviews are loud. Twenty comments on a small PR, half of them wrong, a few of them "consider adding error handling" with no idea where or why. Authors learn to skim, and the one comment that mattered gets skimmed with the rest. Human reviews have the opposite problem: they read the hunks, approve, and miss the bug that lives in the caller two files away.

**The Fix** is to use [`/review`](./skills/engineering/review/SKILL.md). It judges the PR against your repo's own rules, reads every changed file in full plus the code that calls it, and runs four reviewers in parallel: **Correctness**, **Safety**, **Fit**, and **Intent and proof**. Then it tries to prove each finding *wrong* before you ever see it. A finding with no concrete failure scenario becomes a question or gets dropped. What survives is posted as short, warm inline comments with one click fixes, but only after you say go.

It remembers where it left off, too. Run it again after the author pushes, and it reviews only what changed, resolves the threads that were fixed, and checks the fixes didn't break something else.

More fixes coming as I hit more failure modes.

## Reference

### Engineering

**User-invoked**

- **[review](./skills/engineering/review/SKILL.md)**: Review a GitHub pull request through four parallel lenses, verify every finding, and post warm inline comments only after you say go. Handles re-reviews.

**Model-invoked**

- **[commit](./skills/engineering/commit/SKILL.md)**: Make git commits that follow Conventional Commits, one logical change per commit.

## Working on this repo

Clone it and run `scripts/link-skills.sh` to symlink every skill into `~/.claude/skills` and `~/.agents/skills`. A `git pull` then keeps them current. Repo conventions live in [CLAUDE.md](./CLAUDE.md).

## License

[MIT](./LICENSE)
