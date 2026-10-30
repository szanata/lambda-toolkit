type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';
type TransformFunction = 'camelcase' | 'snakecase' | false | null;

/**
 * Parsed HTTP request event passed to handlers.
 * Created by LambdaApi from raw AWS ApiGateway event.
 */
export interface LambdaApiEvent<TBody = any> {
  /** HTTP method (GET, POST, etc.) */
  method: string;
  /** Resource route */
  route: string;
  /** Resource path */
  path: string;
  /** Request headers */
  headers: Record<string, string>;
  /** Route parameters */
  params: Record<string, any>;
  /** Query string parameters */
  queryString: Record<string, any>;
  /** Request body (JSON parsed or string) */
  body: TBody;
  /** Raw body before parsing */
  rawBody: string | null;
  /** Whether body is base64 encoded */
  isBase64Encoded: boolean;
  /** Authorizer context from API Gateway */
  authorizer?: Record<string, any>;
  /** Lambda context object */
  context: Record<string, any>;
}

/**
 * Valid handler return values.
 * Maps to HTTP responses with status code, body, headers, and encoding.
 */
export type HandlerResponse =
  | undefined
  | null
  | string
  | number
  | [statusCode: number, body?: unknown, headers?: Record<string, string>, isBase64Encoded?: boolean]
  | { statusCode: number; body?: unknown; headers?: Record<string, string>; isBase64Encoded?: boolean };

type HandlerFunction<TBody = any> = (event: LambdaApiEvent<TBody>) => HandlerResponse | Promise<HandlerResponse>;
type HookFunction = (event: LambdaApiEvent) => Promise<void> | void;

/**
 * API abstraction for AWS Lambda + ApiGateway.
 * Simplifies handling multiple routes and request methods with a single Lambda function.
 * 
 * @example
 * ```ts
 * import { LambdaApi } from 'lambda-toolkit';
 * 
 * const api = new LambdaApi();
 * api.addHandler({ method: 'GET', route: '/users', fn: (event) => ({ users: [] }) });
 * 
 * export const handler = (event: any) => api.process(event);
 * ```
 */
export class LambdaApi {
  /**
   * Create a new LambdaApi instance.
   * 
   * @param headers HTTP headers to include in all responses
   * @param transformRequest Transform request body and params to camelCase or snake_case
   * @param transformResponse Transform response body to camelCase or snake_case
   */
  constructor(options?: {
    headers?: Record<string, string>;
    transformRequest?: TransformFunction;
    transformResponse?: TransformFunction;
  });

  /**
   * Register an HTTP request handler.
   * Handlers are matched in order; first match wins.
   * 
   * Note: Use either exclusive conditions (route/path) OR combinative conditions,
   * not both. If route/path is present, other conditions are ignored.
   * 
   * @param method HTTP method (GET, POST, PUT, PATCH, DELETE, HEAD)
   * @param fn Handler function that processes the request
   * @param route Exact route to match (exclusive with path)
   * @param path Exact path to match (exclusive with route)
   * @param routeIncludes Route must include this string (combinative)
   * @param routeNotIncludes Route must not include this string (combinative)
   * @param routeMatches Route must match this RegExp (combinative)
   * @param pathIncludes Path must include this string (combinative)
   * @param pathNotIncludes Path must not include this string (combinative)
   * @param pathMatches Path must match this RegExp (combinative)
   */
  addHandler<TBody = any>(options: {
    method: HttpMethod;
    fn: HandlerFunction<TBody>;
    route?: string;
    path?: string;
    routeIncludes?: string;
    routeNotIncludes?: string;
    routeMatches?: RegExp;
    pathIncludes?: string;
    pathNotIncludes?: string;
    pathMatches?: RegExp;
  }): void;

  /**
   * Register a hook to run before the matching handler (only if handler matches).
   */
  addBeforeHook(options: { fn: HookFunction }): void;

  /**
   * Register a hook to run after the matching handler (only if handler matches).
   */
  addAfterHook(options: { fn: HookFunction }): void;

  /**
   * Register an error handler for a specific error type.
   * If a handler throws an error of this type, the response will use the specified code.
   * errorType can be any constructor that can be used with instanceof.
   */
  addErrorHandler(options: {
    errorType: new (...args: any[]) => any;
    code: number;
    message?: string;
  }): void;

  /**
   * Process an AWS ApiGateway event and return a formatted HTTP response.
   * Handles HEAD requests automatically (returns 204).
   * Returns 405 if no handler matches.
   * Returns 500 if handler throws an unmapped error.
   */
  process(awsEvent: any): Promise<{
    isBase64Encoded: boolean;
    statusCode: number;
    body: string;
    headers: Record<string, string>;
  }>;
}
