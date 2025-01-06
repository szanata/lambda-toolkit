const Text = require( './text_enum' );
const LambdaApiValidationError = require( './lambda_api_validation_error' );

const evaluate = ( condition, errorMessage ) => {
  if ( !condition ) { throw new LambdaApiValidationError( errorMessage ); }
};

const isConstructor = v => {
  try {
    return !!Reflect.construct( new Proxy( v, {} ), [] );
  } catch {
    return false;
  }
};

module.exports = {
  errorType: v => evaluate( isConstructor( v ), Text.INVALID_ERROR_TYPE ),
  function: v => evaluate( typeof v === 'function', Text.INVALID_FN ),
  httpMethod: v => evaluate( [ 'DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT' ].includes( v ), Text.INVALID_METHOD ),
  matcherPath: v => evaluate( v === undefined || ( typeof v === 'string' && v.length > 0 ), Text.INVALID_MATCHER_PATH ),
  matcherPathIncludes: v => evaluate( v === undefined || ( typeof v === 'string' && v.length > 0 ), Text.INVALID_MATCHER_PATH_INCLUDES ),
  matcherPathMatch: v => evaluate( v === undefined || v?.constructor?.name === RegExp.name, Text.INVALID_MATCHER_PATH_MATCH ),
  matcherPathNotIncludes: v => evaluate( v === undefined || ( typeof v === 'string' && v.length > 0 ), Text.INVALID_MATCHER_PATH_NOT_INCLUDES ),
  matcherRoute: v => evaluate( v === undefined || ( typeof v === 'string' && v.length > 0 ), Text.INVALID_MATCHER_ROUTE ),
  matcherRouteIncludes: v => evaluate( v === undefined || ( typeof v === 'string' && v.length > 0 ), Text.INVALID_MATCHER_ROUTE_INCLUDES ),
  matcherRouteMatch: v => evaluate( v === undefined || v?.constructor?.name === RegExp.name, Text.INVALID_MATCHER_ROUTE_MATCH ),
  matcherRouteNotIncludes: v => evaluate( v === undefined || ( typeof v === 'string' && v.length > 0 ), Text.INVALID_MATCHER_ROUTE_NOT_INCLUDES ),
  statusCode: v => evaluate( typeof v === 'number' && /^[1-5]\d\d$/.test( String( v ) ), Text.INVALID_STATUS_CODE ),
  transformRequest: v => evaluate( [ 'camelcase', 'snakecase', null, false ].includes( v ), Text.INVALID_TRANSFORM_REQUEST ),
  transformResponse: v => evaluate( [ 'camelcase', 'snakecase', null, false ].includes( v ), Text.INVALID_TRANSFORM_RESPONSE )
};
