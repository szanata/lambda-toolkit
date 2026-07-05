/**
 * Transform each key in an object to camelCase. Converts nested keys recursively, even inside arrays.
 * 
 * @template T The type of the input object
 * @param obj The object to convert
 * @param options The options object
 * @param options.keepAllCaps Keep all caps keys as-is (default: false)
 * @returns A new object with camelCase keys
 * 
 * @example
 * ```ts
 * import { object } from 'lambda-toolkit';
 * const { camelize } = object;
 * 
 * const result = camelize({ input_color: 'red' });
 * // result: { inputColor: 'red' }
 * ```
 */
export function camelize<T extends Record<string, any>>(
  obj: T,
  options?: { keepAllCaps?: boolean }
): T;
