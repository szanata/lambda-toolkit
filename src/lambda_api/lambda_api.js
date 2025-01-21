const validators = require( './validators' );
const ApiResponse = require( './api_response' );
const Event = require( './event' );
const Handler = require( './handler' );
const Hook = require( './hook' );
const UserResponse = require( './user_response' );
const Text = require( './text_enum' );

module.exports = class LambdaApi {
  #apiResponse = null;
  #handlers = [];
  #errorResponses = [];
  #beforeHooks = [];
  #afterHooks = [];
  #transformRequest = [];

  /**
   * Creates a new Lambda Api
   *
   * @param {Object} headers Any headers you want to be included in all responses
   */
  constructor( { headers = {}, transformRequest = false, transformResponse = false } = {} ) {
    validators.transformRequest( transformRequest );
    validators.transformResponse( transformResponse );

    this.#transformRequest = transformRequest;
    this.#apiResponse = new ApiResponse( { headers, transform: transformResponse } );
  }

  /**
   * Register a function that will run before the matching route (only if matches)
   *
   * @param {Object} args
   * @param {function} args.fn A function
   */
  addBeforeHook( { fn } = {} ) {
    this.#beforeHooks.push( new Hook( { fn } ) );
  }

  /**
   * Register a function that will run after the matching route (only if matches)
   *
   * @param {Object} args
   * @param {function} args.fn A function
   */
  addAfterHook( { fn } = {} ) {
    this.#afterHooks.push( new Hook( { fn } ) );
  }

  /**
   * Register a handler for a given request method and optionally a path
   *
   * @param {Object} args
   * @param {string} args.method The method to match this handler
   * @param {function} args.fn The handler function
   * @param {string} [args.route] A route to match this handler
   * @param {string} [args.routeIncludes] A part of the route to match this handler
   * @param {string} [args.routeNotIncludes] A part of the route to not match this handler
   * @param {RegExp} [args.routeMatches] A RegExp to match the route
   * @param {string} [args.path] A path to match this handler
   * @param {string} [args.pathIncludes] A part of the path to match this handler
   * @param {string} [args.pathNotIncludes] A part of the path to not match this handler
   * @param {RegExp} [args.pathMatches] A RegExp to match the path
   */
  addHandler( { method, fn, ...matchers } = {} ) {
    this.#handlers.push( new Handler( { method, fn, ...matchers } ) );
  }

  /**
   * Register an automatic error code response for given error class (constructor name)
   *
   * @param {Object} args
   * @param {string} args.code The HTTP status code to return
   * @param {class} args.errorType The error class
   * @param {string} [args.message=null] Optional message to return for the status code, if not present will default to Error.message
   * @param {message} [args.errorType] And optional message to display
   */
  addErrorHandler( { errorType, code, message = null } = {} ) {
    validators.statusCode( code );
    validators.errorType( errorType );
    this.#errorResponses.push( { errorType, code, message } );
  }

  /**
   * Init the flow using a given AWS Lambda APIGateway event (v2 syntax)
   *
   * @param {Object} ApiGatewayPayload The raw API Gateway event
   * @returns {Object} The http response with status, body and headers
   */
  async process( awsEvent ) {
    const event = new Event( { transform: this.#transformRequest } );
    event.parseFromAwsEvent( awsEvent );

    if ( event.method === 'HEAD' ) {
      return this.#apiResponse.setContent( 204 ).toJSON();
    }

    const handler = this.#handlers.find( h => h.match( event ) );
    if ( !handler ) {
      return this.#apiResponse.setContent( 405, Text.ERROR_405 ).toJSON();
    }

    const chain = [
      ...this.#beforeHooks.map( b => b.fn ),
      async ev => {
        const result = await handler.fn( ev );
        const response = new UserResponse( result );
        this.#apiResponse.setContent( ...response.values ).toJSON();
      },
      ...this.#afterHooks.map( a => a.fn )
    ];

    try {
      for ( const fn of chain ) {
        await fn( event );
      }
      return this.#apiResponse.toJSON();

    } catch ( error ) {
      console.error( 'Lambda API Error', { error, event } );

      const response = this.#errorResponses.find( e => error instanceof e.errorType );
      if ( response ) {
        return this.#apiResponse.setContent( response.code, response.message ?? error.message ).toJSON();
      }
      return this.#apiResponse.setContent( 500, Text.ERROR_500 ).toJSON();
    }
  }
};
