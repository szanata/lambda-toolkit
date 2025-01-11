const { InvokeCommand } = require( '@aws-sdk/client-lambda' );
const AWSLambdaError = require( './lambda_error' );

module.exports = async ( client, name, payload = {}, type = 'RequestResponse' ) => {
  const response = await client.send( new InvokeCommand( {
    FunctionName: name,
    InvocationType: type,
    Payload: Buffer.from( JSON.stringify( payload ) )
  } ) );

  if ( response.FunctionError ) {
    throw new AWSLambdaError( response );
  }

  if ( type !== 'RequestResponse' ) { return true; }

  try {
    return JSON.parse( Buffer.from( response.Payload ).toString() );
  } catch {
    return response.Payload;
  }
};
