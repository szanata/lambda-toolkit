/**
 * Calculate the sample standard deviation of a sequence of numbers.
 * 
 * @param values Array of numbers to calculate the sample standard deviation
 * @returns The standard deviation value, or NaN if values.length < 2
 * 
 * @example
 * ```ts
 * import { math } from 'lambda-toolkit';
 * const { calcStdDevSample } = math;
 * 
 * const result = calcStdDevSample([1, 2, 3, 4, 5]);
 * // result: ~1.58
 * ```
 */
export function calcStdDevSample(values: number[]): number;
