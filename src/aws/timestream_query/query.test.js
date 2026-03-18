import { describe, it, afterEach, mock } from 'node:test';
import { deepStrictEqual } from 'node:assert';

const parseItemsMock = mock.fn();

mock.module( './parse_items.js', {
  namedExports: {
    parseItems: parseItemsMock
  }
} );

const commandInstance = {};
const constructorMock = mock.fn( () => commandInstance );

mock.module( '@aws-sdk/client-timestream-query', {
  namedExports: {
    QueryCommand: new Proxy( class QueryCommand {}, {
      construct( _, args ) {
        return constructorMock( ...args );
      }
    } )
  }
} );

const { query } = await import( './query.js' );

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

const client = { send: mock.fn() };
const queryString = 'SELECT * FROM "cars"';

describe( 'TimestreamQuery Query Spec', () => {
  afterEach( () => {
    deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );

    mock.reset();
    constructorMock.mock.resetCalls();
    client.send.mock.resetCalls();
    parseItemsMock.mock.resetCalls();
  } );

  it( 'Should send a query to timestream and return the results parsed', async () => {
    parseItemsMock.mock.mockImplementation( () => [ 1, 2, 3 ] );
    client.send.mock.mockImplementation( () => queryResponse );

    const result = await query( client, queryString );

    deepStrictEqual( result, {
      count: 3,
      nextToken: 'next-pagination-token',
      items: [ 1, 2, 3 ],
      queryStatus: {
        cumulativeBytesMetered: 10000000,
        cumulativeBytesScanned: 2001388,
        progressPercentage: 16.666666666666668
      }
    } );
    deepStrictEqual( parseItemsMock.mock.calls[0].arguments[0], queryResponse );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
      QueryString: queryString,
      NextToken: undefined,
      MaxRows: undefined
    } );
  } );

  it( 'Should allow the use of pagination token', async () => {
    parseItemsMock.mock.mockImplementation( () => [ 1, 2, 3 ] );
    client.send.mock.mockImplementation( () => queryResponse );

    const paginationToken = '123';
    const result = await query( client, queryString, { paginationToken } );

    deepStrictEqual( result, {
      count: 3,
      nextToken: 'next-pagination-token',
      items: [ 1, 2, 3 ],
      queryStatus: {
        cumulativeBytesMetered: 10000000,
        cumulativeBytesScanned: 2001388,
        progressPercentage: 16.666666666666668
      }
    } );
    deepStrictEqual( parseItemsMock.mock.calls[0].arguments[0], queryResponse );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
      QueryString: queryString,
      NextToken: paginationToken,
      MaxRows: undefined
    } );
  } );

  it( 'Should recursive paginate the response and return all results', async () => {
    const pages = [
      {
        ColumnInfo: [ {} ],
        NextToken: 'next-pagination-token',
        Rows: Array( 3 ).fill( {} ),
        QueryStatus: {
          CumulativeBytesMetered: 10000000,
          CumulativeBytesScanned: 2000000,
          ProgressPercentage: 50
        }
      },
      {
        ColumnInfo: [ {} ],
        Rows: Array( 3 ).fill( {} ),
        QueryStatus: {
          CumulativeBytesMetered: 20000000,
          CumulativeBytesScanned: 4000000,
          ProgressPercentage: 100
        }
      }
    ];
    client.send.mock.mockImplementation( () => pages.shift() );

    const parsedResults = [ [ 1, 2, 3 ], [ 4, 5, 6 ] ];
    parseItemsMock.mock.mockImplementation( () => parsedResults.shift() );

    const result = await query( client, queryString, { recursive: true } );

    deepStrictEqual( result, {
      count: 6,
      items: [ 1, 2, 3, 4, 5, 6 ],
      nextToken: undefined,
      queryStatus: {
        cumulativeBytesMetered: 20000000,
        cumulativeBytesScanned: 4000000,
        progressPercentage: 100
      }
    } );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
      QueryString: queryString,
      NextToken: undefined,
      MaxRows: undefined
    } );
    deepStrictEqual( constructorMock.mock.calls[1].arguments[0], {
      QueryString: queryString,
      NextToken: 'next-pagination-token',
      MaxRows: undefined
    } );
  } );
} );
