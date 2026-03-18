import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { sanitizeSqs } from './sanitize_sqs.js';

export const sendMessage = async ( client, queue, body, args ) => {
  const response = await client.send( new SendMessageCommand( {
    ...args,
    MessageBody: sanitizeSqs( typeof body === 'string' ? body : JSON.stringify( body ) ),
    QueueUrl: queue
  } ) );
  return response.MessageId;
};
