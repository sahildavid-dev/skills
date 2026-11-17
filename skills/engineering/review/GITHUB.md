# GitHub mechanics

All commands use the `gh` CLI. Fill `<owner>`, `<repo>` and `<pr>` from `gh repo view --json owner,name` or from the PR URL. If `gh` isn't installed or authenticated, say so and stop: this skill reviews GitHub PRs only.

## State

```bash
gh pr view <pr> --json number,title,body,state,isDraft,author,headRefName,headRefOid,baseRefName,closingIssuesReferences,reviews,commits,files,additions,deletions,mergeable,statusCheckRollup
gh api user --jq .login                                   # who is reviewing
gh api repos/<owner>/<repo>/pulls/<pr>/comments --paginate  # inline comments
```

Review threads (with ids, needed to resolve):

```bash
gh api graphql -f query='
query($o:String!,$r:String!,$n:Int!){repository(owner:$o,name:$r){pullRequest(number:$n){
  reviewThreads(first:100){nodes{id isResolved isOutdated path line
    comments(first:20){nodes{databaseId author{login} body createdAt}}}}}}}' \
  -f o=<owner> -f r=<repo> -F n=<pr>
```

## Marker

Every review this skill posts ends its summary body with a hidden marker:

```
<!-- sahildavid-dev:review round=<N> head=<sha> -->
```

Find earlier rounds by searching `reviews[].body` for `sahildavid-dev:review`. The highest round gives N, and its `head` is the last reviewed commit. This works no matter which account posted it, and never confuses our reviews with anyone else's.

## Checkout

```bash
git fetch origin pull/<pr>/head
git worktree add --detach "$TMPDIR/review-<repo>-<pr>" FETCH_HEAD
git diff <base-sha>...FETCH_HEAD          # first review: merge base to head
git diff <last-reviewed-sha>..FETCH_HEAD  # re-review: only what changed since
```

If the repo isn't cloned locally, shallow clone it into `$TMPDIR` first. When done: `git worktree remove "$TMPDIR/review-<repo>-<pr>"`.

## Post

Post the whole review as **one** review, never as separate comments. Build the payload as JSON and send it with `--input`, which avoids quoting trouble:

```json
{
  "commit_id": "<headRefOid>",
  "event": "REQUEST_CHANGES",
  "body": "<summary>\n\n<!-- sahildavid-dev:review round=1 head=<headRefOid> -->",
  "comments": [
    { "path": "src/orders/cancel.ts", "line": 42, "side": "RIGHT", "body": "..." },
    { "path": "src/orders/cancel.ts", "start_line": 50, "line": 58, "start_side": "RIGHT", "side": "RIGHT", "body": "..." }
  ]
}
```

```bash
gh api repos/<owner>/<repo>/pulls/<pr>/reviews --method POST --input "$TMPDIR/review-<repo>-<pr>.json"
```

- `event`: `REQUEST_CHANGES`, `COMMENT`, or omit it entirely to leave a **pending** review the user submits from the GitHub UI. Never `APPROVE`.
- **Your own PR**: GitHub refuses `REQUEST_CHANGES` when the reviewer is the PR author. If `gh api user` matches `author.login`, post as `COMMENT` and put the verdict in the body.
- **Lines must be in the diff.** A comment on a line outside the diff fails the whole request with a 422. Check every `line` against the diff hunks at head first, and move findings with no valid line into the summary body.
- If the PR head moved since you reviewed, stop and tell the user. Never post against a stale `commit_id`.

Thread replies and resolution:

```bash
gh api repos/<owner>/<repo>/pulls/<pr>/comments/<comment-databaseId>/replies --method POST -f body='Thanks, looks good'
gh api graphql -f query='mutation($id:ID!){resolveReviewThread(input:{threadId:$id}){thread{isResolved}}}' -f id=<thread-id>
```
