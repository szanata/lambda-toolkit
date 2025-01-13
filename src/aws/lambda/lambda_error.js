const parsePayload = payload => {
  try {
    return JSON.parse( Buffer.from( payload ).toString( 'utf-8' ) );
  } catch {
    return null;
  }
};

module.exports = class LambdaError extends Error {
  constructor( response ) {
    const { StatusCode: statusCode, Payload: rawPayload } = response;
    const payload = parsePayload( rawPayload );
    const lambdaErrorType = payload?.errorType ?? Error.name;
    const lambdaErrorMessage = payload?.errorMessage;
    if ( statusCode === 200 ) {
      super( `Invoked function threw "[${lambdaErrorType}]${lambdaErrorMessage ? ' ' + lambdaErrorMessage : ''}"` );
    } else {
      super( 'Error invoking the function' );
    }
    this.statusCode = statusCode;
    this.lambdaErrorType = lambdaErrorType;
    this.lambdaErrorMessage = lambdaErrorMessage;
  }
};
