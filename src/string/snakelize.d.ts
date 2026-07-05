/**
 * Transform a string to snake_case. Converts each space-bound sequence individually.
 * 
 * @param input The string to convert
 * @param options The options object
 * @param options.keepAllCaps Keep all caps sequences as-is (default: false)
 * @returns A new string in snake_case format
 * 
 * @example
 * ```ts
 * import { string } from 'lambda-toolkit';
 * const { snakelize } = string;
 * 
 * const result = snakelize('CamelCase');
 * // result: 'camel_case'
 * ```
 */
export function snakelize(input: string, options?: { keepAllCaps?: boolean }): string;
