---
name: commit
description: Make git commits that follow Conventional Commits, one logical change per commit. Use whenever you are about to run git commit, or when the user says "commit", "commit this", "save my work", "write a commit message", or asks to split changes into commits.
---

A good history reads like release notes: each line says what changed, one change per commit, and the body says why. Every message follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) unless the repo enforces something else.

## 1. Read the room

Run these before drafting anything:

```bash
git status
git diff --staged
git diff
git log --oneline -20
```

Then check, in order:

- **Is there anything to commit?** If not, say so and stop.
- **Is git mid-operation?** A merge, rebase, cherry pick or revert in progress (`git status` says so) has its own rules. Finish or ask; don't start a fresh commit in the middle of one.
- **What does this repo enforce?** Look for commitlint config (`commitlint.config.*`, `.commitlintrc*`, a `commitlint` key in `package.json`), commit hooks (`.husky/`, `.pre-commit-config.yaml`, `lefthook.yml`), and commit rules in `CONTRIBUTING.md`, `CLAUDE.md` or `AGENTS.md`. Those override everything below: allowed types, allowed scopes, length limits, required ticket ids.
- **What scopes already exist?** Reuse the ones in the log. In a monorepo, the scope is usually the package or app name.
- **Is there a ticket?** A branch like `feature/ABC-123-cancel-orders` or `fix/42-empty-cart` names one. Carry it into the footer (`Refs: ABC-123`, `Closes #42`) unless the repo puts it somewhere else.

## 2. Respect what's staged

If the user already staged something, they chose it. Commit **exactly** that, and leave unstaged work alone unless they ask for everything.

If nothing is staged, you decide what goes in, by intent.

## 3. Split by intent

One commit is one logical change. A bug fix, a refactor and a docs tweak in the same diff are three commits. Order them so every commit leaves the code working on its own; if two changes can't build apart, they belong together.

Stage whole files with `git add <paths>`. When one file holds two changes, **don't use `git add -p`**: it's interactive and hangs in an agent. Stage hunks with a patch instead, see [SPLITTING.md](./SPLITTING.md).

Never sweep unrelated files in to "tidy up". If something doesn't belong, leave it out and mention it.

## 4. Pick the type

| Type       | Use it when                                             |
| ---------- | ------------------------------------------------------- |
| `feat`     | A user of the code can do something new                 |
| `fix`      | Behaviour was wrong and is now right                    |
| `refactor` | Code changed shape, behaviour did not                   |
| `perf`     | Same behaviour, measurably faster or lighter            |
| `test`     | Only tests were added or changed                        |
| `docs`     | Only documentation changed                              |
| `style`    | Formatting only (whitespace, semicolons, lint autofix)  |
| `build`    | Build system, dependencies, packaging                   |
| `ci`       | CI configuration and scripts                            |
| `chore`    | Repo upkeep that touches none of the above              |
| `revert`   | Undoing an earlier commit                               |

Stuck between two? Ask who notices. If a user of the code would see it in release notes, it's `feat` or `fix`. If only the team would, it's one of the others. A test added alongside the fix it proves goes in the `fix` commit, not a separate `test` one.

## 5. Hunt for breaking changes

Don't wait for someone to tell you. Scan the diff for anything that breaks a caller who upgrades without reading:

- a removed or renamed export, function, route, CLI flag or event
- a changed signature, return shape, default value or error type
- a renamed or newly required config key or environment variable
- a migration that drops, renames or retypes data
- a raised minimum version of a runtime or peer dependency

If you find one, mark it with `!` after the type or scope **and** a `BREAKING CHANGE:` footer that says what breaks and how to migrate. Unsure whether anyone depends on it? Ask.

## 6. Write the message

```
<type>(<scope>): <subject>

<body>

<footers>
```

**Subject**

- Imperative mood: "add", "fix", "remove", never "added" or "adds".
- Lowercase first word, no full stop.
- Whole header 72 characters at most; aim for about 50.
- Say what changed for the reader, not which file: `fix(auth): refresh token before expiry`, not `fix: update auth.ts`.

**Scope** is optional: one lowercase noun for the area. Leave it out when the change spans the repo.

**Body** for anything a reviewer would ask "why?" about. Explain the reason and any trade off, not a replay of the diff. Wrap at 72 characters. **Only state reasons you actually know** from the conversation, the issue or the code. Never invent a motivation to make the body sound complete; a missing body beats a made up one.

**Footers**, after a blank line, in `Token: value` form:

- `BREAKING CHANGE: <what breaks and how to migrate>`
- `Closes #123` or `Refs: ABC-123` for tickets
- Any trailers the user or harness requires (for example `Co-Authored-By:`) go last.

**Reverts**: `revert: <the original header>`, with the body `This reverts commit <sha>.` and a line on why.

## 7. Commit

Pass the message through a heredoc so the blank lines survive:

```bash
git commit -F - <<'EOF'
feat(search): add fuzzy matching to the command palette

Exact matching missed common typos, and users reported giving up
after one miss. Fuzzy matching uses the existing trigram index, so
there is no new dependency.

Closes #42
EOF
```

**If a hook fails**, the commit did not happen. Fix what it caught and run the same commit again. Never `--amend` to recover: that rewrites the *previous* commit, which is someone else's work.

**If a hook rewrote files** (a formatter), stage what it changed and commit again.

Then show the user what landed with `git log --oneline -n <count>`.

## Guardrails

- Never use `--no-verify` to get past a hook. Fix it, or ask.
- Never change git config, the author identity or signing settings. If signing is on, let it sign.
- Never amend or rebase a commit that has already been pushed, unless the user asks.
- Don't push unless the user asks.
- Stop and warn if the diff contains secrets (`.env` files, keys, tokens, credentials, private certificates). Don't commit them, even if they're staged.

## Examples

| Bad                       | Good                                                          |
| ------------------------- | ------------------------------------------------------------- |
| `updated stuff`           | `fix(cart): keep quantity when the item variant changes`      |
| `feat: Added login.`      | `feat(auth): add magic link sign in`                          |
| `fix: fix bug`            | `fix(api): return 404 instead of 500 for unknown ids`         |
| `chore: misc changes`     | Two commits: `refactor(db): …` and `docs(readme): …`          |
| `refactor(api): rename getUser` | `refactor(api)!: rename getUser to findUser`, plus a `BREAKING CHANGE:` footer |
