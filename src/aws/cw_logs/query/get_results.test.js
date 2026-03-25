import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import { strictEqual, deepStrictEqual, rejects } from 'node:assert';

const commandInstance = {};
const constructorMock = mock.fn( () => commandInstance );

mock.module( '@aws-sdk/client-cloudwatch-logs', {
  namedExports: {
    GetQueryResultsCommand: new Proxy( class GetQueryResultsCommand {}, {
      construct( _, args ) {
        return constructorMock( ...args );
      }
    } )
  }
} );

mock.module( './polling_delay.js', {
  namedExports: {
    pollingDelay: 50
  }
} );

const { getResults } = await import( './get_results.js' );

const client = {
  send: mock.fn()
};

const queryId = '123';

const queryResults = [
  [
    {
      field: 'foo',
      value: 'bar'
    }
  ]
];

describe( 'Get Results Spec', () => {
  beforeEach( () => {
    mock.restoreAll();
    client.send.mock.resetCalls();
    constructorMock.mock.resetCalls();
  } );
  afterEach( () => {
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], { queryId } );
  } );

  describe( 'Errors', () => {
    afterEach( () => {
      strictEqual( client.send.mock.calls.length, 1 );
      deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
    } );

    it( 'Should throw error if the status is Cancelled', async () => {
      client.send.mock.mockImplementation( () => ( { results: [], status: 'Cancelled' } ) );
      await rejects( getResults( { client, queryId } ), new Error( 'Query status is "Cancelled"' ) );
    } );

    it( 'Should throw error if the status is Failed', async () => {
      client.send.mock.mockImplementation( () => ( { results: [], status: 'Failed' } ) );
      await rejects( getResults( { client, queryId } ), new Error( 'Query status is "Failed"' ) );
    } );

    it( 'Should throw error if the status is Timeout', async () => {
      client.send.mock.mockImplementation( () => ( { results: [], status: 'Timeout' } ) );
      await rejects( getResults( { client, queryId } ), new Error( 'Query status is "Timeout"' ) );
    } );

    it( 'Should throw error if the status is Unknown', async () => {
      client.send.mock.mockImplementation( () => ( { results: [], status: 'Unknown' } ) );
      await rejects( getResults( { client, queryId } ), new Error( 'Query status is "Unknown"' ) );
    } );
  } );

  describe( 'Recursiveness', () => {
    it( 'Should keep sending "GetResultsCommand" to client until the status is "Complete", then return the results', async () => {
      client.send.mock.mockImplementationOnce( () => ( { results: [], status: 'Scheduled' } ), 0 );
      client.send.mock.mockImplementationOnce( () => ( { results: [], status: 'Running' } ), 1 );
      client.send.mock.mockImplementationOnce( () => ( { results: queryResults, status: 'Complete' } ), 2 );

      const results = await getResults( { client, queryId } );

      deepStrictEqual( results, queryResults );
      strictEqual( client.send.mock.calls.length, 3 );
      deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
      deepStrictEqual( client.send.mock.calls[1].arguments[0], commandInstance );
      deepStrictEqual( client.send.mock.calls[2].arguments[0], commandInstance );
    } );
  } );
} );
