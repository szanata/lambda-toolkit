const { DescribeStreamCommand } = require( '@aws-sdk/client-kinesis' );
const describeStream = require( './describe_stream' );

jest.mock( '@aws-sdk/client-kinesis', () => ( {
  DescribeStreamCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

const streamName = 'test-stream';
const commandInstance = jest.fn();

describe( 'Kinesis DescribeStream Spec', () => {
  afterEach( () => {
    client.send.mockReset();
    DescribeStreamCommand.mockReset();
  } );

  it( 'Should describe a stream', async () => {
    const mockResponse = {
      StreamDescription: {
        StreamName: streamName,
        StreamARN: 'arn:aws:kinesis:us-east-1:123456789012:stream/test-stream',
        StreamStatus: 'ACTIVE',
        Shards: [
          {
            ShardId: 'shard-000000000000',
            HashKeyRange: { StartingHashKey: '0', EndingHashKey: '170141183460469231731687303715884105727' },
            SequenceNumberRange: { StartingSequenceNumber: '0' }
          }
        ]
      }
    };
    DescribeStreamCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await describeStream( client, streamName );

    expect( result ).toBe( mockResponse );
    expect( DescribeStreamCommand ).toHaveBeenCalledWith( {
      StreamName: streamName
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should describe a stream with additional native args', async () => {
    const nativeArgs = { Limit: 10 };
    const mockResponse = {
      StreamDescription: {
        StreamName: streamName,
        StreamStatus: 'ACTIVE',
        Shards: []
      }
    };
    DescribeStreamCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await describeStream( client, streamName, nativeArgs );

    expect( result ).toBe( mockResponse );
    expect( DescribeStreamCommand ).toHaveBeenCalledWith( {
      StreamName: streamName,
      Limit: 10
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should handle stream not found', async () => {
    const mockResponse = {
      StreamDescription: {
        StreamName: streamName,
        StreamStatus: 'DELETING',
        Shards: []
      }
    };
    DescribeStreamCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await describeStream( client, streamName );

    expect( result ).toBe( mockResponse );
    expect( DescribeStreamCommand ).toHaveBeenCalledWith( {
      StreamName: streamName
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );
} );
