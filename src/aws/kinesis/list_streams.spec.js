const { ListStreamsCommand } = require( '@aws-sdk/client-kinesis' );
const listStreams = require( './list_streams' );

jest.mock( '@aws-sdk/client-kinesis', () => ( {
  ListStreamsCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

const commandInstance = jest.fn();

describe( 'Kinesis ListStreams Spec', () => {
  afterEach( () => {
    client.send.mockReset();
    ListStreamsCommand.mockReset();
  } );

  it( 'Should list all streams', async () => {
    const mockResponse = {
      StreamNames: [
        'stream-1',
        'stream-2',
        'stream-3'
      ],
      HasMoreStreams: false
    };
    ListStreamsCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await listStreams( client );

    expect( result ).toBe( mockResponse );
    expect( ListStreamsCommand ).toHaveBeenCalledWith( {} );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should list streams with filter conditions', async () => {
    const nativeArgs = {
      StreamNameCondition: {
        ComparisonOperator: 'BEGINS_WITH',
        ComparisonValue: 'test-'
      }
    };
    const mockResponse = {
      StreamNames: [
        'test-stream-1',
        'test-stream-2'
      ],
      HasMoreStreams: true
    };
    ListStreamsCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await listStreams( client, nativeArgs );

    expect( result ).toBe( mockResponse );
    expect( ListStreamsCommand ).toHaveBeenCalledWith( {
      StreamNameCondition: {
        ComparisonOperator: 'BEGINS_WITH',
        ComparisonValue: 'test-'
      }
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should list streams with limit', async () => {
    const nativeArgs = { Limit: 5 };
    const mockResponse = {
      StreamNames: [
        'stream-1',
        'stream-2',
        'stream-3',
        'stream-4',
        'stream-5'
      ],
      HasMoreStreams: true
    };
    ListStreamsCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await listStreams( client, nativeArgs );

    expect( result ).toBe( mockResponse );
    expect( ListStreamsCommand ).toHaveBeenCalledWith( {
      Limit: 5
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should handle empty streams list', async () => {
    const mockResponse = {
      StreamNames: [],
      HasMoreStreams: false
    };
    ListStreamsCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await listStreams( client );

    expect( result ).toBe( mockResponse );
    expect( ListStreamsCommand ).toHaveBeenCalledWith( {} );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );
} );
