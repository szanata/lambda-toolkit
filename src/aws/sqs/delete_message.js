const { DeleteMessageCommand } = require( '@aws-sdk/client-sqs' );

module.exports = async ( client, queue, receiptHandle ) =>
  client.send( new DeleteMessageCommand( {
    QueueUrl: queue,
    ReceiptHandle: receiptHandle
  } ) );
