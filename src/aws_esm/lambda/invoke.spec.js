import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import { strictEqual, deepStrictEqual, rejects } from 'node:assert';

const commandInstance = {};
const constructorMock = mock.fn( () => commandInstance );

mock.module( '@aws-sdk/client-lambda', {
  namedExports: {
    InvokeCommand: new Proxy( class InvokeCommand {}, {
      construct( _, args ) {
        return constructorMock( ...args );
      }
    } )
  }
} );

const lambdaErrorConstructorMock = mock.fn();

mock.module( './lambda_error.js', {
  namedExports: {
    LambdaError: new Proxy( class LambdaError {}, {
      construct( _, args ) {
        return lambdaErrorConstructorMock( ...args );
      }
    } )
  }
} );

class MockLambdaError extends Error {}

const { invoke } = await import( './invoke.js' );

const client = {
  send: mock.fn()
};

const functionName = 'my-function';
const payload = { foo: 'bar' };
const responsePayload = { foo: 'bar' };

describe( 'Lambda invoke Spec', () => {
  beforeEach( () => {
    constructorMock.mock.mockImplementation( () => commandInstance );
  } );

  afterEach( () => {
    mock.restoreAll();
    constructorMock.mock.resetCalls();
    client.send.mock.resetCalls();
  } );

  it( 'Should invoke a lambda with invocation type RequestResponse and return its result', async () => {
    client.send.mock.mockImplementation( () => ( {
      StatusCode: 200,
      ExecutedVersion: '$LATEST',
      Payload: Uint8Array.from( Buffer.from( JSON.stringify( responsePayload ) ) )
    } ) );

    const result = await invoke( client, functionName, payload, 'RequestResponse' );

    deepStrictEqual( result, responsePayload );
    strictEqual( client.send.mock.calls.length, 1 );
    deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
      InvocationType: 'RequestResponse',
      FunctionName: functionName,
      Payload: Buffer.from( JSON.stringify( payload ) )
    } );
  } );

  it( 'Should invoke a lambda with invocation type Event', async () => {
    client.send.mock.mockImplementation( () => ( {
      StatusCode: 200,
      ExecutedVersion: '$LATEST'
    } ) );

    const result = await invoke( client, functionName, payload, 'Event' );

    strictEqual( result, true );
    strictEqual( client.send.mock.calls.length, 1 );
    deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
      InvocationType: 'Event',
      FunctionName: functionName,
      Payload: Buffer.from( JSON.stringify( payload ) )
    } );
  } );

  describe( 'Error handling', () => {
    beforeEach( () => {
      lambdaErrorConstructorMock.mock.mockImplementation( () => new MockLambdaError() );
    } );

    afterEach( () => {
      lambdaErrorConstructorMock.mock.resetCalls();
    } );

    it( 'Should throw errors', async () => {
      const error = new Error( 'SyntaxError' );

      client.send.mock.mockImplementation( () => { throw error; } );

      await rejects( invoke( client, functionName, {} ), error );
    } );

    it( 'Should parse errors from response and them throw them as "LambdaError"', async () => {
      const response = {
        StatusCode: 500,
        ExecutedVersion: '$LATEST',
        FunctionError: 'Unhandled',
        Payload: 'ServiceException'
      };

      client.send.mock.mockImplementation( () => response );

      await rejects( invoke( client, functionName, {} ), MockLambdaError );
      strictEqual( lambdaErrorConstructorMock.mock.calls.length, 1 );
      deepStrictEqual( lambdaErrorConstructorMock.mock.calls[0].arguments[0], response );
    } );
  } );
} );
