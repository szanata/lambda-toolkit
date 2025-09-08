const { GetShardIteratorCommand } = require( '@aws-sdk/client-kinesis' );
const getShardIterator = require( './get_shard_iterator' );

jest.mock( '@aws-sdk/client-kinesis', () => ( {
  GetShardIteratorCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

const streamName = 'test-stream';
const shardId = 'shard-000000000000';
const shardIteratorType = 'LATEST';
const commandInstance = jest.fn();

describe( 'Kinesis GetShardIterator Spec', () => {
  afterEach( () => {
    client.send.mockReset();
    GetShardIteratorCommand.mockReset();
  } );

  it( 'Should get shard iterator for LATEST', async () => {
    const mockResponse = { ShardIterator: 'shard-iterator-123' };
    GetShardIteratorCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await getShardIterator( client, streamName, shardId, shardIteratorType );

    expect( result ).toBe( mockResponse );
    expect( GetShardIteratorCommand ).toHaveBeenCalledWith( {
      StreamName: streamName,
      ShardId: shardId,
      ShardIteratorType: shardIteratorType
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should get shard iterator for TRIM_HORIZON', async () => {
    const mockResponse = { ShardIterator: 'shard-iterator-456' };
    GetShardIteratorCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await getShardIterator( client, streamName, shardId, 'TRIM_HORIZON' );

    expect( result ).toBe( mockResponse );
    expect( GetShardIteratorCommand ).toHaveBeenCalledWith( {
      StreamName: streamName,
      ShardId: shardId,
      ShardIteratorType: 'TRIM_HORIZON'
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should get shard iterator with timestamp', async () => {
    const timestamp = new Date( '2023-01-01T00:00:00Z' );
    const nativeArgs = { Timestamp: timestamp };
    const mockResponse = { ShardIterator: 'shard-iterator-789' };
    GetShardIteratorCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await getShardIterator( client, streamName, shardId, 'AT_TIMESTAMP', nativeArgs );

    expect( result ).toBe( mockResponse );
    expect( GetShardIteratorCommand ).toHaveBeenCalledWith( {
      StreamName: streamName,
      ShardId: shardId,
      ShardIteratorType: 'AT_TIMESTAMP',
      Timestamp: timestamp
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should get shard iterator with sequence number', async () => {
    const nativeArgs = { StartingSequenceNumber: '1234567890' };
    const mockResponse = { ShardIterator: 'shard-iterator-101' };
    GetShardIteratorCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await getShardIterator( client, streamName, shardId, 'AT_SEQUENCE_NUMBER', nativeArgs );

    expect( result ).toBe( mockResponse );
    expect( GetShardIteratorCommand ).toHaveBeenCalledWith( {
      StreamName: streamName,
      ShardId: shardId,
      ShardIteratorType: 'AT_SEQUENCE_NUMBER',
      StartingSequenceNumber: '1234567890'
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );
} );
