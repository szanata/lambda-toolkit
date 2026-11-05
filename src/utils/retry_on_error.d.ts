/**
 * Execute given function and if it throws an error retry it n times with optional back-offs and hooks.
 * 
 * @template T The return type of the closure
 * @param closure The function to execute
 * @param options The options object
 * @param options.limit Maximum number of times it will retry
 * @param options.delay Amount of milliseconds to wait between retries (grows exponentially)
 * @param options.retryHook A function to call before each retry, returning false will stop retrying
 * @returns A Promise which resolves when the function executed successfully or rejects when all retries are done
 * 
 * @example
 * ```ts
 * import { utils } from 'lambda-toolkit';
 * const { retryOnError } = utils;
 * 
 * const result = await retryOnError(
 *   async () => fetchData(),
 *   { limit: 3, delay: 1000, retryHook: (error, count) => console.log(`Retry ${count}`) }
 * );
 * ```
 */
export function retryOnError<T>(
  closure: () => Promise<T>,
  options: {
    limit: number;
    delay?: number;
    retryHook?: (error: Error, execCount: number) => Promise<boolean | void>;
  }
): Promise<T>;
