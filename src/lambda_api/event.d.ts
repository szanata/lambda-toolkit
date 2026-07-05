/**
 * Parsed HTTP request event from AWS ApiGateway.
 * Supports both APIGateway v1 and v2 formats.
 * All properties are populated after calling parseFromAwsEvent().
 */
export class Event {
  /** Authorizer context from API Gateway (varies by authorizer type) */
  authorizer?: Record<string, any>;
  /** Request body (JSON or string) */
  body: any;
  /** Raw body string before parsing */
  rawBody: string | null;
  /** HTTP headers */
  headers: Record<string, string>;
  /** HTTP method (GET, POST, etc.) */
  method: string;
  /** Path parameters */
  params: Record<string, any>;
  /** Resource path */
  path: string;
  /** Query string parameters */
  queryString: Record<string, any>;
  /** Route path */
  route: string;
  /** Lambda context object */
  context: Record<string, any>;
  /** Whether body is base64 encoded */
  isBase64Encoded: boolean;

  constructor(options?: { transform?: 'camelcase' | 'snakecase' | false | null });

  /**
   * Parse an AWS ApiGateway event (v1 or v2).
   * Automatically detects version.
   * @param awsEvent APIGateway v1 or v2 event
   */
  parseFromAwsEvent(awsEvent: Record<string, any>): void;
}
