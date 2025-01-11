module.exports = {
  encode: k => {
    if ( k === null || k === undefined ) { return k; }

    return Buffer.from( JSON.stringify( k ) ).toString( 'base64' );
  },
  decode: k => {
    if ( k === null || k === undefined ) { return k; }

    const result = Buffer.from( k, 'base64' ).toString( 'utf8' );
    try {
      return JSON.parse( result );
    } catch {
      return result;
    }
  }
};
