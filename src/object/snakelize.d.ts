/**
 * Transform each key in an object to snake_case. Converts nested keys recursively, even inside arrays.
 * 
 * @param obj The object to convert
 * @param options The options object
 * @param options.keepAllCaps Keep all caps keys as-is (default: false)
 * @returns A new object with snake_case keys
 * 
 * @example
 * ```ts
 * import { object } from 'lambda-toolkit';
 * const { snakelize } = object;
 * 
 * const result = snakelize({ inputColor: 'red' });
 * // result: { input_color: 'red' }
 * ```
 */
export function snakelize(
  obj: Record<string, any>,
  options?: { keepAllCaps?: boolean }
): Record<string, any>;
