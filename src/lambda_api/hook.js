const validators = require( './validators' );

module.exports = class Hook {
  #fn;

  constructor( { fn } ) {
    validators.function( fn );
    this.#fn = fn;
  }

  get fn() { return this.#fn; }
};
