const { camelize, snakelize } = require( '../object' );

const transformFns = {
  camelcase: camelize,
  snakecase: snakelize
};

const parseJson = content => {
  try {
    return JSON.parse( content );
  } catch {
    return content;
  }
};

module.exports = class Event {
  #transformFn;
  #authorizer;
  #body;
  #headers;
  #method;
  #params;
  #path;
  #queryString;
  #route;

  context = {};

  constructor( { transform = false } = {} ) {
    this.#transformFn = transformFns[transform] ?? ( v => v );
  }

  parseFromAwsEvent( awsEvent ) {
    this[`parseFromAwsEventV${awsEvent.version === '2.0' ? 2 : 1}`]( awsEvent );
  }

  parseFromAwsEventV1( awsEvent ) {
    const {
      body,
      path,
      resource,
      httpMethod,
      requestContext,
      pathParameters,
      headers,
      multiValueHeaders,
      queryStringParameters,
      multiValueQueryStringParameters
    } = awsEvent;

    const unifiedHeaders = {
      headers,
      ...Object.fromEntries( Object.entries( multiValueHeaders ).map( ( [ k, v ] ) => [ k, Array.isArray( v ) ? v.join( ',' ) : k ] ) )
    };

    const unifiedQueryString = {
      queryStringParameters,
      ...Object.fromEntries( Object.entries( multiValueQueryStringParameters ).map( ( [ k, v ] ) => [ k, Array.isArray( v ) ? v.join( ',' ) : k ] ) )
    };

    this.#authorizer = requestContext.authorizer;
    this.#body = body ? this.#transformFn( parseJson( body ) ) : null;
    this.#headers = unifiedHeaders;
    this.#method = httpMethod;
    this.#params = this.#transformFn( pathParameters );
    this.#path = path;
    this.#queryString = this.#transformFn( unifiedQueryString );
    this.#route = resource;
  }

  parseFromAwsEventV2( awsEvent ) {
    const {
      body,
      routeKey,
      requestContext,
      pathParameters,
      headers,
      queryStringParameters
    } = awsEvent;

    const { http: { method, path } } = requestContext;

    this.#authorizer = requestContext.authorizer;
    this.#body = body ? this.#transformFn( parseJson( body ) ) : null;
    this.#headers = headers;
    this.#method = method;
    this.#params = this.#transformFn( pathParameters );
    this.#path = path;
    this.#queryString = this.#transformFn( queryStringParameters );
    this.#route = routeKey?.split( ' ' )[1];
  }

  // These are read only
  get authorizer() { return this.#authorizer; }
  get body() { return this.#body; }
  get headers() { return this.#headers; }
  get method() { return this.#method; }
  get params() { return this.#params; }
  get path() { return this.#path; }
  get queryString() { return this.#queryString; }
  get route() { return this.#route; }
};
