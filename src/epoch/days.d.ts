/**
 * Convert days to milliseconds.
 * 
 * @param n Number of days
 * @returns Number of milliseconds
 * 
 * @example
 * ```ts
 * import { epoch } from 'lambda-toolkit';
 * const { days } = epoch;
 * 
 * const result = days(2);
 * // result: 172_800_000
 * ```
 */
export function days(n: number): number;
