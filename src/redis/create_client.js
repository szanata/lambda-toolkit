global.__redisInstances = {};

/**
 * Create a redis client instance
 *
 * @param {Object} args
 * @param {Object} args.redis Redis npm dependency
 * @param {String} args.address Redis DB address (either RW or RO)
 * @param {String} [args.protocol=rediss] Redis connection protocol
 * @param {String} [args.port=6379] Redis DB connection port
 * @returns redisClient A new redis client instance connected to the database
 */
export const createClient = async ( { redis, address, protocol = 'rediss', port = 6379 } ) => {
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
