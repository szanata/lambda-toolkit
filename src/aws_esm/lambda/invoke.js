import { InvokeCommand } from '@aws-sdk/client-lambda';
import { LambdaError } from './lambda_error.js';

export const invoke = async ( client, name, payload = {}, type = 'RequestResponse' ) => {
  const response = await client.send( new InvokeCommand( {
    FunctionName: name,
    InvocationType: type,
    Payload: Buffer.from( JSON.stringify( payload ) )
  } ) );

  if ( response.FunctionError ) {
    throw new LambdaError( response );
  }

  if ( type !== 'RequestResponse' ) { return true; }

  try {
    return JSON.parse( Buffer.from( response.Payload ).toString() );
  } catch {
    return response.Payload;
  }
};
