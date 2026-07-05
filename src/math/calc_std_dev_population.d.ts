/**
 * Calculate the population standard deviation of a sequence of numbers.
 * 
 * @param values Array of numbers to calculate the population standard deviation
 * @returns The standard deviation value
 * 
 * @example
 * ```ts
 * import { math } from 'lambda-toolkit';
 * const { calcStdDevPopulation } = math;
 * 
 * const result = calcStdDevPopulation([1, 2, 3, 4, 5, 6, 7]);
 * // result: 2
 * ```
 */
export function calcStdDevPopulation(values: number[]): number;
