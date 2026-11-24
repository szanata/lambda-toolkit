# Changesets

Every PR that changes the published package must include a changeset: a markdown
file in this folder describing the change and its semver impact.

Create one by hand (no CLI needed), e.g. `.changeset/fix-factory-args.md`:

```md
---
"lambda-toolkit": patch
---

Describe the change here. This text ends up in CHANGELOG.md and in the GitHub release.
```

Use `patch`, `minor` or `major`. Changes that do not affect the published package
(CI, docs, tests) do not need a changeset.

## Writing the description

The description is copied verbatim into `CHANGELOG.md` and the GitHub release, so
write it for users of the package, not for reviewers of the PR.

The changelog renders each changeset as one list item: the first line of the
description becomes the item text (prefixed with the PR link), and every following
line is nested under it. So:

- Start with a single plain sentence summarising the change. Do not start the
  first line with `-` or a heading.
- Below it, use changelog language: one bullet per user-facing change, starting
  with a verb in the past tense (`Added`, `Fixed`, `Changed`, `Removed`,
  `Deprecated`).
- Name the public API involved (module, function, option) and what changed for the
  caller, not how it was implemented.
- Put breaking changes in a **Breaking changes** section at the end, each bullet
  stating what no longer works and what to use instead.
- Mention deprecations and their replacement; say when the deprecated path will be
  removed if known.
- Leave out internal refactors, test changes and anything already covered by the
  bump type (do not write "minor release").

Code snippets are allowed only to show a new or changed calling syntax, or the
migration for a breaking change. Write them as two short `js` blocks labelled
*before* and *after*, without imports, setup or output. The prose bullet comes
first; the snippet illustrates it, it does not replace it. Behaviour fixes, new
options and deprecation notices do not need a snippet.

````md
---
"lambda-toolkit": minor
---

Accept options directly when calling an AWS namespace as a factory.

- Added support for `aws.s3({ region })` instead of `aws.s3([{ region }])`.
- Deprecated the array form; it still works but logs a warning and will be removed
  in the next major.

**Breaking changes**

- Removed `aws.timestream`; use `aws.timestreamWrite` and `aws.timestreamQuery`.

*before*

```js
const s3 = aws.s3([{ region: 'us-east-1' }]);
```

*after*

```js
const s3 = aws.s3({ region: 'us-east-1' });
```
````

One changeset per PR is the norm. Use several files only when a PR contains
unrelated changes with different bump types.

On every push to `master` (or a `release/**` branch) the release workflow
collects the pending changesets into a "Version Packages" PR. Merging that PR
bumps `package.json`, updates `CHANGELOG.md`, publishes to npm, tags the commit
and creates a GitHub release.

See [RELEASING.md](../RELEASING.md) for the full release and hotfix flow.
