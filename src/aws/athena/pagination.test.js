import { describe, it, mock } from 'node:test';
import { deepStrictEqual } from 'node:assert';

mock.module( './lib/polling_delay.js', { namedExports: { pollingDelay: 0 } } );

const { query } = await import( './query.js' );

const metadata = { ColumnInfo: [ { Name: 'n', Type: 'int' } ] };
const row = value => ( { Data: [ { VarCharValue: String( value ) } ] } );

// Athena only returns the column names row on the first page
const pages = () => [
  { ResultSet: { ResultSetMetadata: metadata, Rows: [ row( 'n' ), row( 1 ), row( 2 ) ] }, NextToken: 'token-2' },
  { ResultSet: { ResultSetMetadata: metadata, Rows: [ row( 3 ), row( 4 ) ] }, NextToken: 'token-3' },
  { ResultSet: { ResultSetMetadata: metadata, Rows: [ row( 5 ), row( 6 ) ] } }
];

const createClient = ( resultPages, sent = [] ) => ( {
  send: async command => {
    sent.push( command );
    switch ( command.constructor.name ) {
      case 'StartQueryExecutionCommand': return { QueryExecutionId: 'query-id' };
      case 'GetQueryExecutionCommand': return { QueryExecution: { Status: { State: 'SUCCEEDED' } } };
      default: return resultPages.shift();
    }
  }
} );

describe( 'Athena Query Pagination Spec', () => {
  it( 'Should return every row of every page when recursive', async () => {
    const { items } = await query( createClient( pages() ), { QueryString: 'SELECT n' }, { recursive: true } );

    deepStrictEqual( items, [ { n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }, { n: 5 }, { n: 6 } ] );
  } );

  it( 'Should send maxResults on every page request when recursive', async () => {
    const sent = [];
    const { items } = await query( createClient( pages(), sent ), { QueryString: 'SELECT n' }, { recursive: true, maxResults: 2 } );

    const pageRequests = sent.filter( command => command.constructor.name === 'GetQueryResultsCommand' );
    deepStrictEqual( pageRequests.map( command => command.input.MaxResults ), [ 2, 2, 2 ] );
    deepStrictEqual( items, [ { n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }, { n: 5 }, { n: 6 } ] );
  } );

  it( 'Should return the first page and a pagination token when called without options', async () => {
    const sent = [];
    const { items, paginationToken } = await query( createClient( pages(), sent ), { QueryString: 'SELECT n' } );

    deepStrictEqual( items, [ { n: 1 }, { n: 2 } ] );
    deepStrictEqual( typeof paginationToken, 'string' );
    deepStrictEqual( sent.filter( command => command.constructor.name === 'GetQueryResultsCommand' ).length, 1 );
  } );

  it( 'Should return every row of every page when paginating with the pagination token', async () => {
    const resultPages = pages();
    const client = createClient( resultPages );

    const first = await query( client, { QueryString: 'SELECT n' }, {} );
    const second = await query( client, { QueryString: 'SELECT n' }, { paginationToken: first.paginationToken } );
    const third = await query( client, { QueryString: 'SELECT n' }, { paginationToken: second.paginationToken } );

    deepStrictEqual( first.items, [ { n: 1 }, { n: 2 } ] );
    deepStrictEqual( second.items, [ { n: 3 }, { n: 4 } ] );
    deepStrictEqual( third.items, [ { n: 5 }, { n: 6 } ] );
    deepStrictEqual( third.paginationToken, undefined );
  } );
} );
