/**
 * Transform a string to camelCase. Converts each space-bound sequence individually.
 * 
 * @param input The string to convert
 * @param options The options object
 * @param options.keepAllCaps Keep all caps sequences as-is (default: false)
 * @returns A new string in camelCase format
 * 
 * @example
 * ```ts
 * import { string } from 'lambda-toolkit';
 * const { camelize } = string;
 * 
 * const result = camelize('foo_bar');
 * // result: 'fooBar'
 * ```
 */
export function camelize(input: string, options?: { keepAllCaps?: boolean }): string;
