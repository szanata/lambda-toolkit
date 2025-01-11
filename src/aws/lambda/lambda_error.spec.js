const LambdaError = require( './lambda_error' );

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

    expect( error ).toMatchObject( {
      statusCode: 200,
      lambdaErrorMessage: "Something went very wrong",
      lambdaErrorType: "SomeErrorType"
    } );
    expect( error.message ).toBe( 'Invoked function threw "[SomeErrorType] Something went very wrong"' );
  } );

  it( 'Should parse errors generated during the invocation itself', async () => {
    const response = {
      StatusCode: 500,
      ExecutedVersion: '$LATEST',
      FunctionError: 'Unhandled',
      Payload: 'ServiceException'
    };

    const error = new LambdaError( response );

    expect( error ).toMatchObject( {
      statusCode: 500,
      lambdaErrorMessage: undefined,
      lambdaErrorType: "Error"
    } );
    expect( error.message ).toBe( 'Error invoking the function' );
  } );

  it( 'Should parse a timeout error from the lambda', async () => {
    const response = {
      StatusCode: 200,
      FunctionError: 'Unhandled',
      ExecutedVersion: '$LATEST',
      Payload: '{"errorMessage":"RequestId: xxx Process exited before completing request"}'
    };

    const error = new LambdaError( response );

    expect( error ).toMatchObject( {
      statusCode: 200,
      lambdaErrorMessage: "RequestId: xxx Process exited before completing request",
      lambdaErrorType: "Error"
    } );
    expect( error.message ).toBe( 'Invoked function threw "[Error] RequestId: xxx Process exited before completing request"' );
  } );
} );
