/**
 * Create a redis client instance. Caches and reuses connected clients by address.
 * 
 * Note: Receives the Redis library instead of having it as a dependency to allow users
 * to manage the Redis version and patches themselves.
 * 
 * @param redis The NodeJS Redis lib
 * @param address The database address
 * @param protocol The connection protocol (default: 'rediss')
 * @param port The database connection port (default: 6379)
 * @returns A connected Redis client instance
 * 
 * @example
 * ```ts
 * import redis from 'redis';
 * import { redis as redisToolkit } from 'lambda-toolkit';
 * const { createClient } = redisToolkit;
 * 
 * const client = await createClient({
 *   redis,
 *   address: 'main.base.uuid.euw1.cache.amazonaws.com'
 * });
 * ```
 */
export function createClient(options: {
  redis: any;
  address: string;
  protocol?: string;
  port?: number;
}): Promise<any>;
