/**
 * Round a number using standard rounding to the specified decimal places.
 * 
 * @param n The number to round
 * @param decimals Number of decimal places (default: 2)
 * @returns The rounded value
 * 
 * @example
 * ```ts
 * import { math } from 'lambda-toolkit';
 * const { roundStandard } = math;
 * 
 * const result = roundStandard(2.567, 2);
 * // result: 2.57
 * ```
 */
export function roundStandard(n: number, decimals?: number): number;
