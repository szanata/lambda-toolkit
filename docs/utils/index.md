# Utils

Uncategorized functions.

Namespace: `utils`.

## Index
- [`fn` retryOnError](#fn-retryonerror)
- [`fn` sleep](#fn-sleep)
- [`class` Timer](#class-timer)
- [`fn` untarGz](#fn-untarGz)

## Members

### `fn` retryOnError

Execute given function and if it throws an error retry it _n_ times with optional back-offs and hooks.

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|closure|Function|The function to execute||
|options|Object|The options object||
|options.limit|Number|Maximum number of times it will retry|0|
|options.delay|Number|Amount of milliseconds to wait between retries, it will grow exponentially|0|
|options.retryHook|Function|A function to call before each retry||

#### Return

A Promise which resolves when the function executed successfully or rejects when all retries are done.

#### Example

Given this snippet:
```js
const fn = () => {
  console.log( 'I\'ll throw' );
  throw new Error( 'Ops' );
};
const options = { delay: 1, limit: 3, retryHook: () => console.log( 'hook!' ) } ;
await retryOnError( fn, options );
```

The console output is:
```bash
I'll throw
hook!
I'll throw
hook!
I'll throw
hook!
I'll throw
Uncaught Error: Ops
    at fn (REPL5:3:9)
    at execWithRetry (/app/src/utils/retry_on_error.js:9:18)
    at execWithRetry (/app/src/utils/retry_on_error.js:32:12)
    at async REPL7:1:33
```

### `fn` sleep

Returns a Promise that resolves in _n_ milliseconds.

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|t|Number|Amount of milliseconds to await before the Promise resolves||

#### Return

A Promise which resolves when the given time has passed.

#### Example

```js
const start = Date.now();
await sleep( 100 );
const end = Date.now();
assert.ok( end - start >= 100 );
```

### `class` Timer

See [docs](./timer.md).

### `fn` untarGz

Untar a gz file containing only json files in memory and return an array containing their parsed content (`JSON.parse`).

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|file|Buffer|A buffer containing the input `.tar.gz` file||

#### Return

An array were each position is the content of each file parsed.

#### Example

Given this snippet:
```js
const compressed = readFileSync( './files.tar.gz' );
const result = untarJsonGz( compressed );
assert.ok( Array.isArray( result ) );
```
