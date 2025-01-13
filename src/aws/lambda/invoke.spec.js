const invoke = require( './invoke' );
const { InvokeCommand } = require( '@aws-sdk/client-lambda' );
const LambdaError = require( './lambda_error' );

class MockLambdaError extends Error {}

jest.mock( '@aws-sdk/client-lambda', () => ( {
  InvokeCommand: jest.fn()
} ) );

jest.mock( './lambda_error', () => jest.fn() );

const client = {
  send: jest.fn()
};

const functionName = 'my-function';
const payload = { foo: 'bar' };
const commandInstance = jest.fn();

const responsePayload = { foo: 'bar' };

describe( 'Lambda invoke Spec', () => {
  beforeEach( () => {
    InvokeCommand.mockReturnValue( commandInstance );
  } );

  afterEach( () => {
    InvokeCommand.mockReset();
    client.send.mockReset();
  } );

  it( 'Should invoke a lambda with invocation type RequestResponse and return its result', async () => {
    client.send.mockResolvedValue( {
      StatusCode: 200,
      ExecutedVersion: '$LATEST',
      Payload: Uint8Array.from( Buffer.from( JSON.stringify( responsePayload ) ) )
    } );

    const result = await invoke( client, functionName, payload, 'RequestResponse' );

    expect( result ).toEqual( responsePayload );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
    expect( InvokeCommand ).toHaveBeenCalledWith( {
      InvocationType: 'RequestResponse',
      FunctionName: functionName,
      Payload: Buffer.from( JSON.stringify( payload ) )
    } );
  } );

  it( 'Should invoke a lambda with invocation type Event', async () => {
    client.send.mockResolvedValue( {
      StatusCode: 200,
      ExecutedVersion: '$LATEST'
    } );

    const result = await invoke( client, functionName, payload, 'Event' );

    expect( result ).toEqual( true );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
    expect( InvokeCommand ).toHaveBeenCalledWith( {
      InvocationType: 'Event',
      FunctionName: functionName,
      Payload: Buffer.from( JSON.stringify( payload ) )
    } );
  } );

  describe( 'Error handling', () => {
    beforeEach( () => {
      LambdaError.mockReturnValue( new MockLambdaError() );
    } );

    afterEach( () => {
      LambdaError.mockReset();
    } );

    it( 'Should throw errors', async () => {
      const error = new Error( 'SyntaxError' );

      client.send.mockRejectedValue( error );

      await expect( invoke( client, functionName, {} ) ).rejects.toThrow( error );
    } );

    it( 'Should parse errors from response and them throw them as "LambdaError"', async () => {
      const response = {
        StatusCode: 500,
        ExecutedVersion: '$LATEST',
        FunctionError: 'Unhandled',
        Payload: 'ServiceException'
      };

      client.send.mockResolvedValue( response );

      await expect( invoke( client, functionName, {} ) ).rejects.toThrow( MockLambdaError );
      expect( LambdaError ).toHaveBeenCalledWith( response );
    } );
  } );
} );
