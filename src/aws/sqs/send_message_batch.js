const { SendMessageBatchCommand } = require( '@aws-sdk/client-sqs' );
const sanitizeSqs = require( './sanitize_sqs' );

module.exports = async ( client, queue, messages ) => {
  if ( messages.length > 10 ) {
    throw new Error( 'SQS.sendMessageBatch only accepts up to then messages.' );
  }
  const response = await client.send( new SendMessageBatchCommand( {
    QueueUrl: queue,
    Entries: messages.map( ( { body, id = null, ...args }, index ) => ( {
      ...args,
      Id: id ?? `message_${index}`,
      MessageBody: sanitizeSqs( typeof body === 'string' ? body : JSON.stringify( body ) )
    } ) )
  } ) );

  if ( response.Failed?.length > 0 ) {
    const error = new Error( 'SQS.sendMessageBatch Failed. See error details' );
    error.details = response.Failed;
    throw error;
  }
  return response;
};
