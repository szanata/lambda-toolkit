const { GetQueryExecutionCommand, GetQueryResultsCommand } = require( '@aws-sdk/client-athena' );
const getResults = require( './get_results' );
const parseResults = require( './parse_results' );

jest.mock( '@aws-sdk/client-athena', () => ( {
  GetQueryExecutionCommand: jest.fn(),
  GetQueryResultsCommand: jest.fn()
} ) );
jest.mock( './polling_delay', () => 10 );
jest.mock( './parse_results', () => jest.fn() );

const client = {
  send: jest.fn()
};

const queryId = 'foo-bar';
const rawResponse = 'foo-bar';

describe( 'Get Results Spec', () => {
  beforeEach( () => {
    client.send.mockReset();
    parseResults.mockReset();
    parseResults.mockReturnValue( [ { data: 'test' } ] );
    GetQueryExecutionCommand.mockReset();
    GetQueryResultsCommand.mockReset();
  } );

  it( 'Should recursively ping the query until it completes and then return the results', async () => {
    client.send.mockResolvedValueOnce( { QueryExecution: { Status: { State: 'QUEUED' } } } );
    client.send.mockResolvedValueOnce( { QueryExecution: { Status: { State: 'RUNNING' } } } );
    client.send.mockResolvedValueOnce( { QueryExecution: { Status: { State: 'SUCCEEDED' } } } );
    client.send.mockResolvedValueOnce( rawResponse );

    const result = await getResults( { client, queryExecutionId: queryId, recursive: true } );

    expect( result ).toEqual( {
      items: [ { data: 'test' } ]
    } );
    expect( GetQueryExecutionCommand ).toHaveBeenCalledTimes( 3 );
    expect( GetQueryExecutionCommand ).toHaveBeenCalledWith( { QueryExecutionId: queryId } );
    expect( GetQueryResultsCommand ).toHaveBeenCalledWith( { QueryExecutionId: queryId } );
    expect( client.send ).toHaveBeenCalledTimes( 4 );
  } );

  it( 'Should recursively ping the query until it completes and then return the results using all the provided parameters', async () => {
    client.send.mockResolvedValueOnce( { QueryExecution: { Status: { State: 'QUEUED' } } } );
    client.send.mockResolvedValueOnce( { QueryExecution: { Status: { State: 'RUNNING' } } } );
    client.send.mockResolvedValueOnce( { QueryExecution: { Status: { State: 'SUCCEEDED' } } } );
    client.send.mockResolvedValueOnce( { ...rawResponse, NextToken: '1' } );

    const result = await getResults( { client, queryExecutionId: queryId, maxResults: 100, token: 'more-data' } );

    expect( result ).toEqual( {
      items: [ { data: 'test' } ],
      nextToken: '1'
    } );
    expect( GetQueryExecutionCommand ).toHaveBeenCalledTimes( 3 );
    expect( GetQueryExecutionCommand ).toHaveBeenCalledWith( { QueryExecutionId: queryId } );
    expect( GetQueryResultsCommand ).toHaveBeenCalledWith( { QueryExecutionId: queryId, MaxResults: 100, NextToken: 'more-data' } );
    expect( client.send ).toHaveBeenCalledTimes( 4 );
  } );

  it( 'Should get all the results until a next token is present and concatenate the results rows when recursive is true', async () => {
    client.send.mockResolvedValueOnce( { QueryExecution: { Status: { State: 'QUEUED' } } } );
    client.send.mockResolvedValueOnce( { QueryExecution: { Status: { State: 'RUNNING' } } } );
    client.send.mockResolvedValueOnce( { QueryExecution: { Status: { State: 'SUCCEEDED' } } } );
    client.send.mockResolvedValueOnce( { ...rawResponse, NextToken: '1' } );
    client.send.mockResolvedValueOnce( { ...rawResponse, NextToken: '2' } );
    client.send.mockResolvedValueOnce( { ...rawResponse, NextToken: undefined } );
    const result = await getResults( { client, queryExecutionId: queryId, recursive: true } );

    expect( result.items.length ).toEqual( 3 );

    expect( GetQueryExecutionCommand ).toHaveBeenCalledTimes( 3 );
    expect( GetQueryExecutionCommand ).toHaveBeenCalledWith( { QueryExecutionId: queryId } );
    expect( GetQueryResultsCommand ).toHaveBeenCalledWith( { QueryExecutionId: queryId, NextToken: '1' } );
    expect( GetQueryResultsCommand ).toHaveBeenCalledWith( { QueryExecutionId: queryId, NextToken: '2' } );
    expect( GetQueryResultsCommand ).toHaveBeenCalledWith( { QueryExecutionId: queryId } );
    expect( client.send ).toHaveBeenCalledTimes( 6 );
  } );

  it( 'Should throw error when the query fails', async () => {
    client.send.mockResolvedValueOnce( { QueryExecution: { Status: { State: 'QUEUED' } } } );
    client.send.mockResolvedValueOnce( {
      QueryExecution: {
        Status: {
          State: 'FAILED',
          StateChangeReason: 'Omg it broke!'
        }
      }
    } );

    const error = new Error( 'Omg it broke!' );
    await expect( getResults( { client, queryExecutionId: queryId } ) ).rejects.toThrow( error );

    expect( GetQueryExecutionCommand ).toHaveBeenCalledTimes( 2 );
    expect( GetQueryExecutionCommand ).toHaveBeenCalledWith( { QueryExecutionId: queryId } );
    expect( GetQueryResultsCommand ).not.toHaveBeenCalled();
    expect( client.send ).toHaveBeenCalledTimes( 2 );
  } );
} );
