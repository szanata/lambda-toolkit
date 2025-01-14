const { PublishCommand } = require( '@aws-sdk/client-sns' );

module.exports = async ( client, topic, message, args = {} ) => {
  const response = await client.send( new PublishCommand( {
    ...args,
    TopicArn: topic,
    Message: typeof message === 'string' ? message : JSON.stringify( message )
  } ) );
  return response.MessageId;
};
