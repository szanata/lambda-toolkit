/**
 * Calculate the Z-score of a value given the mean and standard deviation.
 * 
 * @param sample The sample value
 * @param mean The mean of the population
 * @param stdDev The standard deviation of the population
 * @returns The Z-score, or NaN if stdDev is 0
 * 
 * @example
 * ```ts
 * import { math } from 'lambda-toolkit';
 * const { calcZScore } = math;
 * 
 * const result = calcZScore(70, 60, 10);
 * // result: 1
 * ```
 */
export function calcZScore(sample: number, mean: number, stdDev: number): number;
