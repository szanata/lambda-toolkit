import { DeleteMessageCommand } from '@aws-sdk/client-sqs';

export const deleteMessage = async ( client, queue, receiptHandle ) =>
  client.send( new DeleteMessageCommand( {
    QueueUrl: queue,
    ReceiptHandle: receiptHandle
  } ) );
