const startQuery = require( './lib/start_query' );
const getResults = require( './lib/get_results' );
const query = require( './query' );

jest.mock( './lib/get_results', () => jest.fn() );
jest.mock( './lib/start_query', () => jest.fn() );

const queryExecutionId = 'query-execution-id';
const nativeQueryArgs = 'native-query-args';
const items = 'items';

const client = {
  send: jest.fn()
};

describe( 'Query Athena Spec', () => {
  beforeEach( () => {
    client.send.mockReset();
    startQuery.mockReset();
    getResults.mockReset();
  } );

  it( 'Should start a new recursive query, get the results and return them serialized', async () => {
    startQuery.mockResolvedValue( queryExecutionId );
    getResults.mockResolvedValue( { items } );

    const result = await query( client, nativeQueryArgs, { recursive: true, maxResults: 100 } );

    expect( result ).toEqual( { items } );
    expect( startQuery ).toHaveBeenCalledWith( { client, ...nativeQueryArgs } );
    expect( getResults ).toHaveBeenCalledWith( { client, queryExecutionId, recursive: true, maxResults: 100 } );
  } );

  it( 'Should use the provided paginationToken to continue the query', async () => {
    const nextToken = 'very-next-token';
    const token = 'previous-token';
    // encode( { queryExecutionId, token } );
    const paginationToken = 'eyJxdWVyeUV4ZWN1dGlvbklkIjoicXVlcnktZXhlY3V0aW9uLWlkIiwidG9rZW4iOiJwcmV2aW91cy10b2tlbiJ9';

    getResults.mockResolvedValue( { items, nextToken } );

    const result = await query( client, nativeQueryArgs, { paginationToken } );

    // encode( { queryExecutionId, token: nextToken });
    const nextPaginationToken = 'eyJxdWVyeUV4ZWN1dGlvbklkIjoicXVlcnktZXhlY3V0aW9uLWlkIiwidG9rZW4iOiJ2ZXJ5LW5leHQtdG9rZW4ifQ==';
    expect( result ).toEqual( { items, paginationToken: nextPaginationToken } );
    expect( getResults ).toHaveBeenCalledWith( { client, queryExecutionId, token, recursive: false } );
    expect( startQuery ).not.toHaveBeenCalled();
  } );
} );
