/**
 * Convert months to milliseconds. Month is 30 days long.
 * 
 * @param n Number of months
 * @returns Number of milliseconds
 * 
 * @example
 * ```ts
 * import { epoch } from 'lambda-toolkit';
 * const { months } = epoch;
 * 
 * const result = months(2);
 * // result: 5_256_000_000
 * ```
 */
export function months(n: number): number;
