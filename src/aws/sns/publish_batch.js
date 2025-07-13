const { PublishBatchCommand } = require( '@aws-sdk/client-sns' );

module.exports = async ( client, topic, messages ) => {
  if ( messages.length > 10 ) {
    throw new Error( 'SNS.publishBatch only accepts up to 10 messages.' );
  }
  const response = await client.send( new PublishBatchCommand( {
    TopicArn: topic,
    PublishBatchRequestEntries: messages.map( ( { body, id = null, nativeArgs }, index ) => ( {
      Id: id ?? `message_${index}`,
      Message: typeof body === 'string' ? body : JSON.stringify( body ),
      ...nativeArgs
    } ) )
  } ) );

  if ( response.Failed?.length > 0 ) {
    const error = new Error( 'SNS.publishBatch Failed. See error details' );
    error.details = response.Failed;
    throw error;
  }
  return response;
};
