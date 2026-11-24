# lambda-toolkit

## 2.7.1

### Patch Changes

- [#117](https://github.com/szanata/lambda-toolkit/pull/117) Fixed `aws.athena.query` throwing a `TypeError` when called without the `options` argument. Thanks [@szanata](https://github.com/szanata)!
- [#115](https://github.com/szanata/lambda-toolkit/pull/115) Fixed `aws.athena.query` dropping the first row of every result page after the first, both with `recursive: true` and when paginating with `paginationToken`. Thanks [@szanata](https://github.com/szanata)!
- [#116](https://github.com/szanata/lambda-toolkit/pull/116) Fixed `aws.athena.query` ignoring `maxResults` when `recursive` is `true`; it is now used as the page size of every request. Thanks [@szanata](https://github.com/szanata)!
- [#113](https://github.com/szanata/lambda-toolkit/pull/113) Fixed `aws.timestreamQuery.query` with `recursive: true` returning only the last two pages of results when a query spans more than two pages. Thanks [@szanata](https://github.com/szanata)!

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
