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
      StreamName: streamName,
      Limit: null,
      StreamARN: null,
      ExclusiveStartShardId: null
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should describe a stream with additional options', async () => {
    const options = { limit: 10 };
    const mockResponse = {
      StreamDescription: {
        StreamName: streamName,
        StreamStatus: 'ACTIVE',
        Shards: []
      }
    };
    DescribeStreamCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await describeStream( client, streamName, options );

    expect( result ).toBe( mockResponse );
    expect( DescribeStreamCommand ).toHaveBeenCalledWith( {
      StreamName: streamName,
      Limit: 10,
      StreamARN: undefined,
      ExclusiveStartShardId: undefined
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should describe a stream with stream ARN', async () => {
    const streamArn = 'arn:aws:kinesis:us-east-1:123456789012:stream/test-stream';
    const options = { streamArn };
    const mockResponse = {
      StreamDescription: {
        StreamName: streamName,
        StreamStatus: 'ACTIVE',
        Shards: []
      }
    };
    DescribeStreamCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await describeStream( client, streamName, options );

    expect( result ).toBe( mockResponse );
    expect( DescribeStreamCommand ).toHaveBeenCalledWith( {
      StreamName: streamName,
      Limit: undefined,
      StreamARN: streamArn,
      ExclusiveStartShardId: undefined
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should describe a stream with exclusive start shard ID', async () => {
    const options = { exclusiveStartShardId: 'shard-000000000001' };
    const mockResponse = {
      StreamDescription: {
        StreamName: streamName,
        StreamStatus: 'ACTIVE',
        Shards: []
      }
    };
    DescribeStreamCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await describeStream( client, streamName, options );

    expect( result ).toBe( mockResponse );
    expect( DescribeStreamCommand ).toHaveBeenCalledWith( {
      StreamName: streamName,
      Limit: undefined,
      StreamARN: undefined,
      ExclusiveStartShardId: 'shard-000000000001'
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );
} );
