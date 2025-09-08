const { GetRecordsCommand } = require( '@aws-sdk/client-kinesis' );
const getRecords = require( './get_records' );

jest.mock( '@aws-sdk/client-kinesis', () => ( {
  GetRecordsCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

const shardIterator = 'shard-iterator-123';
const commandInstance = jest.fn();

describe( 'Kinesis GetRecords Spec', () => {
  afterEach( () => {
    client.send.mockReset();
    GetRecordsCommand.mockReset();
  } );

  it( 'Should get records from a shard', async () => {
    const mockResponse = {
      Records: [
        { Data: Buffer.from( 'record1' ), PartitionKey: 'partition1', SequenceNumber: '1' },
        { Data: Buffer.from( 'record2' ), PartitionKey: 'partition2', SequenceNumber: '2' }
      ],
      NextShardIterator: 'next-iterator-456',
      MillisBehindLatest: 0
    };
    GetRecordsCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await getRecords( client, shardIterator );

    expect( result ).toBe( mockResponse );
    expect( GetRecordsCommand ).toHaveBeenCalledWith( {
      ShardIterator: shardIterator
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should get records with additional native args', async () => {
    const nativeArgs = { Limit: 10 };
    const mockResponse = { Records: [], NextShardIterator: 'next-iterator-456' };
    GetRecordsCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await getRecords( client, shardIterator, nativeArgs );

    expect( result ).toBe( mockResponse );
    expect( GetRecordsCommand ).toHaveBeenCalledWith( {
      ShardIterator: shardIterator,
      Limit: 10
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should handle empty records response', async () => {
    const mockResponse = {
      Records: [],
      NextShardIterator: 'next-iterator-789',
      MillisBehindLatest: 1000
    };
    GetRecordsCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await getRecords( client, shardIterator );

    expect( result ).toBe( mockResponse );
    expect( GetRecordsCommand ).toHaveBeenCalledWith( {
      ShardIterator: shardIterator
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );
} );
