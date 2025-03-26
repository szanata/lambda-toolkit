const { GetQueryResultsCommand } = require( '@aws-sdk/client-cloudwatch-logs' );
const getResults = require( './get_results' );

jest.mock( './polling_delay', () => 50 );
jest.mock( '@aws-sdk/client-cloudwatch-logs', () => ( {
  GetQueryResultsCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

const queryId = '123';
const commandInstance = jest.fn();

const queryResults = [
  [
    {
      field: 'foo',
      value: 'bar'
    }
  ]
];

describe( 'Get Results Spec', () => {
  beforeEach( () => {
    client.send.mockReset();
    GetQueryResultsCommand.mockReset();
    GetQueryResultsCommand.mockReturnValue( commandInstance );
  } );
  afterEach( () => {
    expect( GetQueryResultsCommand ).toHaveBeenCalledWith( { queryId } );
  } );

  describe( 'Errors', () => {
    afterEach( () => {
      expect( client.send ).toHaveBeenCalledWith( commandInstance );
    } );

    it( 'Should throw error if the status is Cancelled', async () => {
      client.send.mockResolvedValue( { results: [], status: 'Cancelled' } );
      await expect( getResults( { client, queryId } ) ).rejects.toThrow( new Error( 'Query status is "Cancelled"' ) );
    } );

    it( 'Should throw error if the status is Failed', async () => {
      client.send.mockResolvedValue( { results: [], status: 'Failed' } );
      await expect( getResults( { client, queryId } ) ).rejects.toThrow( new Error( 'Query status is "Failed"' ) );
    } );

    it( 'Should throw error if the status is Timeout', async () => {
      client.send.mockResolvedValue( { results: [], status: 'Timeout' } );
      await expect( getResults( { client, queryId } ) ).rejects.toThrow( new Error( 'Query status is "Timeout"' ) );
    } );

    it( 'Should throw error if the status is Unknown', async () => {
      client.send.mockResolvedValue( { results: [], status: 'Unknown' } );
      await expect( getResults( { client, queryId } ) ).rejects.toThrow( new Error( 'Query status is "Unknown"' ) );
    } );
  } );

  describe( 'Recursiveness', () => {
    it( 'Should keep sending "GetResultsCommand" to client until the status is "Complete", then return the results', async () => {
      client.send.mockResolvedValueOnce( { results: [], status: 'Scheduled' } );
      client.send.mockResolvedValueOnce( { results: [], status: 'Running' } );
      client.send.mockResolvedValueOnce( { results: queryResults, status: 'Complete' } );

      const results = await getResults( { client, queryId } );

      expect( results ).toEqual( queryResults );
      expect( client.send ).toHaveBeenCalledTimes( 3 );
    } );
  } );
} );
