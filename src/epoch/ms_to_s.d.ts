/**
 * Convert milliseconds to seconds, rounding up.
 * 
 * @param n Number of milliseconds
 * @returns Number of seconds (rounded up)
 * 
 * @example
 * ```ts
 * import { epoch } from 'lambda-toolkit';
 * const { msToS } = epoch;
 * 
 * const result = msToS(2500);
 * // result: 3
 * ```
 */
export function msToS(n: number): number;
