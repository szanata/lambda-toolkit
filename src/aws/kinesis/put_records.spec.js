const { PutRecordsCommand } = require( '@aws-sdk/client-kinesis' );
const putRecords = require( './put_records' );

jest.mock( '@aws-sdk/client-kinesis', () => ( {
  PutRecordsCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

const streamName = 'test-stream';
const records = [
  { Data: 'Record 1', PartitionKey: 'partition-1' },
  { Data: 'Record 2', PartitionKey: 'partition-2' }
];
const commandInstance = jest.fn();

describe( 'Kinesis PutRecords Spec', () => {
  afterEach( () => {
    client.send.mockReset();
    PutRecordsCommand.mockReset();
  } );

  it( 'Should put multiple records', async () => {
    PutRecordsCommand.mockReturnValue( commandInstance );

    await putRecords( client, streamName, records );

    expect( PutRecordsCommand ).toHaveBeenCalledWith( {
      StreamARN: null,
      StreamName: streamName,
      Records: records
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should put records with object data (JSON stringified)', async () => {
    const recordsWithObjects = [
      { Data: 'Record 1', PartitionKey: 'partition-1' },
      { Data: { message: 'Record 2', id: 123 }, PartitionKey: 'partition-2' },
      { Data: Buffer.from( 'Record 3' ), PartitionKey: 'partition-3' }
    ];
    PutRecordsCommand.mockReturnValue( commandInstance );

    await putRecords( client, streamName, recordsWithObjects );

    expect( PutRecordsCommand ).toHaveBeenCalledWith( {
      StreamARN: null,
      StreamName: streamName,
      Records: [
        { Data: 'Record 1', PartitionKey: 'partition-1' },
        { Data: JSON.stringify( { message: 'Record 2', id: 123 } ), PartitionKey: 'partition-2' },
        { Data: Buffer.from( 'Record 3' ), PartitionKey: 'partition-3' }
      ]
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should put records with additional options', async () => {
    const options = { streamArn: 'test-arn' };
    PutRecordsCommand.mockReturnValue( commandInstance );

    await putRecords( client, streamName, records, options );

    expect( PutRecordsCommand ).toHaveBeenCalledWith( {
      StreamARN: 'test-arn',
      StreamName: streamName,
      Records: records
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should return the client response', async () => {
    const mockResponse = { FailedRecordCount: 0, Records: [] };
    PutRecordsCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await putRecords( client, streamName, records );

    expect( result ).toBe( mockResponse );
  } );
} );
