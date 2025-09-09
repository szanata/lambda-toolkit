const { GetRecordsCommand } = require( '@aws-sdk/client-kinesis' );
const { encode, decode } = require( '../core/encoder' );

const getRecordsRecursive = async ( { client, shardIterator, options, recursive, records = [], count = 0 } ) => {
  const response = await client.send( new GetRecordsCommand( {
    Limit: options.limit,
    StreamARN: options.streamArn,
    ShardIterator: shardIterator
  } ) );

  const hasLimit = Number.isFinite( options.limit );

  const processedRecords = ( response.Records || [] ).map( record => ( {
    ...record,
    Data: Buffer.from( record.Data )
  } ) );

  const newRecords = records.concat( processedRecords );
  const newCount = count + processedRecords.length;

  const result = {
    records: newRecords,
    count: newCount,
    nextShardIterator: response.NextShardIterator,
    millisBehindLatest: response.MillisBehindLatest
  };

  if ( !recursive ) {
    return {
      records: result.records,
      count: result.count,
      millisBehindLatest: result.millisBehindLatest,
      ...( result.nextShardIterator && { nextToken: encode( result.nextShardIterator ) } )
    };
  }

  if ( result.nextShardIterator && ( !hasLimit || result.records.length < options.limit ) ) {
    return getRecordsRecursive( {
      client,
      shardIterator: result.nextShardIterator,
      options,
      recursive,
      records: result.records,
      count: result.count
    } );
  }

  if ( hasLimit ) {
    const trimmedRecords = result.records.slice( 0, options.limit );
    return { records: trimmedRecords, count: trimmedRecords.length, millisBehindLatest: result.millisBehindLatest };
  }

  return { records: result.records, count: result.count, millisBehindLatest: result.millisBehindLatest };
};

module.exports = async ( client, shardIterator, options = { limit: null, streamArn: null, recursive: false, paginationToken: null } ) => {
  const actualShardIterator = options.paginationToken ? decode( options.paginationToken ) : shardIterator;

  return getRecordsRecursive( {
    client,
    shardIterator: actualShardIterator,
    options,
    recursive: options.recursive
  } );
};
