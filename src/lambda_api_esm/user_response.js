import { Validator } from './validator.js';
import { LambdaApiValidationError } from './lambda_api_validation_error.js';
import { Text } from './text_enum.js';

export class UserResponse {
  constructor( args ) {
    if ( args === undefined ) {
      this.values = [ 204 ];
    } else if ( typeof args === 'string' && args.length === 0 ) {
      this.values = [ 204 ];

    } else if ( typeof args === 'string' && args.length > 0 ) {
      this.values = [ 200, args ];

    } else if ( typeof args === 'number' ) {
      Validator.statusCode( args );
      this.values = [ args ];

    } else if ( Array.isArray( args ) ) {
      Validator.statusCode( args[0] );
      this.values = args;

    } else if ( args.statusCode ) {
      Validator.statusCode( args.statusCode );
      this.values = [ args.statusCode, args.body, args.headers, args.isBase64Encoded ];

    } else if ( [ undefined, null ].includes( args ) ) {
      this.values = [ 200 ];
    } else {
      throw new LambdaApiValidationError( Text.INVALID_USER_RESPONSE );
    }
  }
};
