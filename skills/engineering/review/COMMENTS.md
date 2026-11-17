# How comments sound

The author should finish reading the review wanting to fix things, not defend them.

## The shape of one comment

- **One finding per comment.** One to three short sentences: what, why, then the fix.
- **Simple English.** No lectures, no restating a rule at length, no jargon the author has to look up.
- **Warm and collaborative.** "Could we...", "Small thing:", "Would it work to...". Never harsh, sarcastic or passive aggressive. Talk about the code, not the person.
- **Concrete fix.** When the fix is a small, exact edit, use a GitHub suggestion block so the author can apply it in one click:

  ````
  ```suggestion
  const total = items.reduce((sum, item) => sum + item.price, 0);
  ```
  ````

- **Label only when it helps**, at the start: `Bug:`, `Security:`, `Test:`, `Docs:`, `Question:`, `Nit (optional):`. Blockers never wear `Nit`.
- **Repeats**: comment once, then "Same in `a.ts:12` and `b.ts:40`."
- **Questions stay questions.** If the verify step couldn't prove it, ask; don't assert.

## Examples

> Bug: if `items` is empty, `items[0].currency` throws here. Could we return early with a zero total? There's a `Money.zero()` in `lib/money.ts` that fits.

> Security: this loads the order by `id` from the URL without checking it belongs to the caller, so any signed in user can read any order. Could we scope the query by `userId` like `getInvoice` does?

> Test: the second cancel (already cancelled order) has no test yet. Could you add one next to the other cancel cases in `cancel.test.ts`?

> Question: can two requests reach this at the same time? If so, both could pass the stock check and oversell. Happy to be wrong if something upstream serialises them.

> Docs: this adds `POST /api/orders/:id/cancel`, so the API docs need a row too. Thank you!

> Nice, this reuses `TabFilter` instead of rolling a new one.

## The summary body

Short. In this order:

1. One line on what the PR does and how it reads overall.
2. Verdict and the Blockers, one line each.
3. Findings that have no line to sit on (missing tests for a whole module, a PR that should be split), plus any folded in findings over the comment budget.
4. What wasn't checked, if anything.
5. The marker line from GITHUB.md, last.
