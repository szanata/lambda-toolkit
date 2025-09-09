const { ListStreamsCommand } = require( '@aws-sdk/client-kinesis' );

module.exports = async (
  client,
  options = { exclusiveStartStreamName: null, limit: null, nextToken: null }
) => {
  const { limit, ...otherOptions } = options;

  if ( !limit || limit <= 100 ) {
    return client.send( new ListStreamsCommand( options ) );
  }

  const allStreamNames = [];
  let hasMoreStreams = true;
  let nextToken = otherOptions.nextToken;
  let remainingLimit = limit;

  while ( hasMoreStreams && remainingLimit > 0 ) {
    const batchSize = Math.min( remainingLimit, 100 );

    const commandOptions = {
      Limit: batchSize,
      ...( otherOptions.exclusiveStartStreamName && { ExclusiveStartStreamName: otherOptions.exclusiveStartStreamName } ),
      ...( nextToken && { NextToken: nextToken } )
    };

    const response = await client.send( new ListStreamsCommand( commandOptions ) );

    if ( response.StreamNames ) {
      allStreamNames.push( ...response.StreamNames );
    }

    hasMoreStreams = response.HasMoreStreams || false;
    nextToken = response.NextToken;
    remainingLimit -= response.StreamNames ? response.StreamNames.length : 0;

    if ( response.StreamNames && response.StreamNames.length < batchSize ) {
      hasMoreStreams = false;
    }
  }

  return {
    StreamNames: allStreamNames.slice( 0, limit ),
    HasMoreStreams: hasMoreStreams,
    ...( nextToken && { NextToken: nextToken } )
  };
};
