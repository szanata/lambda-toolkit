const { GetRecordsCommand } = require( '@aws-sdk/client-kinesis' );
const getRecords = require( './get_records' );

jest.mock( '@aws-sdk/client-kinesis', () => ( {
  GetRecordsCommand: jest.fn()
} ) );

jest.mock( '../core/encoder', () => ( {
  encode: jest.fn( k => k ? Buffer.from( JSON.stringify( k ) ).toString( 'base64' ) : k ),
  decode: jest.fn( k => k ? JSON.parse( Buffer.from( k, 'base64' ).toString( 'utf8' ) ) : k )
} ) );

const { decode } = require( '../core/encoder' );

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
        { Data: new Uint8Array( Buffer.from( 'record1' ) ), PartitionKey: 'partition1', SequenceNumber: '1' },
        { Data: new Uint8Array( Buffer.from( 'record2' ) ), PartitionKey: 'partition2', SequenceNumber: '2' }
      ],
      NextShardIterator: 'next-iterator-456',
      MillisBehindLatest: 0
    };
    GetRecordsCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await getRecords( client, shardIterator );

    expect( result ).toEqual( {
      records: [
        { Data: Buffer.from( 'record1' ), PartitionKey: 'partition1', SequenceNumber: '1' },
        { Data: Buffer.from( 'record2' ), PartitionKey: 'partition2', SequenceNumber: '2' }
      ],
      count: 2,
      millisBehindLatest: 0,
      nextToken: expect.any( String )
    } );
    expect( GetRecordsCommand ).toHaveBeenCalledWith( {
      Limit: null,
      StreamARN: null,
      ShardIterator: shardIterator
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should get records with additional native args', async () => {
    const nativeArgs = { limit: 10 };
    const mockResponse = { Records: [], NextShardIterator: 'next-iterator-456', MillisBehindLatest: 0 };
    GetRecordsCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await getRecords( client, shardIterator, nativeArgs );

    expect( result ).toEqual( {
      records: [],
      count: 0,
      millisBehindLatest: 0,
      nextToken: expect.any( String )
    } );
    expect( GetRecordsCommand ).toHaveBeenCalledWith( {
      Limit: 10,
      StreamARN: undefined,
      ShardIterator: shardIterator
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

    expect( result ).toEqual( {
      records: [],
      count: 0,
      millisBehindLatest: 1000,
      nextToken: expect.any( String )
    } );
    expect( GetRecordsCommand ).toHaveBeenCalledWith( {
      Limit: null,
      StreamARN: null,
      ShardIterator: shardIterator
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should return pagination token when NextShardIterator is present', async () => {
    const mockResponse = {
      Records: [ { Data: new Uint8Array( Buffer.from( 'record1' ) ), PartitionKey: 'partition1', SequenceNumber: '1' } ],
      NextShardIterator: 'next-iterator-456',
      MillisBehindLatest: 0
    };
    GetRecordsCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await getRecords( client, shardIterator );

    expect( result ).toHaveProperty( 'nextToken' );
    expect( result.records ).toEqual( [ { Data: Buffer.from( 'record1' ), PartitionKey: 'partition1', SequenceNumber: '1' } ] );
    expect( result.count ).toBe( 1 );
    expect( result.millisBehindLatest ).toBe( 0 );
  } );

  it( 'Should not return pagination token when NextShardIterator is null', async () => {
    const mockResponse = {
      Records: [ { Data: new Uint8Array( Buffer.from( 'record1' ) ), PartitionKey: 'partition1', SequenceNumber: '1' } ],
      NextShardIterator: null,
      MillisBehindLatest: 0
    };
    GetRecordsCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await getRecords( client, shardIterator );

    expect( result ).not.toHaveProperty( 'nextToken' );
    expect( result.records ).toEqual( [ { Data: Buffer.from( 'record1' ), PartitionKey: 'partition1', SequenceNumber: '1' } ] );
    expect( result.count ).toBe( 1 );
  } );

  it( 'Should use pagination token when provided', async () => {
    const paginationToken = 'encoded-shard-iterator';
    const decodedIterator = 'decoded-shard-iterator';
    const mockResponse = {
      Records: [ { Data: new Uint8Array( Buffer.from( 'record1' ) ), PartitionKey: 'partition1', SequenceNumber: '1' } ],
      NextShardIterator: null,
      MillisBehindLatest: 0
    };

    decode.mockReturnValue( decodedIterator );
    GetRecordsCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await getRecords( client, shardIterator, { paginationToken } );

    expect( decode ).toHaveBeenCalledWith( paginationToken );
    expect( GetRecordsCommand ).toHaveBeenCalledWith( {
      Limit: undefined,
      StreamARN: undefined,
      ShardIterator: decodedIterator
    } );
    expect( result.records ).toEqual( [ { Data: Buffer.from( 'record1' ), PartitionKey: 'partition1', SequenceNumber: '1' } ] );
  } );

  it( 'Should get records with StreamARN when provided', async () => {
    const streamArn = 'arn:aws:kinesis:us-east-1:123456789012:stream/test-stream';
    const mockResponse = {
      Records: [ { Data: new Uint8Array( Buffer.from( 'record1' ) ), PartitionKey: 'partition1', SequenceNumber: '1' } ],
      NextShardIterator: null,
      MillisBehindLatest: 0
    };
    GetRecordsCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await getRecords( client, shardIterator, { streamArn } );

    expect( result ).toEqual( {
      records: [ { Data: Buffer.from( 'record1' ), PartitionKey: 'partition1', SequenceNumber: '1' } ],
      count: 1,
      millisBehindLatest: 0
    } );
    expect( GetRecordsCommand ).toHaveBeenCalledWith( {
      Limit: undefined,
      StreamARN: streamArn,
      ShardIterator: shardIterator
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should fetch all records recursively when recursive option is true', async () => {
    const firstResponse = {
      Records: [ { Data: new Uint8Array( Buffer.from( 'record1' ) ), PartitionKey: 'partition1', SequenceNumber: '1' } ],
      NextShardIterator: 'next-iterator-1',
      MillisBehindLatest: 100
    };
    const secondResponse = {
      Records: [ { Data: new Uint8Array( Buffer.from( 'record2' ) ), PartitionKey: 'partition2', SequenceNumber: '2' } ],
      NextShardIterator: 'next-iterator-2',
      MillisBehindLatest: 50
    };
    const thirdResponse = {
      Records: [ { Data: new Uint8Array( Buffer.from( 'record3' ) ), PartitionKey: 'partition3', SequenceNumber: '3' } ],
      NextShardIterator: null,
      MillisBehindLatest: 0
    };

    GetRecordsCommand.mockReturnValue( commandInstance );
    client.send
      .mockResolvedValueOnce( firstResponse )
      .mockResolvedValueOnce( secondResponse )
      .mockResolvedValueOnce( thirdResponse );

    const result = await getRecords( client, shardIterator, { recursive: true } );

    expect( client.send ).toHaveBeenCalledTimes( 3 );
    expect( result.records ).toHaveLength( 3 );
    expect( result.count ).toBe( 3 );
    expect( result.records ).toEqual( [
      { Data: Buffer.from( 'record1' ), PartitionKey: 'partition1', SequenceNumber: '1' },
      { Data: Buffer.from( 'record2' ), PartitionKey: 'partition2', SequenceNumber: '2' },
      { Data: Buffer.from( 'record3' ), PartitionKey: 'partition3', SequenceNumber: '3' }
    ] );
    expect( result.millisBehindLatest ).toBe( 0 ); // Should be from the last response
  } );

  it( 'Should respect limit when fetching recursively', async () => {
    const firstResponse = {
      Records: [ { Data: new Uint8Array( Buffer.from( 'record1' ) ), PartitionKey: 'partition1', SequenceNumber: '1' } ],
      NextShardIterator: 'next-iterator-1',
      MillisBehindLatest: 100
    };
    const secondResponse = {
      Records: [
        { Data: new Uint8Array( Buffer.from( 'record2' ) ), PartitionKey: 'partition2', SequenceNumber: '2' },
        { Data: new Uint8Array( Buffer.from( 'record3' ) ), PartitionKey: 'partition3', SequenceNumber: '3' }
      ],
      NextShardIterator: 'next-iterator-2',
      MillisBehindLatest: 50
    };

    GetRecordsCommand.mockReturnValue( commandInstance );
    client.send
      .mockResolvedValueOnce( firstResponse )
      .mockResolvedValueOnce( secondResponse );

    const result = await getRecords( client, shardIterator, { recursive: true, limit: 2 } );

    expect( client.send ).toHaveBeenCalledTimes( 2 );
    expect( result.records ).toHaveLength( 2 );
    expect( result.count ).toBe( 2 );
    expect( result.records ).toEqual( [
      { Data: Buffer.from( 'record1' ), PartitionKey: 'partition1', SequenceNumber: '1' },
      { Data: Buffer.from( 'record2' ), PartitionKey: 'partition2', SequenceNumber: '2' }
    ] );
  } );

  it( 'Should stop recursive fetching when NextShardIterator is null', async () => {
    const mockResponse = {
      Records: [ { Data: new Uint8Array( Buffer.from( 'record1' ) ), PartitionKey: 'partition1', SequenceNumber: '1' } ],
      NextShardIterator: null,
      MillisBehindLatest: 0
    };

    GetRecordsCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await getRecords( client, shardIterator, { recursive: true } );

    expect( client.send ).toHaveBeenCalledTimes( 1 );
    expect( result.records ).toEqual( [ { Data: Buffer.from( 'record1' ), PartitionKey: 'partition1', SequenceNumber: '1' } ] );
    expect( result.count ).toBe( 1 );
  } );
} );
