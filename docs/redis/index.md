# Redis

Functions to work with NodeJS [Redis](https://www.npmjs.com/package/redis) 

Namespace: `redis.`

## Index
- [`fn` createClient](#fn-createclient)

## Members

### `fn` createClient

Receives the NodeJS Redis library and a target address as an argument and return a connected redis client.

Why does this receives the Redis library instead of having it as dependency?

In one short answer: To not have dependencies on this project and to allow users to manage the Redis version and patches themselves.

#### Cache

when a client is created is also saved to a cache object. Every time a client is requests with the same address the cached client is re-used if it is still connected (ping works).

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|redis|Redis|The NodeJS Redis lib||
|text|address|The database address||
|text|protocol|The connection protocol|Defaults to `rediss`|
|text|port|The database connection port|Defaults to `6379`|

#### Return

A connect Redis client, the client is the one implement by [Redis](https://www.npmjs.com/package/redis) library.

#### Example

```js
const redis = require( 'redis' );
const { redis: { createClient } } = require( '<this lib>' );

const client = createClient( { redis, address: 'main.base.uuid.euw1.cache.amazonaws.com' } );
assert.equal( typeof client.send, 'function' );
```
