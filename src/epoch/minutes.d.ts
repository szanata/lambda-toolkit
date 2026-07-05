/**
 * Convert minutes to milliseconds.
 * 
 * @param n Number of minutes
 * @returns Number of milliseconds
 * 
 * @example
 * ```ts
 * import { epoch } from 'lambda-toolkit';
 * const { minutes } = epoch;
 * 
 * const result = minutes(2);
 * // result: 120_000
 * ```
 */
export function minutes(n: number): number;
