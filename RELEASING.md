# Releasing

Releases are automated with [Changesets](https://github.com/changesets/changesets) and the `Release` workflow (`.github/workflows/release.yml`). There is a single long-lived branch, `master`. Every published version is tagged `v<version>`.

## Regular release

1. Open a PR against `master`. If it changes the published package, add a changeset file (see [`.changeset/README.md`](./.changeset/README.md)).
2. Merge it. The `Release` workflow opens (or updates) a `chore: release` PR that bumps `package.json` and `CHANGELOG.md` with all pending changesets.
3. Keep merging feature PRs; the release PR is kept up to date automatically.
4. When you want to ship, merge the release PR. The workflow builds, runs the full test suite, publishes to npm, pushes the `v<version>` tag and creates a GitHub release.

> [!WARNING]
> Never bump `version` in `package.json` by hand. If `master` holds a version that is not on npm and there are no pending changesets, the `Release` workflow publishes it right away, without a CHANGELOG entry or a GitHub release. The `Build` workflow fails any PR that changes the version (`ops/check_version.sh`), except the `chore: release` PR.

If the changesets behind an open release PR leave the branch (e.g. the PR that added them is reverted), the `Release` workflow closes the now stale release PR (`ops/close_stale_release_pr.sh`). Never merge a release PR whose changesets are no longer on the branch.

## Hotfix for an already released version

Use this when `master` already contains unreleased (or newer released) work and you need to patch a version that is out in the wild without shipping the rest.

Example: `2.6.1` is live, `master` is already at `2.8.0` (or has a pending release PR), and `2.6.1` has a bug.

1. **Branch from the released tag.** The branch name must start with `release/`, that is what enables CI and the release workflow on it:

   ```sh
   git fetch --tags
   git checkout -b release/2.6.x v2.6.1
   git push -u origin release/2.6.x
   ```

   If `release/2.6.x` already exists from a previous hotfix, just check it out.

2. **Open the fix PR against `release/2.6.x`** (not `master`). Include a `patch` changeset:

   ```md
   ---
   "lambda-toolkit": patch
   ---

   Fixed <what> in <where>.
   ```

   The regular `Build` workflow runs on PRs targeting `release/**`.

3. **Merge the fix PR.** The `Release` workflow runs on `release/2.6.x` and opens a `chore: release` PR **targeting `release/2.6.x`** that bumps the version to `2.6.2`.

4. **Merge the release PR.** The workflow publishes `2.6.2`, tags `v2.6.2` and creates the GitHub release.

   The npm dist-tag is chosen by `ops/resolve_npm_dist_tag.sh`:
   - if `2.6.2` is newer than the current npm `latest`, it is published as `latest`;
   - otherwise it is published under `release-2.6`, so `npm install lambda-toolkit` keeps resolving to the newest line while users on `^2.6` still receive the fix.

5. **Forward-port the fix to `master`.** Open a PR from `release/2.6.x` (or cherry-pick the fix commit) against `master`, with its own `patch` changeset. Resolve conflicts in `package.json` / `CHANGELOG.md` in favor of `master`. This makes sure the next regular release also contains the fix.

6. Optionally delete `release/2.6.x`; it can be recreated from `v2.6.2` later.

### Hotfix for the current version

If the released version *is* the newest one and `master` only has unreleased changes you don't want to ship yet, the steps are identical: branch from the latest tag, e.g. `release/2.8.x` from `v2.8.0`. The dist-tag will resolve to `latest` because `2.8.1 > 2.8.0`.

If `master` has nothing unreleased you don't want to ship, skip all of this and just merge the fix into `master` with a `patch` changeset.

## Manually re-running a release

The `Release` workflow can be started from the Actions tab (`workflow_dispatch`) on `master` or any `release/**` branch. It is idempotent: it re-opens the release PR if there are pending changesets, publishes if the current version is not on npm yet, and does nothing otherwise.
