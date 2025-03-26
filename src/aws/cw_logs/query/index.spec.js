const startQuery = require( './start_query' );
const getResults = require( './get_results' );
const parseResults = require( './parse_results' );
const query = require( './' );

jest.mock( './start_query', () => jest.fn() );
jest.mock( './get_results', () => jest.fn() );
jest.mock( './parse_results', () => jest.fn() );

const client = 'client';
const nativeArgs = 'nativeArgs';
const range = 'range';
const queryId = '123';
const rawResults = 'rawResults';
const finalResults = 'finalResults';

describe( 'Query Spec', () => {
  it( 'Should start the query, get the results and parse them before returning', async () => {
    startQuery.mockResolvedValue( queryId );
    getResults.mockResolvedValue( rawResults );
    parseResults.mockReturnValue( finalResults );

    const result = await query( client, nativeArgs, { range } );

    expect( result ).toEqual( { items: finalResults, count: finalResults.length } );
    expect( startQuery ).toHaveBeenCalledWith( { client, nativeArgs, range } );
    expect( getResults ).toHaveBeenCalledWith( { client, queryId } );
    expect( parseResults ).toHaveBeenCalledWith( rawResults );
  } );
} );
