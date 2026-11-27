# Integration tests

Tests the built library against real AWS APIs, served by a local emulator (MiniStack).

## Strategy

- **Test the built package.** Tests import `lambda-toolkit`, which resolves to `dist/`. They never import `src/`.
- **Arrange and assert with the native AWS SDK.** Seeding, verification and cleanup use the SDK clients directly, never the library under test. This way, a bug in the library can't hide itself.
- **Resources come from Terraform.** Tests read resource names (bucket, table...) by output name with `infraOutput()`. They don't hardcode them and don't create them.
- **Isolation by prefix.** Each test file works under its own unique prefix (`runPrefix()`) and deletes what it created in `after()`. Files run one at a time.
- **No environment coupling.** The endpoint and credentials come from the standard `AWS_*` env vars, and the outputs file comes from `INFRA_OUTPUTS`.

## Layout

```
helpers.js            infraOutput(), clientConfig, runPrefix(): shared by all services
<service>/
  setup.js            Native client, library client and seed/verify/cleanup helpers
  <function>.test.js  One file per library function
```

Smaller services can use a single `<service>.test.js` instead of a folder.

## Limits

The tests are only as strict as MiniStack. For example, MiniStack doesn't verify presigned URL signatures, so these tests can't catch signing bugs.
