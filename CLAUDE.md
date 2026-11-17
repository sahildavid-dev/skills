Skills are organized into bucket folders under `skills/`:

- `engineering/`: daily code work
- `productivity/`: daily non-code workflow tools
- `misc/`: kept around but rarely used, not promoted
- `in-progress/`: beta: public on purpose, feedback wanted, not shipped in the plugin
- `deprecated/`: no longer used

Every skill in `engineering/` or `productivity/` (the **promoted** buckets) must have a reference in the top-level `README.md` and an entry in `.claude-plugin/plugin.json`'s `skills` array. Skills in `misc/`, `in-progress/` and `deprecated/` must not appear in either. Run `claude plugin validate . --strict` after touching either manifest. It always reports one warning, that `CLAUDE.md` at the plugin root is not loaded as plugin context. That is expected: this file is for working on the repo, not for plugin users. Any other warning is a real failure.

Each skill folder holds a `SKILL.md` and an `agents/openai.yaml` (Codex UI metadata: `interface.display_name` and `interface.short_description`).

Every `SKILL.md` is either **user-invoked** or **model-invoked**:

- User-invoked: `disable-model-invocation: true` in the frontmatter plus `policy.allow_implicit_invocation: false` in `agents/openai.yaml`. The `description` is a one-line summary for a human browsing slash commands.
- Model-invoked: omit both. The `description` keeps rich trigger phrasing ("Use when the user says...") so the model reaches for it.

When one skill needs another, say so explicitly: `Call the Skill tool with "<name>"`. Never link across skill folders.

Each bucket folder has a `README.md` listing every skill in it with a one-line description, the name linked to its `SKILL.md`. Promoted bucket READMEs and the top-level `README.md` group entries into **User-invoked** and **Model-invoked**.

Promoted skills also get a docs page at `docs/<bucket>/<skill-name>.md` with four sections: **What it does**, **When to reach for it**, **Common questions**, **It's working if**. Create or update it whenever you add a skill or change how one behaves.

Record every user-visible change in `CHANGELOG.md` under the next version, and bump `version` in `.claude-plugin/plugin.json` when releasing. Installs only update when that version changes.

Before committing, run `BASE_SHA=origin/main node scripts/check-skills.mjs`. It checks every rule in this file that a script can check: skills listed in `plugin.json`, READMEs and docs pages, matching frontmatter names, invocation settings in sync, no em dashes, and a version bump plus changelog entry whenever a shipped skill changes.

To link every skill outside `deprecated/` and `misc/` into `~/.claude/skills` and `~/.agents/skills`, run `scripts/link-skills.sh`. Each entry is a symlink into this repo, so a `git pull` keeps installed skills current.

All commits follow Conventional Commits. Call the Skill tool with "commit" before committing.

No em dashes anywhere in this repo's prose. Where a sentence reaches for one, rewrite it with a comma, colon, full stop, parentheses or a conjunction.
