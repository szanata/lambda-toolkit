import { Validator } from './validator.js';

export class Handler {
  #method;
  #fn;
  #route;
  #routeIncludes;
  #routeNotIncludes;
  #routeMatches;
  #path;
  #pathIncludes;
  #pathNotIncludes;
  #pathMatches;

  constructor( { method, fn, ...matchers } ) {
    Validator.httpMethod( method );
    Validator.function( fn );
    Validator.matcherRoute( matchers.route );
    Validator.matcherRouteIncludes( matchers.routeIncludes );
    Validator.matcherRouteNotIncludes( matchers.routeNotIncludes );
    Validator.matcherRouteMatch( matchers.routeMatch );
    Validator.matcherPath( matchers.path );
    Validator.matcherPathIncludes( matchers.pathIncludes );
    Validator.matcherPathNotIncludes( matchers.pathNotIncludes );
    Validator.matcherPathMatch( matchers.pathMatch );

    this.#method = method;
    this.#fn = fn;
    this.#route = matchers.route;
    this.#routeIncludes = matchers.routeIncludes;
    this.#routeNotIncludes = matchers.routeNotIncludes;
    this.#routeMatches = matchers.routeMatches;
    this.#path = matchers.path;
    this.#pathIncludes = matchers.pathIncludes;
    this.#pathNotIncludes = matchers.pathNotIncludes;
    this.#pathMatches = matchers.pathMatches;
  }

  match( event ) {
    if ( this.#method !== event.method ) {
      return false;
    }
    if ( this.#route ) {
      return this.#route === event.route;
    }
    if ( this.#path ) {
      return this.#path === event.path;
    }
    if ( this.#routeIncludes && !event.route.includes( this.#routeIncludes ) ) {
      return false;
    }
    if ( this.#routeNotIncludes && event.route.includes( this.#routeNotIncludes ) ) {
      return false;
    }
    if ( this.#routeMatches && !this.#routeMatches.test( event.route ) ) {
      return false;
    }
    if ( this.#pathIncludes && !event.path.includes( this.#pathIncludes ) ) {
      return false;
    }
    if ( this.#pathNotIncludes && event.path.includes( this.#pathNotIncludes ) ) {
      return false;
    }
    if ( this.#pathMatches && !this.#pathMatches.test( event.path ) ) {
      return false;
    }
    return true;
  }

  get fn() { return this.#fn; }
};
