import { describe, it, afterEach, beforeEach, mock } from 'node:test';
import { deepStrictEqual, rejects, strictEqual } from 'node:assert';

const instance = {};
const getQueryExecutionCommand = mock.fn( () => instance );
const getQueryResultsCommand = mock.fn( () => instance );

const parseResults = mock.fn();

mock.module( './parse_results.js', {
  namedExports: {
    parseResults
  }
} );
mock.module( './polling_delay.js', {
  namedExports: {
    pollingDelay: 10
  }
} );

mock.module( '@aws-sdk/client-athena', {
  namedExports: {
    GetQueryExecutionCommand: new Proxy( class GetQueryExecutionCommand {}, {
      construct( _, args ) {
        return getQueryExecutionCommand( ...args );
      }
    } ),

    GetQueryResultsCommand: new Proxy( class GetQueryResultsCommand {}, {
      construct( _, args ) {
        return getQueryResultsCommand( ...args );
      }
    } )
  }
} );

const { getResults } = await import( './get_results.js' );

const client = { send: mock.fn() };
const queryId = 'foo-bar';
const rawResponse = 'foo-bar';

describe( 'Get Results Spec', () => {
  afterEach( () => {
    mock.reset();
    getQueryExecutionCommand.mock.resetCalls();
    getQueryResultsCommand.mock.resetCalls();
    client.send.mock.resetCalls();
    parseResults.mock.resetCalls();
  } );

  beforeEach( () => {
    parseResults.mock.mockImplementation( () => [ { data: 'test' } ] );
  } );

  it( 'Should recursively ping the query until it completes and then return the results', async () => {
    const responses = [
      { QueryExecution: { Status: { State: 'QUEUED' } } },
      { QueryExecution: { Status: { State: 'RUNNING' } } },
      { QueryExecution: { Status: { State: 'SUCCEEDED' } } },
      rawResponse
    ];
    client.send.mock.mockImplementation( () => responses.shift() );

    const result = await getResults( { client, queryExecutionId: queryId, recursive: true } );

    deepStrictEqual( result, { items: [ { data: 'test' } ] } );
    strictEqual( getQueryExecutionCommand.mock.calls.length, 3 );
    deepStrictEqual( getQueryExecutionCommand.mock.calls[0].arguments[0], { QueryExecutionId: queryId } );
    deepStrictEqual( getQueryResultsCommand.mock.calls[0].arguments[0], { QueryExecutionId: queryId } );
    strictEqual( client.send.mock.calls.length, 4 );
  } );

  it( 'Should recursively ping the query until it completes and then return the results using all the provided parameters', async () => {
    const responses = [
      { QueryExecution: { Status: { State: 'QUEUED' } } },
      { QueryExecution: { Status: { State: 'RUNNING' } } },
      { QueryExecution: { Status: { State: 'SUCCEEDED' } } },
      { ...rawResponse, NextToken: '1' }
    ];
    client.send.mock.mockImplementation( () => responses.shift() );

    const result = await getResults( { client, queryExecutionId: queryId, maxResults: 100, token: 'more-data' } );

    deepStrictEqual( result, { items: [ { data: 'test' } ], nextToken: '1' } );
    strictEqual( getQueryExecutionCommand.mock.calls.length, 3 );
    deepStrictEqual( getQueryExecutionCommand.mock.calls[0].arguments[0], { QueryExecutionId: queryId } );
    deepStrictEqual( getQueryResultsCommand.mock.calls[0].arguments[0], { QueryExecutionId: queryId, MaxResults: 100, NextToken: 'more-data' } );
    strictEqual( client.send.mock.calls.length, 4 );
  } );

  it( 'Should get all the results until a next token is present and concatenate the results rows when recursive is true', async () => {
    const responses = [
      { QueryExecution: { Status: { State: 'QUEUED' } } },
      { QueryExecution: { Status: { State: 'RUNNING' } } },
      { QueryExecution: { Status: { State: 'SUCCEEDED' } } },
      { ...rawResponse, NextToken: '1' },
      { ...rawResponse, NextToken: '2' },
      { ...rawResponse, NextToken: undefined }
    ];
    client.send.mock.mockImplementation( () => responses.shift() );

    const result = await getResults( { client, queryExecutionId: queryId, recursive: true } );

    strictEqual( result.items.length, 3 );
    strictEqual( getQueryExecutionCommand.mock.calls.length, 3 );
    deepStrictEqual( getQueryExecutionCommand.mock.calls[0].arguments[0], { QueryExecutionId: queryId } );
    deepStrictEqual( getQueryResultsCommand.mock.calls[0].arguments[0], { QueryExecutionId: queryId } );
    deepStrictEqual( getQueryResultsCommand.mock.calls[1].arguments[0], { QueryExecutionId: queryId, NextToken: '1' } );
    deepStrictEqual( getQueryResultsCommand.mock.calls[2].arguments[0], { QueryExecutionId: queryId, NextToken: '2' } );
    strictEqual( client.send.mock.calls.length, 6 );
  } );

  it( 'Should throw error when the query fails', async () => {
    const responses = [
      { QueryExecution: { Status: { State: 'QUEUED' } } },
      { QueryExecution: { Status: { State: 'FAILED', StateChangeReason: 'Omg it broke!' } } }
    ];
    client.send.mock.mockImplementation( () => responses.shift() );

    await rejects( () => getResults( { client, queryExecutionId: queryId } ), new Error( 'Omg it broke!' ) );

    strictEqual( getQueryExecutionCommand.mock.calls.length, 2 );
    deepStrictEqual( getQueryExecutionCommand.mock.calls[0].arguments[0], { QueryExecutionId: queryId } );
    strictEqual( getQueryResultsCommand.mock.calls.length, 0 );
    strictEqual( client.send.mock.calls.length, 2 );
  } );
} );
