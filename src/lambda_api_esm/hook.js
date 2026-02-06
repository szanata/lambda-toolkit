import { Validator } from './validator.js';

export class Hook {
  #fn;

  constructor( { fn } ) {
    Validator.function( fn );
    this.#fn = fn;
  }

  get fn() { return this.#fn; }
};
