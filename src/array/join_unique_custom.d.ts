/**
 * Joins multiple arrays using a custom function that generates a deduplication key for each item.
 * 
 * @template T The type of items in the arrays
 * @param options Configuration object
 * @param options.items Array containing each array to join together
 * @param options.key A function that receives each item from each array and returns the deduplication key
 * @returns A single array containing each unique item from each array determined by the `key` function
 * 
 * @example
 * ```ts
 * import { array } from 'lambda-toolkit';
 * const { joinUniqueCustom } = array;
 * 
 * const result = joinUniqueCustom({
 *   items: [[1], [2], [3], [4]],
 *   key: (v) => v % 2 === 0
 * });
 * // result: [1, 2]
 * ```
 * 
 * @example
 * ```ts
 * const result = joinUniqueCustom({
 *   items: [[{ id: 1 }], [{ id: 2 }], [{ id: 3 }], [{ id: 4 }]],
 *   key: (v) => v.id
 * });
 * // result: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]
 * ```
 */
export function joinUniqueCustom<T>(options: {
  items: T[][];
  key: (item: T) => string | number | symbol;
}): T[];
