const { StartQueryExecutionCommand } = require( '@aws-sdk/client-athena' );
const startQuery = require( './start_query' );

jest.mock( '@aws-sdk/client-athena', () => ( {
  StartQueryExecutionCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

const queryId = 'foo-bar';

describe( 'Start Query Spec', () => {
  afterEach( () => {
    client.send.mockReset();
    StartQueryExecutionCommand.mockReset();
  } );

  it( 'Should start a new athena query', async () => {
    client.send.mockResolvedValue( { QueryExecutionId: queryId } );

    const parameters = {
      QueryString: 'SELECT STUFF FROM SOMEWHERE',
      QueryExecutionContext: {
        Catalog: 'AwsDataCatalog',
        Database: 'athena.somewhere'
      },
      WorkGroup: 'Olimpo'
    };
    const result = await startQuery( { client, ...parameters } );

    expect( result ).toEqual( queryId );
    expect( StartQueryExecutionCommand ).toHaveBeenCalledWith( {
      ClientRequestToken: expect.any( String ),
      ...parameters
    } );
  } );
} );
