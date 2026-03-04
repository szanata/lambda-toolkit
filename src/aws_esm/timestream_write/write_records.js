import { WriteRecordsCommand } from '@aws-sdk/client-timestream-write';

export const writeRecords = async ( client, { database, table, records, ignoreRejections = false } ) => {
  try {
    const response = await client.send( new WriteRecordsCommand( {
      DatabaseName: database,
      TableName: table,
      Records: records
    } ) );
    return { recordsIngested: response.RecordsIngested };
  } catch ( error ) {
    if ( ignoreRejections && error.name === 'RejectedRecordsException' ) {
      return { rejectedRecords: error.RejectedRecords };
    }
    throw error;
  }
};
