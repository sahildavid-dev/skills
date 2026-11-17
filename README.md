# Skills

[![skills.sh](https://skills.sh/b/sahildavid-dev/skills)](https://skills.sh/sahildavid-dev/skills)

The agent skills I use every day for real engineering work. Built for Claude Code, Codex and any agent that reads `SKILL.md`.

I've spent 11 years shipping software, and the same thing keeps happening with coding agents: they're fast, but they don't share your standards unless you write them down. These skills are where I write them down. Each one is small, does one job, and works with any model. Take them, change them, make them yours.

## Installation (30 second setup)

A plugin updates itself. [skills.sh](https://skills.sh/sahildavid-dev/skills) copies editable files into your project, and you update them by hand. Pick one per agent, because installing both gives you every skill twice.

<details>
<summary><strong>Claude Code</strong></summary>

```bash
claude plugin marketplace add sahildavid-dev/skills
claude plugin install sahildavid-skills@sahildavid-dev
```

Or from inside a session: `/plugin marketplace add sahildavid-dev/skills`, then `/plugin install sahildavid-skills@sahildavid-dev`.

</details>

<details>
<summary><strong>Codex</strong></summary>

```bash
codex plugin marketplace add sahildavid-dev/skills
codex plugin add sahildavid-skills@sahildavid-dev
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

## Why These Skills Exist

### #1: The Git History Nobody Can Read

**The Problem.** Agents commit like a tired developer at 2am: `update files`, `fix stuff`, one giant commit with a bug fix, a refactor and a README tweak all tangled together. Six months later, `git log` tells you nothing, `git bisect` lands on a commit that touches forty files, and nobody can write release notes.

**The Fix** is to use [`/commit`](./skills/engineering/commit/SKILL.md). The agent reads the diff and your recent history, splits the work into one commit per logical change, and writes each one as a [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/): `fix(cart): keep quantity when the item variant changes`. Your log starts reading like a changelog.

More fixes coming as I hit more failure modes.

## Reference

### Engineering

**Model-invoked**

- **[commit](./skills/engineering/commit/SKILL.md)**: Make git commits that follow Conventional Commits, one logical change per commit.

## Working on this repo

Clone it and run `scripts/link-skills.sh` to symlink every skill into `~/.claude/skills` and `~/.agents/skills`. A `git pull` then keeps them current. Repo conventions live in [CLAUDE.md](./CLAUDE.md).

## License

[MIT](./LICENSE)
