# lambda-toolkit

## 2.7.0

### Minor Changes

- [#86](https://github.com/szanata/lambda-toolkit/pull/86) Thanks [@szanata](https://github.com/szanata)! - Accept client arguments directly when calling an AWS namespace as a factory.
  
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
