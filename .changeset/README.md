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

On every push to `master` (or a `release/**` branch) the release workflow
collects the pending changesets into a "Version Packages" PR. Merging that PR
bumps `package.json`, updates `CHANGELOG.md`, publishes to npm, tags the commit
and creates a GitHub release.

See [RELEASING.md](../RELEASING.md) for the full release and hotfix flow.
