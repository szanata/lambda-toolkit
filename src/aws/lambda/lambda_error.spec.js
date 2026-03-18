import { describe, it } from 'node:test';
import { strictEqual, throws } from 'node:assert';
import { LambdaError } from './lambda_error.js';

describe( 'LambdaError spec', () => {
  it( 'Should parse an error threw by the function', () => {
    const response = {
      StatusCode: 200,
      FunctionError: 'Unhandled',
      ExecutedVersion: '$LATEST',
      Payload: Uint8Array.from( Buffer.from( JSON.stringify( {
        errorType: 'SomeErrorType',
        errorMessage: 'Something went very wrong',
        stack: '...'
      } ) ) )
    };

    const error = new LambdaError( response );

    throws( () => { throw error; }, {
      statusCode: 200,
      lambdaErrorMessage: 'Something went very wrong',
      lambdaErrorType: 'SomeErrorType'
    } );
    strictEqual( error.message, 'Invoked function threw "[SomeErrorType] Something went very wrong"' );
  } );

  it( 'Should parse errors generated during the invocation itself', async () => {
    const response = {
      StatusCode: 500,
      ExecutedVersion: '$LATEST',
      FunctionError: 'Unhandled',
      Payload: 'ServiceException'
    };

    const error = new LambdaError( response );

    throws( () => { throw error; }, {
      statusCode: 500,
      lambdaErrorMessage: undefined,
      lambdaErrorType: 'Error'
    } );
    strictEqual( error.message, 'Error invoking the function' );
  } );

  it( 'Should parse a timeout error from the lambda', async () => {
    const response = {
      StatusCode: 200,
      FunctionError: 'Unhandled',
      ExecutedVersion: '$LATEST',
      Payload: '{"errorMessage":"RequestId: xxx Process exited before completing request"}'
    };

    const error = new LambdaError( response );

    throws( () => { throw error; }, {
      statusCode: 200,
      lambdaErrorMessage: 'RequestId: xxx Process exited before completing request',
      lambdaErrorType: 'Error'
    } );
    strictEqual( error.message, 'Invoked function threw "[Error] RequestId: xxx Process exited before completing request"' );
  } );
} );
