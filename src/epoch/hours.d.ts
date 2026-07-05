/**
 * Convert hours to milliseconds.
 * 
 * @param n Number of hours
 * @returns Number of milliseconds
 * 
 * @example
 * ```ts
 * import { epoch } from 'lambda-toolkit';
 * const { hours } = epoch;
 * 
 * const result = hours(2);
 * // result: 7_200_000
 * ```
 */
export function hours(n: number): number;
