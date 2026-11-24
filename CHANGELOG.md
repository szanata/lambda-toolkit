# lambda-toolkit

## 2.7.1

### Patch Changes

- [#100](https://github.com/szanata/lambda-toolkit/pull/100) Updated the `fast-xml-parser` transitive dependency pulled in by the AWS SDK clients to `5.12.0`, resolving [GHSA-474x-hrwr-fgx4](https://github.com/advisories/GHSA-474x-hrwr-fgx4) (CVE-2026-126066, low severity). Thanks [@szanata](https://github.com/szanata)!

## 2.7.0

### Minor Changes

- [#86](https://github.com/szanata/lambda-toolkit/pull/86) Added support for passing client arguments directly when calling an AWS namespace as a factory. Thanks [@szanata](https://github.com/szanata)!
  
  - Changed AWS namespace factories (`aws.s3(...)`, `aws.sqs(...)`, etc.) to take the SDK client arguments as native arguments instead of a single array.
  - Changed `aws.timestreamQuery(...)` and `aws.timestreamWrite(...)` to accept client arguments through the same factory syntax, merged on top of their defaults.
  - Deprecated passing the client arguments wrapped in an array; it still works but logs a `[DEPRECATED]` warning and will be removed in the next major.
  
  **Breaking changes**
  
  - Passing a single array as the only factory argument is now treated as the deprecated syntax and unwrapped, so an SDK client cannot receive a non-empty array as its first argument through the factory. Pass arguments directly.
  
  *before*
  
  ```js
  const client = aws.s3( [ { region: 'eu-west-1' } ] );
  ```
  
  *after*
  
  ```js
  const client = aws.s3( { region: 'eu-west-1' } );
  ```
