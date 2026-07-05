/**
 * Capitalize each word bound by space delimiters.
 * 
 * @param input The string to convert
 * @param options The options object
 * @param options.keepAllCaps Keep all caps sequences as-is (default: false)
 * @returns A new string with each word capitalized
 * 
 * @example
 * ```ts
 * import { string } from 'lambda-toolkit';
 * const { capitalizeWords } = string;
 * 
 * const result = capitalizeWords('snake_case bar');
 * // result: 'Snake_case Bar'
 * ```
 */
export function capitalizeWords(input: string, options?: { keepAllCaps?: boolean }): string;
