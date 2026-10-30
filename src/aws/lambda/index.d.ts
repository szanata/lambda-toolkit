import { LambdaClient, LambdaClientConfig } from '@aws-sdk/client-lambda';
import { invoke } from './invoke.js';
export { LambdaError } from './lambda_error.js';

/**
 * Lambda: Invoke Lambda functions synchronously or asynchronously.
 */
export interface Lambda {
  /**
   * Invoke a Lambda function.
   */
  invoke: typeof invoke;

  /**
   * Access the underlying Lambda client for advanced usage.
   */
  getClient(): LambdaClient;

  /**
   * Create a new Lambda instance with custom client configuration.
   */
  (config?: LambdaClientConfig): Lambda;
}

/**
 * Lambda: Invoke Lambda functions synchronously or asynchronously.
 */
export const lambda: Lambda;
