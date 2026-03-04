import { ValidationException, RejectedRecordsException } from './fixtures/error.js';
import { describe, it, afterEach, mock } from 'node:test';
import { deepStrictEqual, rejects } from 'node:assert';

const commandInstance = {};
const constructorMock = mock.fn( () => commandInstance );

mock.module( '@aws-sdk/client-timestream-write', {
  namedExports: {
    WriteRecordsCommand: new Proxy( class WriteRecordsCommand {}, {
      construct( _, args ) {
        return constructorMock( ...args );
      }
    } )
  }
} );

const { writeRecords } = await import( './write_records.js' );

const client = { send: mock.fn() };
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
  afterEach( () => {
    deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], { DatabaseName: database, TableName: table, Records: records } );

    mock.reset();
    constructorMock.mock.resetCalls();
    client.send.mock.resetCalls();
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
    client.send.mock.mockImplementation( () => response );

    const result = await writeRecords( client, { database, table, records } );
    deepStrictEqual( result, { recordsIngested: response.RecordsIngested } );
  } );

  it( 'Should throw record reject records error', async () => {
    const error = new RejectedRecordsException();
    client.send.mock.mockImplementation( () => { throw error; } );

    rejects( async () => writeRecords( client, { database, table, records } ), error );
  } );

  it( 'Should handle record reject records error if ignoreRejections options is used', async () => {
    const error = new RejectedRecordsException();
    client.send.mock.mockImplementation( () => { throw error; } );

    const result = await writeRecords( client, { database, table, records, ignoreRejections: true } );
    deepStrictEqual( result, { rejectedRecords: error.RejectedRecords } );
  } );

  it( 'Should throw other errors', async () => {
    const error = new ValidationException();
    client.send.mock.mockImplementation( () => { throw error; } );

    rejects( async () => writeRecords( client, { database, table, records } ), error );
  } );
} );
