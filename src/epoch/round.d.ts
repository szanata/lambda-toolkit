/**
 * Round a timestamp down to the nearest interval.
 * 
 * @param time The timestamp to round
 * @param interval The interval to round to (in milliseconds)
 * @returns The rounded timestamp
 * 
 * @example
 * ```ts
 * import { epoch } from 'lambda-toolkit';
 * const { round } = epoch;
 * 
 * const result = round(1234567890, 1000);
 * // result: 1234567000
 * ```
 */
export function round(time: number, interval: number): number;
