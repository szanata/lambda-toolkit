import { describe, it, afterEach, mock } from 'node:test';
import { partialDeepStrictEqual, strictEqual, ok } from 'node:assert';

const instance = {};
const startQueryExecutionCommand = mock.fn( () => instance );

mock.module( '@aws-sdk/client-athena', {
  namedExports: {
    StartQueryExecutionCommand: new Proxy( class StartQueryExecutionCommand {}, {
      construct( _, args ) {
        return startQueryExecutionCommand( ...args );
      }
    } )
  }
} );

const { startQuery } = await import( './start_query.js' );

const client = { send: mock.fn() };
const queryId = 'foo-bar';

describe( 'Start Query Spec', () => {
  afterEach( () => {
    mock.reset();
    startQueryExecutionCommand.mock.resetCalls();
    client.send.mock.resetCalls();
  } );

  it( 'Should start a new athena query', async () => {
    client.send.mock.mockImplementation( () => ( { QueryExecutionId: queryId } ) );

    const args = {
      QueryString: 'SELECT STUFF FROM SOMEWHERE',
      QueryExecutionContext: {
        Catalog: 'AwsDataCatalog',
        Database: 'athena.somewhere'
      },
      WorkGroup: 'Olimpo'
    };
    const result = await startQuery( { client, ...args } );

    strictEqual( result, queryId );
    partialDeepStrictEqual( startQueryExecutionCommand.mock.calls[0].arguments[0], args );
    ok( typeof startQueryExecutionCommand.mock.calls[0].arguments[0].ClientRequestToken === 'string' );
    ok( startQueryExecutionCommand.mock.calls[0].arguments[0].ClientRequestToken.length === 32 );
  } );
} );
