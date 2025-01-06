const validators = require( './validators' );

module.exports = class Handler {
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
    validators.httpMethod( method );
    validators.function( fn );
    validators.matcherRoute( matchers.route );
    validators.matcherRouteIncludes( matchers.routeIncludes );
    validators.matcherRouteNotIncludes( matchers.routeNotIncludes );
    validators.matcherRouteMatch( matchers.routeMatch );
    validators.matcherPath( matchers.path );
    validators.matcherPathIncludes( matchers.pathIncludes );
    validators.matcherPathNotIncludes( matchers.pathNotIncludes );
    validators.matcherPathMatch( matchers.pathMatch );

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
