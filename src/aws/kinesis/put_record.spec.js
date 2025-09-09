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
      ExplicitHashKey: null,
      SequenceNumberForOrdering: null,
      StreamARN: null,
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
      ExplicitHashKey: null,
      SequenceNumberForOrdering: null,
      StreamARN: null,
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
      ExplicitHashKey: null,
      SequenceNumberForOrdering: null,
      StreamARN: null,
      StreamName: streamName,
      Data: bufferData,
      PartitionKey: partitionKey
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should put a record with additional options', async () => {
    const options = { explicitHashKey: 'test-hash' };
    PutRecordCommand.mockReturnValue( commandInstance );

    await putRecord( client, streamName, data, partitionKey, options );

    expect( PutRecordCommand ).toHaveBeenCalledWith( {
      ExplicitHashKey: 'test-hash',
      SequenceNumberForOrdering: undefined,
      StreamARN: undefined,
      StreamName: streamName,
      Data: data,
      PartitionKey: partitionKey
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should put a record with sequenceNumberForOrdering', async () => {
    const options = { sequenceNumberForOrdering: '123456789' };
    PutRecordCommand.mockReturnValue( commandInstance );

    await putRecord( client, streamName, data, partitionKey, options );

    expect( PutRecordCommand ).toHaveBeenCalledWith( {
      ExplicitHashKey: undefined,
      SequenceNumberForOrdering: '123456789',
      StreamARN: undefined,
      StreamName: streamName,
      Data: data,
      PartitionKey: partitionKey
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should put a record with streamArn', async () => {
    const options = { streamArn: 'arn:aws:kinesis:us-east-1:123456789012:stream/test-stream' };
    PutRecordCommand.mockReturnValue( commandInstance );

    await putRecord( client, streamName, data, partitionKey, options );

    expect( PutRecordCommand ).toHaveBeenCalledWith( {
      ExplicitHashKey: undefined,
      SequenceNumberForOrdering: undefined,
      StreamARN: 'arn:aws:kinesis:us-east-1:123456789012:stream/test-stream',
      StreamName: streamName,
      Data: data,
      PartitionKey: partitionKey
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should put a record with all options', async () => {
    const options = {
      explicitHashKey: 'test-hash',
      sequenceNumberForOrdering: '123456789',
      streamArn: 'arn:aws:kinesis:us-east-1:123456789012:stream/test-stream'
    };
    PutRecordCommand.mockReturnValue( commandInstance );

    await putRecord( client, streamName, data, partitionKey, options );

    expect( PutRecordCommand ).toHaveBeenCalledWith( {
      ExplicitHashKey: 'test-hash',
      SequenceNumberForOrdering: '123456789',
      StreamARN: 'arn:aws:kinesis:us-east-1:123456789012:stream/test-stream',
      StreamName: streamName,
      Data: data,
      PartitionKey: partitionKey
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
