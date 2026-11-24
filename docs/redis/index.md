# Redis

Functions to work with NodeJS [Redis](https://www.npmjs.com/package/redis).

Namespace: `redis`.

## Index
- [`fn` createClient](#fn-createclient)

## Members

### `fn` createClient

Receives the NodeJS Redis library and the redis database address as arguments and returns a connected redis client.

Why does this receive the Redis library instead of having it as dependency?

In one short answer: To not have dependencies on this project and to allow users to manage the Redis version and patches themselves.

#### Cache

When a client is created it is also saved to a cache object. Every time a client is requested with the same address the cached client is re-used if it is still connected (ping works).

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|{}|Object|Named parameter root object||
|redis|Redis|The NodeJS Redis lib||
|address|String|The database address||
|protocol|String|The connection protocol|`rediss`|
|port|Number|The database connection port|`6379`|

#### Return

A connected Redis client, the client is the one implemented by [Redis](https://www.npmjs.com/package/redis) library.

#### Example

```js
// CJS
const redis = require( 'redis' );
const { redis: { createClient } } = require( 'lambda-toolkit' );

// ESM
import * as redis from 'redis';
import { redis as redisToolkit } from 'lambda-toolkit';
const { createClient } = redisToolkit;

const client = await createClient( { redis, address: 'main.base.uuid.euw1.cache.amazonaws.com' } );
assert.equal( typeof client.send, 'function' );
```
