# Staging part of a file without `git add -p`

`git add -p` waits for keyboard input, so it hangs in an agent. Build the patch yourself and stage it with `git apply --cached`, which writes to the index only and never touches the working tree.

## Steps

1. Save the file's full unstaged diff:

   ```bash
   git diff -U3 -- path/to/file.ts > "$TMPDIR/full.patch"
   ```

2. Copy it to `$TMPDIR/part.patch` and delete every hunk that belongs to a **later** commit. Keep the `diff --git`, `index`, `---` and `+++` header lines, and leave the kept hunks byte for byte as they were, including their `@@` lines.

3. Check, then stage:

   ```bash
   git apply --cached --check "$TMPDIR/part.patch"
   git apply --cached "$TMPDIR/part.patch"
   ```

4. Confirm the index holds exactly what you meant, and the rest is still unstaged:

   ```bash
   git diff --staged -- path/to/file.ts
   git diff -- path/to/file.ts
   ```

5. Commit, then repeat for the next change.

## When two changes share a hunk

If both changes sit inside one hunk, retry step 1 with `-U0` so each changed region becomes its own hunk, and apply with `git apply --cached --unidiff-zero`.

If they're on the same lines, they can't be split cleanly. Commit them together and say so in the body, or ask the user.

## If it goes wrong

`git restore --staged path/to/file.ts` unstages the file without touching your edits. Then start again from step 1.
