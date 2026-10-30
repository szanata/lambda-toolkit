/**
 * Joins multiple arrays deduplicating items by their primitive value.
 * 
 * @template T The type of items in the arrays
 * @param arrays Arrays to join together
 * @returns A single array containing each unique value from all joined arrays
 * 
 * @example
 * ```ts
 * import { array } from 'lambda-toolkit';
 * const { joinUnique } = array;
 * 
 * const result = joinUnique([1, 2], [1, 3], [2, 3], [1, 2]);
 * // result: [1, 2, 3]
 * ```
 */
export function joinUnique<T>(...arrays: T[][]): T[];
