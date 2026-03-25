import { PublishCommand } from '@aws-sdk/client-sns';

export const publish = async ( client, topic, message, args = {} ) => {
  const response = await client.send( new PublishCommand( {
    ...args,
    TopicArn: topic,
    Message: typeof message === 'string' ? message : JSON.stringify( message )
  } ) );
  return response.MessageId;
};
