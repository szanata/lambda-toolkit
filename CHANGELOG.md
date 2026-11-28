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

## 2.6.1

### Patch Changes

- [#82](https://github.com/szanata/lambda-toolkit/pull/82) Fixed the TypeScript declarations for S3 signed URLs to match the existing runtime API. Thanks [@lzanatta](https://github.com/lzanatta)!

  - Added the optional fourth `nativeArgs` argument to `aws.s3.getSignedDownloadUrl` and `aws.s3.getSignedUploadUrl`.
  - Fixed `aws.s3.getSignedUrl` declaring an HTTP-method argument that the implementation never accepted; its third argument is the optional expiration in seconds.
  - Added the existing deprecation notice to the `aws.s3.getSignedUrl` declarations, pointing callers to `aws.s3.getSignedDownloadUrl`.

## 2.6.0

### Minor Changes

- [#79](https://github.com/szanata/lambda-toolkit/pull/79) Added TypeScript declarations for the complete public package API. Thanks [@szanata](https://github.com/szanata)!

  - Added bundled declarations for both ESM and CommonJS consumers, resolved automatically through the package exports.
  - Added the optional `@types/node` peer dependency with a minimum version of `24` for TypeScript consumers.
  - Added the public `aws.LambdaError` export for identifying errors returned by `aws.lambda.invoke`.

- [#78](https://github.com/szanata/lambda-toolkit/pull/78) Added `aws.s3.remove` to delete an object and return the full SDK response, with optional native `DeleteObjectCommand` arguments. Thanks [@lzanatta](https://github.com/lzanatta)!

### Patch Changes

- [#79](https://github.com/szanata/lambda-toolkit/pull/79) Fixed `LambdaApi.addHandler` validating the unused `routeMatch` and `pathMatch` properties instead of the documented `routeMatches` and `pathMatches` options; invalid regular-expression matchers now raise validation errors naming the correct options. Thanks [@szanata](https://github.com/szanata)!

## 2.5.0

### Patch Changes

- [#74](https://github.com/szanata/lambda-toolkit/pull/74) Fixed `LambdaApi.process` ignoring registered `HEAD` handlers and always returning HTTP 204. Thanks [@henriquelbsouza](https://github.com/henriquelbsouza)!

  - Changed `HEAD` requests to run a matching handler and use its response status and headers.
  - Preserved the default HTTP 204 response when no `HEAD` handler matches.

## 2.4.0

### Minor Changes

- [#72](https://github.com/szanata/lambda-toolkit/pull/72) Added the optional fourth `nativeArgs` argument to `aws.s3.getSignedDownloadUrl`, allowing native `GetObjectCommand` options such as `ResponseContentDisposition` in signed download URLs. Thanks [@lzanatta](https://github.com/lzanatta)!

### Patch Changes

- [#71](https://github.com/szanata/lambda-toolkit/pull/71) Changed the minimum supported Node.js version from `24.13` to `20.11.0`, allowing installation on older compatible runtimes; the npm minimum remained `11.12.1`. Thanks [@szanata](https://github.com/szanata)!

## 2.3.0

### Minor Changes

- [#70](https://github.com/szanata/lambda-toolkit/pull/70) Added `aws.s3.getObject` to retrieve the full SDK response, including the streaming `Body`, with optional native `GetObjectCommand` arguments. Thanks [@lzanatta](https://github.com/lzanatta)!

## 2.2.0

### Minor Changes

- [#69](https://github.com/szanata/lambda-toolkit/pull/69) Added S3 helpers for signed download, upload and POST URLs. Thanks [@lzanatta](https://github.com/lzanatta)!

  - Added `aws.s3.getSignedDownloadUrl` for signed GET URLs.
  - Added `aws.s3.getSignedUploadUrl` for signed PUT URLs, with optional native `PutObjectCommand` arguments.
  - Added `aws.s3.getSignedPostUrl` for presigned POST uploads, returning the SDK's URL and form fields with optional native presigned POST arguments.
  - Added the `@aws-sdk/s3-presigned-post` peer dependency with the range `>=3.900.0 <4.0.0`.
  - Deprecated `aws.s3.getSignedUrl` in favor of `aws.s3.getSignedDownloadUrl`; existing calls retained their behavior.

## 2.1.2

### Patch Changes

- [#68](https://github.com/szanata/lambda-toolkit/pull/68) Changed AWS SDK packages from pinned runtime dependencies to peer dependencies. Thanks [@szanata](https://github.com/szanata)!

  - Changed all existing AWS SDK dependency ranges to `>=3.900.0 <4.0.0`, allowing callers to share compatible SDK installations instead of installing the package's pinned `3.1018.0` versions.
  - Removed the package's direct runtime dependencies; AWS SDK peers must be installed by the consumer's package manager or supplied by the runtime.

## 2.1.1

### Major Changes

- [#67](https://github.com/szanata/lambda-toolkit/pull/67) Added declared engine requirements of Node.js `>=24.13` and npm `>=11.12.1`. Thanks [@szanata](https://github.com/szanata)!

  **Breaking changes**

  - Installing on Node.js older than `24.13` or npm older than `11.12.1` now violates the package's engine constraints and can fail with strict engine checks. Upgrade the runtime and package manager, or use `2.4.0` or newer for the relaxed Node.js minimum of `20.11.0`.

## 2.1.0

### Minor Changes

- [#63](https://github.com/szanata/lambda-toolkit/pull/63) Added support for passing native `DeleteCommand` arguments to `aws.dynamo.remove`. Thanks [@lzanatta](https://github.com/lzanatta)!

  - Added the single-object calling form for options such as conditions and return values.
  - Preserved `aws.dynamo.remove( tableName, key )`, including its default `ReturnValues: 'ALL_OLD'` and returned item attributes.

## 2.0.2

### Patch Changes

- [#64](https://github.com/szanata/lambda-toolkit/pull/64) Updated all runtime AWS SDK dependencies from `3.984.0` to `3.1018.0`. Thanks [@szanata](https://github.com/szanata)!

## 2.0.1

### Patch Changes

- [#61](https://github.com/szanata/lambda-toolkit/pull/61) Fixed the published package missing its ESM bundle because building one format removed the other; both ESM and CommonJS entry points are now included. Thanks [@lzanatta](https://github.com/lzanatta)!

## 2.0.0

### Major Changes

- [#33](https://github.com/szanata/lambda-toolkit/pull/33) Changed the package's module format and exports to provide named ESM exports alongside the existing CommonJS API. Thanks [@szanata](https://github.com/szanata)!

  - Changed the ESM entry point to expose `LambdaApi`, `array`, `aws`, `epoch`, `math`, `object`, `redis`, `string` and `utils` as named exports.
  - Preserved the public namespaces and calling syntax returned by `require( 'lambda-toolkit' )`.
  - Changed the package export map to select `dist/index.mjs` for imports and `dist/index.cjs` for require calls.

  **Breaking changes**

  - Default-importing `lambda-toolkit` no longer returns a CommonJS namespace object. Use named ESM imports, or keep using the CommonJS package entry point.
  - Importing internal build files through package subpaths is now blocked by the export map. Use the public `lambda-toolkit` entry point instead.
  - Importing the published `2.0.0` package as ESM fails because its archive omits `dist/index.mjs`. Upgrade to `2.0.1` or newer for the corrected ESM distribution.

## 2.0.0-dev.2

No public API or runtime changes from `2.0.0-dev.1`; this development release only updated bundled `LambdaApi` JSDoc in [#51](https://github.com/szanata/lambda-toolkit/pull/51).

## 2.0.0-dev.1

### Patch Changes

- [0c5f5c4](https://github.com/szanata/lambda-toolkit/commit/0c5f5c440f2ae0a99475739c2982c77c8d461bfc) Fixed the package's `LambdaApi` export returning a module namespace instead of the class, restoring `new LambdaApi()` for ESM and CommonJS consumers of the development build. Thanks [@szanata](https://github.com/szanata)!

## 2.0.0-dev.0

### Major Changes

- [#33](https://github.com/szanata/lambda-toolkit/pull/33) Added a development preview of the ESM package entry point with a separate CommonJS build. Thanks [@szanata](https://github.com/szanata)!

  - Added named ESM namespace exports for `array`, `aws`, `epoch`, `math`, `object`, `redis`, `string` and `utils`.
  - Changed package resolution to select separate `.mjs` and `.cjs` builds through the export map.

  **Breaking changes**

  - Default-importing the package no longer returns the previous CommonJS namespace object. Use named ESM imports or the CommonJS entry point.
  - Importing internal build files through package subpaths is now blocked. Use the public package entry point.
  - Calling `new LambdaApi()` in this prerelease fails because `LambdaApi` is exported as a module namespace. Upgrade to `2.0.0-dev.1` or newer for the corrected class export.

## 1.1.1

### Minor Changes

- [#28](https://github.com/szanata/lambda-toolkit/pull/28) Added `event.rawBody` to `LambdaApi` handlers for API Gateway payloads v1 and v2, preserving the original request body for uses such as webhook signature validation. Thanks [@henriquelbsouza](https://github.com/henriquelbsouza)!

### Patch Changes

- [b5fb227](https://github.com/szanata/lambda-toolkit/commit/b5fb22716ca5cf5eb10551f6ae3e2e6e62e17ae9) Updated all runtime AWS SDK dependencies from the `^3.840.0` ranges to pinned `3.984.0` versions. Thanks [@szanata](https://github.com/szanata)!

## 1.1.0

### Minor Changes

- [#21](https://github.com/szanata/lambda-toolkit/pull/21) Added `aws.sns.publishBatch` to publish up to ten messages to an SNS topic in one request. Thanks [@lzanatta](https://github.com/lzanatta)!

  - Added per-message `body`, optional `id` and `nativeArgs`, with JSON serialization for non-string bodies.
  - Added errors for batches over ten messages and failed entries, with the failed entries available through `error.details`.

### Patch Changes

- [#21](https://github.com/szanata/lambda-toolkit/pull/21) Fixed the `aws.sqs.sendMessageBatch` validation message incorrectly describing its ten-message limit as "then messages". Thanks [@lzanatta](https://github.com/lzanatta)!

## 1.0.0

### Patch Changes

- [#20](https://github.com/szanata/lambda-toolkit/pull/20) Updated all runtime AWS SDK dependency ranges to `^3.840.0`, retaining the public API and behavior of `0.0.14-beta`. Thanks [@szanata](https://github.com/szanata)!

## 0.0.14-beta

### Minor Changes

- [#19](https://github.com/szanata/lambda-toolkit/pull/19) Added `aws.cwLogs.query` for CloudWatch Logs Insights queries. Thanks [@szanata](https://github.com/szanata)!

  - Added automatic polling until a query completes and errors for failed, cancelled or timed-out queries.
  - Added parsed query results as `{ items, count }`, including number, boolean and date conversion where applicable.
  - Added optional millisecond-based `range.from` and `range.to` values to override the SDK's second-based query time range.
  - Added the `@aws-sdk/client-cloudwatch-logs` runtime dependency with the range `^3.774.0`.

## 0.0.13-beta

### Patch Changes

- [#18](https://github.com/szanata/lambda-toolkit/pull/18) Fixed `aws.s3.upload` JSON-stringifying `Buffer` bodies; buffers are now uploaded unchanged, while objects retain JSON serialization. Thanks [@lzanatta](https://github.com/lzanatta)!
- [df9990a](https://github.com/szanata/lambda-toolkit/commit/df9990a44e83740e0abd5bff3176919a862c63d0) Updated runtime AWS SDK dependency ranges to `^3.758.0`, with `@aws-sdk/client-ssm` at `^3.759.0`. Thanks [@szanata](https://github.com/szanata)!

## 0.0.12-beta

### Minor Changes

- [#16](https://github.com/szanata/lambda-toolkit/pull/16) Added support for API Gateway's `isBase64Encoded` flag in `LambdaApi` requests and responses. Thanks [@lzanatta](https://github.com/lzanatta)!

  - Added `event.isBase64Encoded` for payloads v1 and v2, defaulting to `false` when absent.
  - Added support for returning `isBase64Encoded` in a handler's response object or as the fourth value of a response array.
  - Added `isBase64Encoded` to generated API Gateway responses, defaulting to `false`.

## 0.0.11-beta

### Major Changes

- [#14](https://github.com/szanata/lambda-toolkit/pull/14) Changed `aws.sqs.sendMessageBatch` entries to accept native SDK options under `nativeArgs`. Thanks [@szanata](https://github.com/szanata)!

  - Changed native options to be applied after the generated `Id` and `MessageBody`, allowing explicit overrides.

  **Breaking changes**

  - Passing SDK options directly on a batch entry no longer forwards them to SQS. Move options such as `DelaySeconds`, `MessageAttributes` and FIFO settings into the entry's `nativeArgs` object.

  *before*

  ```js
  await aws.sqs.sendMessageBatch( queue, [ { body, DelaySeconds: 10 } ] );
  ```

  *after*

  ```js
  await aws.sqs.sendMessageBatch( queue, [ { body, nativeArgs: { DelaySeconds: 10 } } ] );
  ```

## 0.0.10-beta

### Patch Changes

- [#11](https://github.com/szanata/lambda-toolkit/pull/11) Fixed API Gateway payload detection and v1 header and query-string parsing in `LambdaApi`. Thanks [@szanata](https://github.com/szanata)!

  - Changed payloads without an explicit `version: '2.0'` to use the v1 parser.
  - Fixed single-value headers and query parameters being nested under `headers` and `queryStringParameters` instead of merged into `event.headers` and `event.queryString`.
  - Preserved merging of multi-value headers and query parameters into comma-separated values.

## 0.0.9-beta

### Minor Changes

- [#10](https://github.com/szanata/lambda-toolkit/pull/10) Added `object.removeEmptyArrays` to remove properties whose values are empty arrays while preserving non-empty arrays and other values. Thanks [@lzanatta](https://github.com/lzanatta)!

## 0.0.8-beta

### Patch Changes

- [ce87433](https://github.com/szanata/lambda-toolkit/commit/ce8743390f0e7f78d810cb9c0bc92d35f66bf166) Fixed the package entry point omitting the `redis` namespace, exposing `redis.createClient` for cached Redis connections with configurable address, protocol and port. Thanks [@szanata](https://github.com/szanata)!

## 0.0.7-beta

### Major Changes

- [#9](https://github.com/szanata/lambda-toolkit/pull/9) Changed `aws.timestreamQuery.query` to parse `BIGINT` values as numbers when they fit within JavaScript's safe-integer range, retaining strings for values outside that range. Thanks [@szanata](https://github.com/szanata)!

  **Breaking changes**

  - Reading a safely representable `BIGINT` column now returns a number rather than a string. Use `String( value )` if the caller requires a consistent string representation.

## 0.0.6-beta

### Minor Changes

- [#9](https://github.com/szanata/lambda-toolkit/pull/9) Added the `recursive` option to `aws.timestreamQuery.query` to follow pagination tokens automatically and combine parsed pages. Thanks [@szanata](https://github.com/szanata)!

  - Preserved single-page queries and `rawResponse` when `recursive` is `false`.
  - Changed recursive queries to return parsed results even when `rawResponse` is requested.

## 0.0.5-beta

### Patch Changes

- [34edb84](https://github.com/szanata/lambda-toolkit/commit/34edb84b754b76904c70042e9e235b60691013d6) Fixed the published CommonJS bundle containing an ESM `import` statement, allowing Node.js to load the package through its `main` entry point. Thanks [@szanata](https://github.com/szanata)!

## 0.0.4-beta

### Patch Changes

- [#7](https://github.com/szanata/lambda-toolkit/pull/7) Changed distribution to a single CommonJS `dist/index.js` entry point and added the AWS SDK packages as runtime dependencies. Thanks [@szanata](https://github.com/szanata)!

  - Changed package resolution from separate `.mjs` and `.cjs` exports to the CommonJS `main` entry point.
  - Added AWS SDK dependency ranges of `^3.734.0`, with `@aws-sdk/client-s3`, `@aws-sdk/client-ssm` and `@aws-sdk/s3-request-presigner` at `^3.735.0`.

## 0.0.3-beta

### Patch Changes

- [#6](https://github.com/szanata/lambda-toolkit/pull/6) Fixed the package entry point omitting the `aws` namespace, making the AWS service helpers available to package consumers. Thanks [@lzanatta](https://github.com/lzanatta)!

  - Added access to `aws.athena`, `aws.dynamo`, `aws.lambda`, `aws.s3`, `aws.ses`, `aws.sns`, `aws.sqs`, `aws.ssm`, `aws.timestreamQuery` and `aws.timestreamWrite`.
  - Added access to cached AWS client factories, query pagination helpers, DynamoDB operations, Lambda invocation, S3 operations, SES email, SNS publishing, SQS messaging, SSM parameters and Timestream queries and writes.

- [ec2a4ac](https://github.com/szanata/lambda-toolkit/commit/ec2a4ac) Fixed distribution builds removing one module format while generating the other, retaining both ESM and CommonJS bundles. Thanks [@szanata](https://github.com/szanata)!

## 0.0.2-beta

### Patch Changes

- [2c9f2f5](https://github.com/szanata/lambda-toolkit/commit/2c9f2f5ff59b57a8f103d9de18dd638316110b7d) Fixed the distributed build paths to match the package's declared `dist/index.mjs` and `dist/index.cjs` entry points. Thanks [@szanata](https://github.com/szanata)!

## 0.0.1-beta

### Minor Changes

- [a04254e](https://github.com/szanata/lambda-toolkit/commit/a04254e05139906948d340d760321f97319d6644) Added the initial beta toolkit with `LambdaApi` and the `array`, `epoch`, `math`, `object`, `string` and `utils` namespaces. Thanks [@szanata](https://github.com/szanata)!

  - Added `LambdaApi` request parsing for API Gateway payloads v1 and v2, method and route/path matching, before/after hooks, error handlers, request/response key transformations and response serialization.
  - Added `array.joinUnique`, `array.joinUniqueCustom` and `array.splitBatches`.
  - Added epoch conversion and duration helpers: `days`, `hours`, `minutes`, `months`, `msToS`, `round` and `seconds`.
  - Added statistical helpers: `calcMean`, `calcMedian`, `calcMedianAbsDev`, `calcStdDevPopulation`, `calcStdDevSample` and `calcZScore`, plus `roundGaussian` and `roundStandard`.
  - Added `object.camelize`, `object.snakelize` and `object.filterProps`.
  - Added `string.camelize`, `string.snakelize` and `string.capitalizeWords`.
  - Added `utils.retryOnError`, `utils.sleep`, `utils.Timer` and `utils.untarJsonGz`.

### Patch Changes

- [#4](https://github.com/szanata/lambda-toolkit/pull/4) Fixed `LambdaApi` request-event serialization and error-handler matching before the initial beta. Thanks [@szanata](https://github.com/szanata)!

  - Changed handler events to expose serializable public properties instead of private fields with getters.
  - Changed registered error handlers to match errors with `instanceof`, including subclasses.
  - Fixed parsing requests with missing optional headers, parameters or authorizer fields.
