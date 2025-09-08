const { PutRecordCommand } = require( '@aws-sdk/client-kinesis' );
const putRecord = require( './put_record' );

jest.mock( '@aws-sdk/client-kinesis', () => ( {
  PutRecordCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

const streamName = 'test-stream';
const data = 'test-data';
const partitionKey = 'test-partition';
const commandInstance = jest.fn();

describe( 'Kinesis PutRecord Spec', () => {
  afterEach( () => {
    client.send.mockReset();
    PutRecordCommand.mockReset();
  } );

  it( 'Should put a string record', async () => {
    PutRecordCommand.mockReturnValue( commandInstance );

    await putRecord( client, streamName, data, partitionKey );

    expect( PutRecordCommand ).toHaveBeenCalledWith( {
      StreamName: streamName,
      Data: data,
      PartitionKey: partitionKey
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should put an object record (JSON stringified)', async () => {
    const objectData = { message: 'test', id: 123 };
    PutRecordCommand.mockReturnValue( commandInstance );

    await putRecord( client, streamName, objectData, partitionKey );

    expect( PutRecordCommand ).toHaveBeenCalledWith( {
      StreamName: streamName,
      Data: JSON.stringify( objectData ),
      PartitionKey: partitionKey
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should put a buffer record', async () => {
    const bufferData = Buffer.from( 'test-buffer' );
    PutRecordCommand.mockReturnValue( commandInstance );

    await putRecord( client, streamName, bufferData, partitionKey );

    expect( PutRecordCommand ).toHaveBeenCalledWith( {
      StreamName: streamName,
      Data: bufferData,
      PartitionKey: partitionKey
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should put a record with additional native args', async () => {
    const nativeArgs = { ExplicitHashKey: 'test-hash' };
    PutRecordCommand.mockReturnValue( commandInstance );

    await putRecord( client, streamName, data, partitionKey, nativeArgs );

    expect( PutRecordCommand ).toHaveBeenCalledWith( {
      StreamName: streamName,
      Data: data,
      PartitionKey: partitionKey,
      ExplicitHashKey: 'test-hash'
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should return the client response', async () => {
    const mockResponse = { ShardId: 'shard-1', SequenceNumber: '123' };
    PutRecordCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await putRecord( client, streamName, data, partitionKey );

    expect( result ).toBe( mockResponse );
  } );
} );
