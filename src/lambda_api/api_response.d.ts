/**
 * HTTP response builder with automatic header and content-type management.
 */
export class ApiResponse {
  constructor(options?: {
    headers?: Record<string, string>;
    transform?: 'camelcase' | 'snakecase' | false | null;
  });

  /**
   * Set the response content with status code and optional headers.
   */
  setContent(
    statusCode: number,
    body?: any,
    headers?: Record<string, string>,
    isBase64Encoded?: boolean
  ): this;

  /**
   * Convert to AWS Lambda APIGateway response format.
   */
  toJSON(): {
    isBase64Encoded: boolean;
    statusCode: number;
    body: string;
    headers: Record<string, string>;
  };
}
