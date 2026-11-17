# Skills

[![skills.sh](https://skills.sh/b/sahildavid-dev/skills)](https://skills.sh/sahildavid-dev/skills)

The agent skills I use every day for real engineering work. Built for Claude Code, Codex and any agent that reads `SKILL.md`.

I've spent 11 years shipping software, and the same thing keeps happening with coding agents: they're fast, but they don't share your standards unless you write them down. These skills are where I write them down. Each one is small, does one job, and works with any model. Take them, change them, make them yours.

## Getting Started (30 second setup)

### 1. Get the skills

There are two ways in. Pick **one** per agent, because installing both gives you every skill twice.

#### Option A: npx (any agent)

One command, works with Claude Code, Codex, Cursor, Windsurf, OpenCode, Amp and more. It copies the skills into your project as plain files you can read and edit.

```bash
npx skills@latest add sahildavid-dev/skills
```

It asks which skills you want and which agents to install them for. Or skip the questions:

```bash
npx skills@latest add sahildavid-dev/skills --list                    # see what's available
npx skills@latest add sahildavid-dev/skills --all                     # every skill, every agent, no prompts
npx skills@latest add sahildavid-dev/skills -s review                 # just one skill
npx skills@latest add sahildavid-dev/skills -s review -a claude-code  # one skill, one agent
npx skills@latest add sahildavid-dev/skills -g                        # global: every project on this machine
```

Skills installed this way run by their plain name: `/review`, `/commit`.

To update, run `npx skills@latest update`, and re-run `add` to pick up new skills. To remove one, `npx skills@latest remove review`.

#### Option B: plugin (updates itself)

<details>
<summary><strong>Claude Code</strong></summary>

```bash
claude plugin marketplace add sahildavid-dev/skills
claude plugin install sahildavid-dev@sahildavid-dev
```

Or from inside a session: `/plugin marketplace add sahildavid-dev/skills`, then `/plugin install sahildavid-dev@sahildavid-dev`.

Skills installed as a plugin run with the plugin's name in front: `/sahildavid-dev:review`, `/sahildavid-dev:commit`.

</details>

<details>
<summary><strong>Codex</strong></summary>

```bash
codex plugin marketplace add sahildavid-dev/skills
codex plugin add sahildavid-dev@sahildavid-dev
```

</details>

#### Claude app (web, desktop, mobile)

Zip a skill folder (for example `skills/engineering/review`) and upload it under Settings, Skills.

### 2. Check they're there

In Claude Code, type `/` and look for `review` (npx install) or `sahildavid-dev:review` (plugin install) in the autocomplete list. With npx you can also run `npx skills@latest list`; with the plugin, run `/plugin` and look under **Installed**. In other agents, check their skills or slash command list.

### 3. Use them

There are two kinds of skill here, and you use them differently:

- **Model-invoked** skills load on their own when the agent sees they fit. You just talk normally.
- **User-invoked** skills only run when you type them. These are the ones that act on the outside world, like posting to GitHub, so they wait for you.

**Commit** (model-invoked). Make some changes, then say:

```
commit this
```

The agent reads the diff, splits it into one commit per change, and writes Conventional Commit messages. It follows your repo's own commit rules if you have any (commitlint, hooks, `CONTRIBUTING.md`), and it never pushes. Want just one file in? Stage it yourself first and it commits exactly that.

**Review** (user-invoked). You need the [GitHub CLI](https://cli.github.com) signed in once with `gh auth login`. Then, from inside the repo (examples use the plugin name; with npx, it's just `/review`):

```
/sahildavid-dev:review 42
/sahildavid-dev:review https://github.com/owner/repo/pull/42
/sahildavid-dev:review            # the PR for your current branch
```

You get a verdict and a one line summary of every comment. The full draft is saved to a file you can edit. Nothing is posted until you say go, and then you choose: post it, post your edited version, or post it as a pending review you finish in GitHub. After the author pushes fixes, run the same command again for the next round.

### 4. Teach it your rules (optional)

You don't have to. `/review` finds your standards on its own: agent files like `CLAUDE.md` and `AGENTS.md` (including nested ones), `CONTRIBUTING.md`, design and architecture docs, ADRs, specs, your PR template's checklist, and the patterns your existing code already follows. Every review ends with a list of what it read, so you can see nothing was missed.

To make it stricter, add a `REVIEW.md` at the root of any repo (or in `.github/`). Every line in it is treated as a hard rule, ahead of everything else. Write the rules you'd hate to see broken:

```markdown
# Review rules

- Database queries live in the repository layer, never in route handlers.
- Every new API route has a row in `docs/API.md`.
- No `any` in TypeScript. No unchecked casts.
- User facing strings live in the translation files, never inline.
```

No `REVIEW.md` yet? At the end of a review, `/review` offers to draft one from everything it found.

### Updating

Plugin installs update themselves. With npx, run `npx skills@latest update`. See [CHANGELOG.md](./CHANGELOG.md) for what changed.

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

Before you push, run `BASE_SHA=origin/main node scripts/check-skills.mjs`. It makes sure every skill is wired into the plugin, READMEs and docs, and that changes to shipped skills come with a version bump, so installs actually pick them up.

## License

[MIT](./LICENSE)
