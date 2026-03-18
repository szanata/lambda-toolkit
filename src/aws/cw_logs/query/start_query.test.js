import { describe, it, mock, beforeEach } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';

const commandInstance = {};
const constructorMock = mock.fn( () => commandInstance );

mock.module( '@aws-sdk/client-cloudwatch-logs', {
  namedExports: {
    StartQueryCommand: new Proxy( class StartQueryCommand {}, {
      construct( _, args ) {
        return constructorMock( ...args );
      }
    } )
  }
} );

mock.module( './polling_delay.js', {
  namedExports: {
    pollingDelay: 1000
  }
} );

const { startQuery } = await import( './start_query.js' );

const client = {
  send: mock.fn()
};

const queryId = '123';

const fullNativeArgs = {
  startTime: Math.trunc( new Date( '2025-03-22T00:00:00.000Z' ).getTime() / 1000 ),
  endTime: Math.trunc( new Date( '2025-03-22T23:59:00.000Z' ).getTime() / 1000 ),
  logGroupName: '/aws/lambda/foo-bar',
  queryLanguage: 'CWLI',
  queryString: 'fields @timestamp, event_type | filter ispresent(event_type)'
};

const from = new Date( '2025-03-22T05:00:00.000Z' ).getTime();
const to = new Date( '2025-03-22T10:00:00.000Z' ).getTime();

describe( 'Start Query Spec', () => {
  beforeEach( () => {
    mock.restoreAll();
    client.send.mock.resetCalls();
    constructorMock.mock.resetCalls();
  } );

  it( 'Should send out all native arguments to the StartQueryCommand', async () => {
    client.send.mock.mockImplementation( () => ( { queryId } ) );
    const result = await startQuery( { client, nativeArgs: fullNativeArgs } );

    strictEqual( result, queryId );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], fullNativeArgs );
  } );

  it( 'Should allow range.from to overwrite startTime, if present', async () => {
    client.send.mock.mockImplementation( () => ( { queryId } ) );
    const result = await startQuery( { client, nativeArgs: { ...fullNativeArgs }, range: { from } } );

    strictEqual( result, queryId );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
      ...fullNativeArgs,
      startTime: Math.trunc( from / 1000 )
    } );
  } );

  it( 'Should allow range.to to overwrite endTime, if present', async () => {
    client.send.mock.mockImplementation( () => ( { queryId } ) );
    const result = await startQuery( { client, nativeArgs: { ...fullNativeArgs }, range: { to } } );

    strictEqual( result, queryId );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
      ...fullNativeArgs,
      endTime: Math.trunc( to / 1000 )
    } );
  } );
} );
