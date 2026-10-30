/**
 * Breaks an array into multiple arrays of the same size.
 * 
 * @template T The type of items in the array
 * @param items The array to split
 * @param size The target batch size
 * @returns An array with _n_ arrays inside, each having _x_ size except the last, which will be in the range of _[1, x]_
 * 
 * @example
 * ```ts
 * import { array } from 'lambda-toolkit';
 * const { splitBatches } = array;
 * 
 * const result = splitBatches([1, 2, 3, 4, 5, 6, 7, 8, 9], 2);
 * // result: [[1, 2], [3, 4], [5, 6], [7, 8], [9]]
 * ```
 */
export function splitBatches<T>(items: T[], size: number): T[][];
