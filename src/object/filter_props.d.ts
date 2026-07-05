/**
 * Create an object containing only the specified properties.
 * 
 * @template T The type of the input object
 * @param obj The object to filter
 * @param props Array of property names to keep
 * @returns A new object with only the specified properties
 * 
 * @example
 * ```ts
 * import { object } from 'lambda-toolkit';
 * const { filterProps } = object;
 * 
 * const input = { id: 1, color: 'red', shape: 'square' };
 * const result = filterProps(input, ['id']);
 * // result: { id: 1 }
 * ```
 */
export function filterProps<T extends Record<string, any>>(
  obj: T,
  props: (keyof T)[]
): Partial<T>;
