/**
 * Static validation utilities for LambdaApi arguments.
 * Throws LambdaApiValidationError if validation fails.
 */
export const Validator: {
  errorType(value: any): void;
  function(value: any): void;
  httpMethod(value: any): void;
  matcherPath(value: any): void;
  matcherPathIncludes(value: any): void;
  matcherPathMatches(value: any): void;
  matcherPathNotIncludes(value: any): void;
  matcherRoute(value: any): void;
  matcherRouteIncludes(value: any): void;
  matcherRouteMatches(value: any): void;
  matcherRouteNotIncludes(value: any): void;
  statusCode(value: any): void;
  transformRequest(value: any): void;
  transformResponse(value: any): void;
};
