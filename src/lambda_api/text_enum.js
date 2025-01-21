module.exports = {
  ERROR_500: 'Internal Server Error',
  ERROR_405: 'Method Not Allowed',
  INVALID_ERROR_TYPE: 'Argument "errorType" must be a constructor Function',
  INVALID_FN: 'Argument "fn" must be of type function',
  INVALID_METHOD: 'Argument "method" must be one of the default HTTP methods',
  INVALID_STATUS_CODE: 'Argument "statusCode" must be valid HTTP Status Code',
  INVALID_TRANSFORM_REQUEST: 'Argument "transformRequest" must be either "camelize", "snakelize", false or null',
  INVALID_TRANSFORM_RESPONSE: 'Argument "transformResponse" must be either "camelize", "snakelize", false or null',
  INVALID_MATCHER_ROUTE: 'Argument "route" must be either undefined or an string with length greater than 0',
  INVALID_MATCHER_ROUTE_INCLUDES: 'Argument "routeIncludes" must be either undefined or an string with length greater than 0',
  INVALID_MATCHER_ROUTE_NOT_INCLUDES: 'Argument "routeNotIncludes" must be either undefined or an string with length greater than 0',
  INVALID_MATCHER_ROUTE_MATCH: 'Argument "routeMatch" must be either undefined or type RegExp',
  INVALID_MATCHER_PATH: 'Argument "path" must be either undefined or an string with length greater than 0',
  INVALID_MATCHER_PATH_INCLUDES: 'Argument "pathIncludes" must be either undefined or an string with length greater than 0',
  INVALID_MATCHER_PATH_NOT_INCLUDES: 'Argument "pathNotIncludes" must be either undefined or an string with length greater than 0',
  INVALID_MATCHER_PATH_MATCH: 'Argument "pathMatch" must be either undefined or type RegExp',
  INVALID_USER_RESPONSE: 'Function return must be a number, a string, an array (where p=0 is a number) or an object (where .statusCode is a number)'
};
