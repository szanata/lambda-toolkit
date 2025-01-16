const writeRecords = require( './write_records' );
const { WriteRecordsCommand } = require( '@aws-sdk/client-timestream-write' );

jest.mock( '@aws-sdk/client-timestream-write', () => ( {
  WriteRecordsCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

// Error classes replicate real errors from TimeStream
class RejectedRecordsException extends Error {
  constructor() {
    super( 'One or more records have been rejected. See RejectedRecords for details.' );
    this.name = 'RejectedRecordsException';
    this.$fault = 'client';
    this.$metadata = {
      httpStatusCode: 419,
      requestId: 'O4YUOZLCSHNYVGX7UUNZFUE4YA',
      extendedRequestId: undefined,
      cfId: undefined,
      attempts: 1,
      totalRetryDelay: 0
    };
    this.RejectedRecords = [
      {
        ExistingVersion: undefined,
        Reason: 'The record timestamp is outside the time range [2023-02-13T19:22:45.051Z, 2023-02-20T20:02:45.051Z) of the memory store.',
        RecordIndex: 1
      }
    ];
    this.__type = 'com.amazonaws.timestream.v20181101#RejectedRecordsException';
  }
}

class ValidationException extends Error {
  constructor() {
    super( '1 validation error detected: Value \'X\' at \'records.1.member.dimensions\
.1.member.dimensionValueType\' failed to satisfy constraint: Member must satisfy enum value set: [VARCHAR]' );
    this.name = 'ValidationException';
    this.$fault = 'client';
    this.$metadata = {
      httpStatusCode: 400,
      requestId: 'IZGZ3TF5R2H6776MZ3DO3MO7TQ',
      extendedRequestId: undefined,
      cfId: undefined,
      attempts: 1,
      totalRetryDelay: 0
    };
    this.__type = 'com.amazon.coral.validate#ValidationException';
  }
}

const commandInstance = { Records: [] };
const database = 'main';
const table = 'cars';
const records = [
  {
    Dimensions: [ { Name: 'category', DimensionValueType: 'VARCHAR', Value: 'cars' } ],
    Time: '1676919140149',
    TimeUnit: 'MILLISECONDS',
    MeasureName: 'engagement',
    MeasureValueType: 'MULTI',
    MeasureValues: [
      { Name: 'weight', Value: '1890', Type: 'BIGINT' },
      { Name: 'power', Value: '820', Type: 'BIGINT' }
    ]
  },
  {
    Dimensions: [ { Name: 'category', DimensionValueType: 'VARCHAR', Value: 'cars' } ],
    Time: '1676919140150',
    TimeUnit: 'MILLISECONDS',
    MeasureName: 'engagement',
    MeasureValueType: 'MULTI',
    MeasureValues: [
      { Name: 'weight', Value: '980', Type: 'BIGINT' },
      { Name: 'power', Value: '320', Type: 'BIGINT' }
    ]
  }
];

describe( 'TimestreamWrite Write Records Spec', () => {
  beforeEach( () => {
    WriteRecordsCommand.mockReturnValue( commandInstance );
  } );

  afterEach( () => {
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
    expect( WriteRecordsCommand ).toHaveBeenCalledWith( { DatabaseName: database, TableName: table, Records: records } );
    client.send.mockReset();
    WriteRecordsCommand.mockReset();
  } );

  it( 'Should write records to a timestream table', async () => {
    const response = {
      $metadata: {
        httpStatusCode: 200,
        requestId: 'KIBIJH7RBAJCI2EMKZHVSYRFXI',
        extendedRequestId: undefined,
        cfId: undefined,
        attempts: 1,
        totalRetryDelay: 0
      },
      RecordsIngested: { MagneticStore: 0, MemoryStore: 2, Total: 2 }
    };
    client.send.mockResolvedValue( response );

    const result = await writeRecords( client, { database, table, records } );
    expect( result ).toEqual( { recordsIngested: response.RecordsIngested } );
  } );

  it( 'Should throw record reject records error', async () => {
    const error = new RejectedRecordsException();
    client.send.mockRejectedValue( error );

    await expect( writeRecords( client, { database, table, records } ) ).rejects.toThrow( error );
  } );

  it( 'Should handle record reject records error if ignoreRejections options is used', async () => {
    const error = new RejectedRecordsException();
    client.send.mockRejectedValue( error );

    const result = await writeRecords( client, { database, table, records, ignoreRejections: true } );
    expect( result ).toEqual( { rejectedRecords: error.RejectedRecords } );
  } );

  it( 'Should throw other errors', async () => {
    const error = new ValidationException();
    client.send.mockRejectedValue( error );

    await expect( writeRecords( client, { database, table, records } ) ).rejects.toThrow( error );
  } );
} );
