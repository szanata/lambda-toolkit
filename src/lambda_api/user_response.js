const validators = require( './validators' );
const LambdaApiValidationError = require( './lambda_api_validation_error' );
const Text = require( './text_enum' );

module.exports = class UserResponse {
  constructor( args ) {
    if ( args === undefined ) {
      this.values = [ 204 ];
    } else if ( typeof args === 'string' && args.length === 0 ) {
      this.values = [ 204 ];

    } else if ( typeof args === 'string' && args.length > 0 ) {
      this.values = [ 200, args ];

    } else if ( typeof args === 'number' ) {
      validators.statusCode( args );
      this.values = [ args ];

    } else if ( Array.isArray( args ) ) {
      validators.statusCode( args[0] );
      this.values = args;

    } else if ( args.statusCode ) {
      validators.statusCode( args.statusCode );
      this.values = [ args.statusCode, args.body, args.headers, args.isBase64Encoded ];

    } else if ( [ undefined, null ].includes( args ) ) {
      this.values = [ 200 ];
    } else {
      throw new LambdaApiValidationError( Text.INVALID_USER_RESPONSE );
    }
  }
};
