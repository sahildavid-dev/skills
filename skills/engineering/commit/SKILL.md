---
name: commit
description: Make git commits that follow Conventional Commits. Use whenever you are about to run git commit, when the user says "commit", "commit this", "save my work", "write a commit message", or asks to split changes into commits.
---

Every commit in this repo follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). A good history reads like release notes: each line says what changed and why it matters, one change per commit.

## 1. Look before you write

Run these before drafting anything:

```bash
git status
git diff --staged
git diff
git log --oneline -15
```

The log tells you which **scopes** this repo already uses. Reuse them; don't invent a new name for an area that already has one.

## 2. Split by intent

One commit is one logical change. If the diff mixes a bug fix, a refactor and a docs tweak, that is three commits. Stage each one on its own (`git add <paths>`, or `git add -p` for mixed files) and commit in an order where every commit leaves the code working.

Never sweep unrelated files into a commit to "tidy up". If something is staged that doesn't belong to the change, unstage it and ask the user about it.

## 3. Pick the type

| Type       | Use it when                                                    |
| ---------- | -------------------------------------------------------------- |
| `feat`     | A user of the code can do something new                        |
| `fix`      | Behaviour was wrong and is now right                           |
| `refactor` | Code changed shape, behaviour did not                          |
| `perf`     | Same behaviour, measurably faster or lighter                   |
| `test`     | Only tests were added or changed                               |
| `docs`     | Only documentation changed                                     |
| `style`    | Formatting only (whitespace, semicolons, lint autofix)         |
| `build`    | Build system, dependencies, packaging                          |
| `ci`       | CI configuration and scripts                                   |
| `chore`    | Repo upkeep that touches none of the above                     |
| `revert`   | Undoing an earlier commit                                      |

Stuck between `feat` and `chore`? Ask: would this line belong in release notes? If yes, it's `feat` or `fix`.

## 4. Write the message

```
<type>(<scope>): <subject>

<body>

<footers>
```

**Subject**

- Imperative mood: "add", "fix", "remove", never "added" or "adds".
- Lowercase first word, no full stop at the end.
- 72 characters at most; aim for about 50.
- Say what changed, not which file: `fix(auth): refresh token before expiry`, not `fix: update auth.ts`.

**Scope** is optional: one lowercase noun naming the area (`auth`, `api`, `ui`, a package or skill name). Leave it out when the change spans the whole repo.

**Body** is optional for small changes and expected for anything a reviewer would ask "why?" about. Explain the reason and any trade off, not a line by line replay of the diff. Wrap at 72 characters.

**Footers** go after a blank line:

- `BREAKING CHANGE: <what breaks and how to migrate>` for anything that breaks callers. Also add `!` after the type or scope: `feat(api)!: drop v1 endpoints`.
- `Closes #123` or `Refs #123` to link issues.
- Keep any trailers the user or harness requires (for example `Co-Authored-By:`) as the last lines.

## 5. Commit

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

Then show the user what landed with `git log --oneline -n <count>`.

## Guardrails

- Never use `--no-verify` to get past a failing hook. Fix what the hook caught, or ask.
- Never amend or rebase a commit that has already been pushed, unless the user asks.
- Don't push unless the user asks.
- Stop and warn if the diff contains secrets (`.env`, keys, tokens, credentials). Don't commit them.

## Examples

| Bad                    | Good                                                      |
| ---------------------- | --------------------------------------------------------- |
| `updated stuff`        | `fix(cart): keep quantity when the item variant changes`   |
| `feat: Added login.`   | `feat(auth): add magic link sign in`                      |
| `fix: fix bug`         | `fix(api): return 404 instead of 500 for unknown ids`     |
| `chore: misc changes`  | Two commits: `refactor(db): …` and `docs(readme): …`      |
