/**
 * Remove empty array fields from an object.
 * 
 * @template T The type of the input object
 * @param obj The object to process
 * @returns A new object with empty arrays removed
 * 
 * @example
 * ```ts
 * import { object } from 'lambda-toolkit';
 * const { removeEmptyArrays } = object;
 * 
 * const input = { id: 1, tags: [], names: ['foo'] };
 * const result = removeEmptyArrays(input);
 * // result: { id: 1, names: ['foo'] }
 * ```
 */
export function removeEmptyArrays<T extends Record<string, any>>(obj: T): Partial<T>;
