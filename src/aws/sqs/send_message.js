const { SendMessageCommand } = require( '@aws-sdk/client-sqs' );
const sanitizeSqs = require( './sanitize_sqs' );

module.exports = async ( client, queue, body, args ) => {
  const response = await client.send( new SendMessageCommand( {
    ...args,
    MessageBody: sanitizeSqs( typeof body === 'string' ? body : JSON.stringify( body ) ),
    QueueUrl: queue,
  } ) );
  return response.MessageId;
};
