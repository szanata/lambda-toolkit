global.__redisInstances = {};

/**
 * Create a redis client instance
 * @param {Object} redis Redis npm dependency
 * @param {String} address Redis DB address (either RW or RO)
 * @returns redisClient A new redis client instance connected to the database
 */
module.exports = async ( { redis, address, protocol = 'rediss', port = 6379 } ) => {
  if ( global.__redisInstances[address] ) {
    try {
      const r = await global.__redisInstances[address].ping();
      if ( r === 'PONG' ) {
        return global.__redisInstances[address];
      } else {
        delete global.__redisInstances[address];
      }
    } catch {
      delete global.__redisInstances[address];
    }
  }

  const client = redis.createClient( { url: `${protocol}://${address}:${port}`, socket: { keepAlive: 15000 } } );

  await client.connect();

  global.__redisInstances[address] = client;
  return client;
};
