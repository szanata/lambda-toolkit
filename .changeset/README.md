# Changesets

Every PR that changes the published package must include a changeset: a markdown file in this folder describing the change and its semver impact.

Create one by hand (no CLI needed), e.g. `.changeset/fix-factory-args.md`:

```md
---
"lambda-toolkit": patch
---

Describe the change here. This text ends up in CHANGELOG.md and in the GitHub release.
```

Use `patch`, `minor` or `major`. Changes that do not affect the published package (CI, docs, tests, dev dependencies) do not need a changeset.

The [changeset-bot](https://github.com/apps/changeset-bot) comments on every PR saying whether a changeset was found. It is a reminder only and does not block merging.

> [!WARNING]
> Never edit `version` in `package.json`. Only the `chore: release` PR changes it. A version bumped by hand is published as soon as it reaches `master`, without a CHANGELOG entry or a GitHub release. The `Build` workflow fails PRs that change it (`ops/check_version.sh`).

## Choosing the bump

Follow semver, with documented exceptions:

- `patch`: bug fixes and dependency fixes that reach users; no API change.
- `minor`: new features, new options and deprecations; existing calls keep working.
- `major`: removals, renamed or retyped API, and behavior changes that break documented usage.

A breaking change may ship in a `minor` only as an exception, decided per case in the PR. It qualifies when all of these hold:

- it only affects undocumented or edge-case usage, not the documented API;
- the common path keeps working, ideally through a deprecation that warns;
- it is listed under **Breaking changes** with what to do instead.

Anything else that breaks callers is `major`. When in doubt, it is `major`.

## Writing the description

The description is copied verbatim into `CHANGELOG.md` and the GitHub release, so write it for users of the package, not for reviewers of the PR.

The changelog renders each changeset as one list item: the first line of the description becomes the item text (rendered as `- [#PR] <first line> Thanks @author!`, see the `template` in `config.json`), and every following line is nested under it. So:

- Start with a single plain sentence summarizing the change, on one line (do not hard-wrap it, the rest would drop into the nested part). Do not start it with `-` or a heading.
- Below it, one bullet per user-facing change.
- Write every line, the summary included (except **Breaking changes**), in changelog language: start with an action verb in the past tense (`Added`, `Changed`, `Fixed`, `Removed`, `Deprecated`, `Updated`). When the change is a new capability ("accepts", "supports", "allows"), phrase it as `Added support for …` or `Changed X to …` rather than past-tensing the capability verb (`Accepted …` reads wrong).
- Name the public API involved (module, function, option) and what changed for the caller, not how it was implemented.
- Put breaking changes in a **Breaking changes** section at the end. In a `minor`, this is the semver exception (see [Choosing the bump](#choosing-the-bump)). These bullets do not follow the past-tense rule; write each one from the caller's side: the affected usage (`Passing …`, `Calling …`), what it does now in the present tense (`now …`, `no longer …`, `throws …`), then the migration as an instruction (`Pass …`, `Use … instead.`).
- Mention deprecations and their replacement; say when the deprecated path will be removed if known.
- Leave out internal refactors, test changes and anything already covered by the bump type (do not write "minor release").

Code snippets are allowed only to show a new or changed calling syntax, or the migration for a breaking change. Write them as two short `js` blocks labeled *before* and *after*, without imports, setup or output. The prose bullet comes first; the snippet illustrates it, it does not replace it. Behavior fixes, new options and deprecation notices do not need a snippet.

````md
---
"lambda-toolkit": minor
---

Changed the AWS namespace factories to take options directly.

- Added support for `aws.s3( { region } )` instead of `aws.s3( [ { region } ] )`.
- Deprecated the array form; it still works but logs a warning and will be removed in the next major.

**Breaking changes**

- Passing a single array as the only factory argument now unwraps it as the deprecated form, so it no longer reaches the SDK client as-is. Pass the arguments directly.

*before*

```js
const s3 = aws.s3( [ { region: 'us-east-1' } ] );
```

*after*

```js
const s3 = aws.s3( { region: 'us-east-1' } );
```
````

One changeset per PR is the norm. Use several files only when a PR contains unrelated changes with different bump types. Changesets reach `master` only through a merged PR: the changelog entry links that PR and credits its author.

## Dependency and security updates

Only dependency changes that alter what users install or run get a changeset. The package ships with no `dependencies`, the AWS SDK clients are `peerDependencies` resolved in the user's own tree, and `pnpm` overrides are never published. So:

- **No changeset** for `devDependencies`, lockfile-only bumps or overrides in `pnpm-workspace.yaml`, even when they fix an advisory. They keep this repo's audit clean but publish nothing new.
- **Changeset (`patch`)** when the fix reaches users: a new or bumped `dependencies` entry, code bundled into `dist`, or a raised minimum of a `peerDependencies` range.
- A vulnerable transitive dependency of a peer (e.g. an AWS SDK client) is fixed in the user's tree. Release only if the peer range minimum is raised to exclude the vulnerable versions, and describe that change.

Each AWS SDK client is listed twice in `package.json`: as a `peerDependencies` range (what users may install, e.g. `>=3.900.0 <4.0.0`) and as a pinned `devDependencies` version (what the tests run against). Bumping the pinned dev version while the peer range stays the same, which is what the monthly Dependabot `aws-sdk` PR does, needs **no changeset**: users already resolve any version in the range. It only confirms the package still works with a newer SDK.

Change the peer range only when the code needs it, and then add a changeset:

- **Raised minimum**: `patch` when it only excludes vulnerable versions (see above), `minor` when the code needs a feature from a newer SDK. Either way, users on an older SDK must upgrade, so state the new minimum.
- **Raised maximum** (supporting a new SDK major): `minor`.
- **Lowered maximum or dropped support** for an SDK major: `major`.

When raising the minimum, also bump the pinned dev version to at least that minimum so the tests cover it.

Reference each advisory by its GitHub Advisory Database link (the ID `npm audit` and Dependabot report), followed by the CVE ID and the severity GitHub assigns.

A single fix is one paragraph:

```md
---
"lambda-toolkit": patch
---

Raised the minimum `@aws-sdk/client-s3` peer version to `3.950.0`, resolving [GHSA-xxxx-xxxx-xxxx](https://github.com/advisories/GHSA-xxxx-xxxx-xxxx) (CVE-YYYY-NNNNN, low severity) in its `fast-xml-parser` dependency.
```

Several fixes in the same PR share one changeset, with a summary line and one bullet per advisory:

```md
---
"lambda-toolkit": patch
---

Updated dependencies to resolve security advisories.

- Raised the minimum `@aws-sdk/client-s3` peer version to `3.950.0`, resolving [GHSA-xxxx-xxxx-xxxx](https://github.com/advisories/GHSA-xxxx-xxxx-xxxx) (CVE-YYYY-NNNNN, low severity).
- Updated `example-dep` to `2.4.1`, resolving [GHSA-yyyy-yyyy-yyyy](https://github.com/advisories/GHSA-yyyy-yyyy-yyyy) (CVE-YYYY-MMMMM, high severity).
```

On every push to `master` (or a `release/**` branch) the release workflow collects the pending changesets into a `chore: release` PR. Merging that PR bumps `package.json`, updates `CHANGELOG.md`, publishes to npm, tags the commit and creates a GitHub release.

See [RELEASING.md](../RELEASING.md) for the full release and hotfix flow.
