/**
 * Returns a Promise that resolves in n milliseconds.
 * 
 * @param t Amount of milliseconds to await before the Promise resolves
 * @returns A Promise which resolves when the given time has passed
 * 
 * @example
 * ```ts
 * import { utils } from 'lambda-toolkit';
 * const { sleep } = utils;
 * 
 * const start = Date.now();
 * await sleep(1000);
 * ```
 */
export function sleep(t: number): Promise<void>;
