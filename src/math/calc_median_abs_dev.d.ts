/**
 * Calculate the Median Absolute Deviation (MAD) of a sequence of numbers.
 * 
 * @param values Array of numbers to calculate the MAD
 * @returns The MAD value
 * 
 * @example
 * ```ts
 * import { math } from 'lambda-toolkit';
 * const { calcMedianAbsDev } = math;
 * 
 * const result = calcMedianAbsDev([1, 2, 3, 4, 5]);
 * // result: 1
 * ```
 */
export function calcMedianAbsDev(values: number[]): number;
