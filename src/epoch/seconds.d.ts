/**
 * Convert seconds to milliseconds.
 * 
 * @param n Number of seconds
 * @returns Number of milliseconds
 * 
 * @example
 * ```ts
 * import { epoch } from 'lambda-toolkit';
 * const { seconds } = epoch;
 * 
 * const result = seconds(2);
 * // result: 2_000
 * ```
 */
export function seconds(n: number): number;
