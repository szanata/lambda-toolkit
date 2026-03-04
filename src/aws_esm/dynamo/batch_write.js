import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { splitBatches } from '../../array_esm/split_batches.js';

const batchSize = 25;

const getMapper = method => method === 'put' ? v => ( { PutRequest: { Item: v } } ) : v => ( { DeleteRequest: { Key: v } } );

const process = async ( { client, method, table, batches } ) => {
  if ( batches.length === 0 ) { return true; }

  const response = await client.send( new BatchWriteCommand( { RequestItems: { [table]: batches[0] } } ) );

  const unprocessed = response.UnprocessedItems?.[table];
  return process( {
    client, method, table,
    batches: unprocessed ? splitBatches( batches.slice( 1 ).flat().concat( unprocessed ), batchSize ) : batches.slice( 1 )
  } );
};

export const batchWrite = async ( client, method, table, items ) =>
  process( { client, method, table, batches: splitBatches( items.map( getMapper( method ) ), batchSize ) } );
