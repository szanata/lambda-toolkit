/**
 * Get the value of an SSM Parameter.
 * 
 * Values are cached to avoid repeated calls in warm Lambda invocations.
 * Returns null if the parameter does not exist.
 * 
 * @param name The name of the SSM Parameter
 * @returns The decrypted parameter value, or null if not found
 * 
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { ssm } = aws;
 * 
 * const apiKey = await ssm.get('my-api-key');
 * const dbPassword = await ssm.get('database-password');
 * ```
 */
export function get(name: string): Promise<string | null>;
