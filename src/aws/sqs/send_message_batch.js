const { SendMessageBatchCommand } = require( '@aws-sdk/client-sqs' );
const sanitizeSqs = require( './sanitize_sqs' );

module.exports = async ( client, queue, messages ) => {
  if ( messages.length > 10 ) {
    throw new Error( 'SQS.sendMessageBatch only accepts up to 10 messages.' );
  }
  const response = await client.send( new SendMessageBatchCommand( {
    QueueUrl: queue,
    Entries: messages.map( ( { body, id = null, nativeArgs }, index ) => ( {
      Id: id ?? `message_${index}`,
      MessageBody: sanitizeSqs( typeof body === 'string' ? body : JSON.stringify( body ) ),
      ...nativeArgs
    } ) )
  } ) );

  if ( response.Failed?.length > 0 ) {
    const error = new Error( 'SQS.sendMessageBatch Failed. See error details' );
    error.details = response.Failed;
    throw error;
  }
  return response;
};
