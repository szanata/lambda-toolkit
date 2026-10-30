/**
 * Round a number using Gaussian (banker's) rounding to the specified decimal places.
 * Rounds .5 to the nearest even number.
 * 
 * @param n The number to round
 * @param decimals Number of decimal places (default: 2)
 * @returns The rounded value, or NaN if input is not a finite number
 * 
 * @example
 * ```ts
 * import { math } from 'lambda-toolkit';
 * const { roundGaussian } = math;
 * 
 * const result = roundGaussian(2.5, 0);
 * // result: 2 (rounds to nearest even)
 * ```
 */
export function roundGaussian(n: number, decimals?: number): number;
