import { describe, it, mock } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';

const startQueryMock = mock.fn();
const getResultsMock = mock.fn();
const parseResultsMock = mock.fn();

mock.module( './start_query.js', {
  namedExports: {
    startQuery: startQueryMock
  }
} );
mock.module( './get_results.js', {
  namedExports: {
    getResults: getResultsMock
  }
} );
mock.module( './parse_results.js', {
  namedExports: {
    parseResults: parseResultsMock
  }
} );

const { query } = await import( './index.js' );

const client = 'client';
const nativeArgs = 'nativeArgs';
const range = 'range';
const queryId = '123';
const rawResults = 'rawResults';
const finalResults = 'finalResults';

describe( 'Query Spec', () => {
  it( 'Should start the query, get the results and parse them before returning', async () => {
    startQueryMock.mock.mockImplementation( () => queryId );
    getResultsMock.mock.mockImplementation( () => rawResults );
    parseResultsMock.mock.mockImplementation( () => finalResults );

    const result = await query( client, nativeArgs, { range } );

    deepStrictEqual( result, { items: finalResults, count: finalResults.length } );
    strictEqual( startQueryMock.mock.calls.length, 1 );
    deepStrictEqual( startQueryMock.mock.calls[0].arguments[0], { client, nativeArgs, range } );
    strictEqual( getResultsMock.mock.calls.length, 1 );
    deepStrictEqual( getResultsMock.mock.calls[0].arguments[0], { client, queryId } );
    strictEqual( parseResultsMock.mock.calls.length, 1 );
    deepStrictEqual( parseResultsMock.mock.calls[0].arguments[0], rawResults );
  } );
} );
