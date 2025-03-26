const { StartQueryCommand } = require( '@aws-sdk/client-cloudwatch-logs' );

module.exports = async ( { client, nativeArgs, range } ) => {
  const startTime = range?.from ? Math.trunc( range.from / 1000 ) : nativeArgs.startTime;
  const endTime = range?.to ? Math.trunc( range.to / 1000 ) : nativeArgs.endTime;

  const { queryId } = await client.send( new StartQueryCommand( { ...nativeArgs, startTime, endTime } ) );
  return queryId;
};
