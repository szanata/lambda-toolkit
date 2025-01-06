const { snakelize, camelize } = require( '../object' );
const charset = 'utf-8';

const transformFns = {
  camelcase: camelize,
  snakecase: snakelize
};

module.exports = class ApiResponse {
  #headers = null;
  #statusCode = null;
  #transformFn = false;
  #body = '';

  constructor( { headers = {}, transform } = {} ) {
    this.#transformFn = transformFns[transform] ?? ( v => v );
    this.#headers = Object.assign( {
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*'
    }, headers );
  }

  setContent( statusCode, body, headers = {} ) {
    this.#statusCode = statusCode;
    if ( body?.length === 0 || [ null, undefined ].includes( body ) ) {
      this.#body = '';
    } else if ( typeof body === 'object' ) {
      this.#body = JSON.stringify( this.#transformFn( body ) );
      this.#headers['Content-Type'] = `application/json; charset=${charset}`;
    } else {
      this.#body = String( body );
      this.#headers['Content-Type'] = `text/plain; charset=${charset}`;
    }
    this.#headers['Content-Length'] = this.#body.length;
    Object.assign( this.#headers, headers ?? {} );
    return this;
  }

  toJSON() {
    return {
      statusCode: this.#statusCode,
      body: this.#body,
      headers: this.#headers
    };
  }
};
