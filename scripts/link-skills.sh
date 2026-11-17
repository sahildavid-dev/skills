#!/usr/bin/env bash
set -euo pipefail

# Links every skill in this repo into the local skill directories each agent
# harness reads:
#   ~/.claude/skills   Claude Code
#   ~/.agents/skills   Codex and other Agent Skills compatible harnesses
# Each entry is a symlink into this repo, so a `git pull` keeps installed
# skills current. Re-run after adding, removing or renaming a skill.
#
# deprecated/ and misc/ are skipped: they are not daily drivers.
# in-progress/ IS linked, because local use is where beta feedback comes from.

REPO="$(cd "$(dirname "$0")/.." && pwd)"
DESTS=("$HOME/.claude/skills" "$HOME/.agents/skills")

names=()
srcs=()
while IFS= read -r -d '' skill_md; do
  src="$(dirname "$skill_md")"
  names+=("$(basename "$src")")
  srcs+=("$src")
done < <(find "$REPO/skills" -name SKILL.md -not -path '*/deprecated/*' -not -path '*/misc/*' -print0)

for DEST in "${DESTS[@]}"; do
  # Refuse to write symlinks back into this repo if DEST points inside it.
  if [ -L "$DEST" ]; then
    resolved="$(cd "$DEST" && pwd -P)"
    case "$resolved" in
      "$REPO"|"$REPO"/*)
        echo "error: $DEST is a symlink into this repo ($resolved). Remove it and re-run." >&2
        exit 1
        ;;
    esac
  fi

  mkdir -p "$DEST"

  for i in "${!names[@]}"; do
    name="${names[$i]}"
    src="${srcs[$i]}"
    target="$DEST/$name"

    if [ -e "$target" ] && [ ! -L "$target" ]; then
      echo "skip $name: $target exists and is not a symlink" >&2
      continue
    fi

    ln -sfn "$src" "$target"
    echo "linked $name -> $src ($DEST)"
  done
done
