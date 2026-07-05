import { LambdaError } from './lambda_error.js';

export type { LambdaError };

/**
 * Invoke a Lambda function asynchronously (Event or DryRun).
 *
 * @param name Function name or ARN
 * @param payload Function input payload
 * @param type Invocation type ('Event' or 'DryRun')
 * @returns Always returns true for async invocations
 * @throws LambdaError if the function execution fails
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { lambda } = aws;
 *
 * // Asynchronous invocation (returns immediately)
 * await lambda.invoke('my-function', { id: 123 }, 'Event');
 *
 * // Dry run (validates without executing)
 * await lambda.invoke('my-function', { id: 123 }, 'DryRun');
 * ```
 */
export function invoke(
  name: string,
  payload?: Record<string, any>,
  type: 'Event' | 'DryRun'
): Promise<true>;

/**
 * Invoke a Lambda function synchronously (RequestResponse).
 *
 * @param name Function name or ARN
 * @param payload Function input payload
 * @param type Invocation type (default: 'RequestResponse')
 * @returns Parsed JSON response from the function, or Uint8Array if unparseable
 * @throws LambdaError if the function execution fails
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { lambda } = aws;
 *
 * // Synchronous invocation (waits for response)
 * const result = await lambda.invoke('my-function', { id: 123 });
 * console.log(result);
 *
 * // With explicit RequestResponse type
 * const result2 = await lambda.invoke('my-function', { id: 123 }, 'RequestResponse');
 * ```
 */
export function invoke(
  name: string,
  payload?: Record<string, any>,
  type?: 'RequestResponse'
): Promise<Record<string, any> | Uint8Array>;
