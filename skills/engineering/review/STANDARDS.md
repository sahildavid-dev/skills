# Finding the repo's standards

Most repos never write a review checklist, but almost every repo has standards. They're spread across agent files, docs, specs, templates and the code itself. Your job is to find **all** of them, so the review never depends on one file existing.

Work through every tier. A missing tier is normal; skipping one is not.

## 1. Find every candidate

Docs can live in any folder under any name (`docs/`, `spec/`, `white-paper/`, `handbook/`), so don't guess folder names. List every tracked doc and sort it yourself:

```bash
git ls-files '*.md' '*.mdx' '*.mdc' '*.rst' '*.adoc' '.cursorrules' '.windsurfrules' \
  | grep -vE '(^|/)(node_modules|vendor|dist|build|\.changeset)/|CHANGELOG'
```

For a quick map of where they cluster:

```bash
… | sed 's|/[^/]*$|/|' | sort | uniq -c | sort -rn
```

Skim the list once and place each file or folder in a tier below. Generated reference docs (one file per endpoint, per class) count as tier 3: read only the ones for what the diff touches.

Then read the root `README.md` for any section on development, conventions, architecture or contributing.

**Existing review commands are rules too.** If the repo already has a review command or skill (`.claude/commands/*review*`, `.claude/skills/*review*/`, `.agents/skills/*review*/`), read it in full: its checklist is the team's own definition of a good PR. Treat its checks as tier 1, but ignore its process (how it posts, who approves); this skill's process stands.

## 2. Read them by tier

Earlier tiers override later ones when they disagree.

| Tier | What | How to read it |
| --- | --- | --- |
| 1. Review checklist | `REVIEW.md`, `.github/REVIEW.md`, and the checks inside any existing review command or skill | In full. Every rule is a hard rule. |
| 2. Agent and contributor rules | `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.github/copilot-instructions.md`, `.cursorrules`, `.cursor/rules/*`, `.windsurfrules`, `CONTRIBUTING.md`, `CODING_STANDARDS.md`, style guides | In full. **Include nested ones**: a `CLAUDE.md` or `AGENTS.md` in any folder the diff touches, or any parent of it, applies to that folder. |
| 3. Design, architecture and decisions | Coding and design guides, architecture docs, ADRs and decision records, RFCs, glossaries | List them all. Read in full every one whose title or headings mention an area, module, layer or concept the diff touches. Skim the rest for rules that apply everywhere. |
| 4. Specs | The feature spec for this PR (by branch name, linked issue or feature name), plus roadmaps or status docs the PR should keep current | In full when it matches the PR. These feed the Intent and proof lens. |
| 5. PR template | `.github/pull_request_template.md` and friends | Every checklist item in it is a rule the author was asked to meet. Check the diff against each one. |
| 6. Tooling | Linter, formatter, type checker, test and CI config | Don't review what these enforce. Read them for intent: `strict` mode, banned imports, coverage thresholds, required checks. |
| 7. The code itself | Sibling files of the same kind as each changed file | See below. Always runs, because it's the only source every repo has. |

## 3. Learn the unwritten rules from the code

For each kind of file the diff touches (an API route, a component, a model, a migration, a test), open two or three existing siblings of the same kind that the PR did **not** change. Note what they all do the same way: structure, naming, error handling, validation, how they log, how they're tested, where they live.

A changed file that breaks a pattern every sibling follows is a Fit finding. Cite the siblings as the evidence ("`orders/cancel.ts` and `orders/refund.ts` both validate with `parseBody`; this one reads `req.body` directly"). Unwritten rules are **Should fix** at most, never Blockers, unless a written rule backs them up.

## 4. Build the rule digest

Compile what you found into one list, each rule with its source:

```
- [CLAUDE.md "Hard rules"] Tenant data only through withTenant; never set tenant_id by hand.
- [docs/adr/0007-zod-at-boundaries.md] Validate every request body with Zod.
- [.github/pull_request_template.md] Screenshots for any UI change.
- [convention: orders/cancel.ts, orders/refund.ts] Route handlers validate with parseBody.
```

Paste the digest into every lens's prompt, along with the paths of the full source files so a lens can check the exact wording.

Keep a note of what you read in full, what you skimmed, and which tiers had nothing. The final report lists it, so a clean review shows its working.

## 5. The baseline always applies

Whatever the repo documents, the four lenses in [LENSES.md](./LENSES.md) run in full. A repo with no docs at all still gets checked for correctness, safety, consistency with its own code, and test coverage. Written repo rules can relax the baseline (a documented "we allow X" suppresses a finding about X), but a missing doc never does.
