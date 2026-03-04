import { describe, it, afterEach, mock } from 'node:test';
import { deepStrictEqual, partialDeepStrictEqual, ok } from 'node:assert';

const startQuery = mock.fn();
const getResults = mock.fn();

mock.module( './lib/start_query.js', {
  namedExports: {
    startQuery
  }
} );
mock.module( './lib/get_results.js', {
  namedExports: {
    getResults
  }
} );

const commandInstance = {};
const constructor = mock.fn( () => commandInstance );

const { query } = await import( './query.js' );

const client = { send: mock.fn() };
const queryExecutionId = 'query-execution-id';
const nativeQueryArgs = 'native-query-args';
const items = 'items';

describe( 'Query Athena Spec', () => {
  afterEach( () => {
    mock.reset();
    constructor.mock.resetCalls();
    client.send.mock.resetCalls();
    startQuery.mock.resetCalls();
    getResults.mock.resetCalls();
  } );

  it( 'Should start a new recursive query, get the results and return them serialized', async () => {
    startQuery.mock.mockImplementation( () => queryExecutionId );
    getResults.mock.mockImplementation( () => ( { items } ) );

    const result = await query( client, nativeQueryArgs, { recursive: true, maxResults: 100 } );

    partialDeepStrictEqual( result, { items } );
    deepStrictEqual( startQuery.mock.calls[0].arguments[0], { client, ...nativeQueryArgs } );
    partialDeepStrictEqual( getResults.mock.calls[0].arguments[0], { client, queryExecutionId, recursive: true, maxResults: 100 } );
  } );

  it( 'Should use the provided paginationToken to continue the query', async () => {
    const nextToken = 'very-next-token';
    const token = 'previous-token';
    const paginationToken = 'eyJxdWVyeUV4ZWN1dGlvbklkIjoicXVlcnktZXhlY3V0aW9uLWlkIiwidG9rZW4iOiJwcmV2aW91cy10b2tlbiJ9';

    getResults.mock.mockImplementation( () => ( { items, nextToken } ) );

    const result = await query( client, nativeQueryArgs, { paginationToken } );

    const nextPaginationToken = 'eyJxdWVyeUV4ZWN1dGlvbklkIjoicXVlcnktZXhlY3V0aW9uLWlkIiwidG9rZW4iOiJ2ZXJ5LW5leHQtdG9rZW4ifQ==';
    deepStrictEqual( result, { items, paginationToken: nextPaginationToken } );
    partialDeepStrictEqual( getResults.mock.calls[0].arguments[0], { client, queryExecutionId, token, recursive: false } );
    ok( startQuery.mock.calls.length === 0 );
  } );
} );
