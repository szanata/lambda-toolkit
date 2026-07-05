import { InvokeCommandOutput } from '@aws-sdk/client-lambda';

/**
 * Error thrown when a Lambda function execution fails.
 * Provides detailed information about the failure including status code and error details.
 */
export class LambdaError extends Error {
  /**
   * HTTP status code from the Lambda invocation response.
   */
  statusCode: number;

  /**
   * The error type returned by the Lambda function (e.g., 'TypeError', 'ReferenceError').
   */
  lambdaErrorType: string;

  /**
   * The error message returned by the Lambda function.
   */
  lambdaErrorMessage?: string;

  constructor(response: InvokeCommandOutput);
}
