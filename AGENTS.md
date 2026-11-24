# Agent instructions

## Changesets and releases

- When a change affects the published package, add a changeset following
  [.changeset/README.md](./.changeset/README.md): bump type, wording, breaking
  changes, snippets and dependency/security updates are all defined there.
- Never edit `version` in `package.json` or write to `CHANGELOG.md`; the release
  PR does both. CI fails PRs that change the version.
- Release and hotfix flow: [RELEASING.md](./RELEASING.md).

## Development

- Run installs, tests, lint and builds inside Docker only (`./run.sh node` opens a
  shell in the project's Node image), never on the host.
- Follow the ESLint config (`eslint.config.js`) for code style.
