const query = require( './query' );
const { QueryCommand } = require( '@aws-sdk/client-timestream-query' );
const parseItems = require( './parse_items' );

jest.mock( '@aws-sdk/client-timestream-query', () => ( {
  QueryCommand: jest.fn()
} ) );
jest.mock( './parse_items', () => jest.fn() );

const queryResponse = {
  $metadata: {
    httpStatusCode: 200,
    requestId: 'UJTSDT5YDWFCI3CKTNDFMLGNGI',
    attempts: 1,
    totalRetryDelay: 0
  },
  ColumnInfo: [ {} ],
  NextToken: 'next-pagination-token',
  QueryId: 'AEDQCANZXGITOTETM4TL3YBNP4Z2IAOZIB254YCXQ67YD6H5E2TX7BC2HNKZCHQ',
  QueryStatus: {
    CumulativeBytesMetered: 10000000,
    CumulativeBytesScanned: 2001388,
    ProgressPercentage: 16.666666666666668
  },
  Rows: Array( 5 ).fill( {} )
};

const client = {
  send: jest.fn()
};

const commandInstance = jest.fn();
const queryString = 'SELECT * FROM "cars"';

describe( 'TimestreamQuery Query Spec', () => {
  beforeEach( () => {
    parseItems.mockReturnValue( [ 1, 2, 3 ] );
  } );

  afterEach( () => {
    client.send.mockReset();
    parseItems.mockReset();
    QueryCommand.mockReset();
  } );

  it( 'Should send a query to timestream and return the results parsed', async () => {
    QueryCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( queryResponse );

    const result = await query( client, queryString );

    expect( result ).toEqual( {
      count: 3,
      nextToken: 'next-pagination-token',
      items: [ 1, 2, 3 ],
      queryStatus: {
        cumulativeBytesMetered: 10000000,
        cumulativeBytesScanned: 2001388,
        progressPercentage: 16.666666666666668
      }
    } );
    expect( parseItems ).toHaveBeenCalledWith( queryResponse );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
    expect( QueryCommand ).toHaveBeenCalledWith( { QueryString: queryString } );
  } );

  it( 'Should allow the use of pagination token', async () => {
    QueryCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( queryResponse );

    const paginationToken = '123';
    const result = await query( client, queryString, { paginationToken } );

    expect( result ).toEqual( {
      count: 3,
      nextToken: 'next-pagination-token',
      items: [ 1, 2, 3 ],
      queryStatus: {
        cumulativeBytesMetered: 10000000,
        cumulativeBytesScanned: 2001388,
        progressPercentage: 16.666666666666668
      }
    } );
    expect( parseItems ).toHaveBeenCalledWith( queryResponse );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
    expect( QueryCommand ).toHaveBeenCalledWith( { QueryString: queryString, NextToken: paginationToken } );
  } );

  it( 'Should recursive paginate the response and return all results', async () => {
    QueryCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValueOnce( {
      ColumnInfo: [ {} ],
      NextToken: 'next-pagination-token',
      Rows: Array( 3 ).fill( {} ),
      QueryStatus: {
        CumulativeBytesMetered: 10000000,
        CumulativeBytesScanned: 2000000,
        ProgressPercentage: 50
      }
    } );
    client.send.mockResolvedValueOnce( {
      ColumnInfo: [ {} ],
      Rows: Array( 3 ).fill( {} ),
      QueryStatus: {
        CumulativeBytesMetered: 20000000,
        CumulativeBytesScanned: 4000000,
        ProgressPercentage: 100
      }
    } );

    parseItems.mockReturnValueOnce( [ 1, 2, 3 ] );
    parseItems.mockReturnValueOnce( [ 4, 5, 6 ] );

    const result = await query( client, queryString, { recursive: true } );

    expect( result ).toEqual( {
      count: 6,
      items: [ 1, 2, 3, 4, 5, 6 ],
      queryStatus: {
        cumulativeBytesMetered: 20000000,
        cumulativeBytesScanned: 4000000,
        progressPercentage: 100
      }
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
    expect( QueryCommand ).toHaveBeenNthCalledWith( 1, { QueryString: queryString } );
    expect( QueryCommand ).toHaveBeenNthCalledWith( 2, { QueryString: queryString, NextToken: 'next-pagination-token' } );
  } );
} );
