const Handler = require( './handler' );
const LambdaApiValidationError = require( './lambda_api_validation_error' );

const event = {
  method: 'GET',
  path: '/v1/colors/red',
  route: '/v1/colors/{color_name}'
};

const fn = () => 1;

describe( 'Handler Spec', () => {
  describe( 'Declaration', () => {
    it( 'Should create a handler with only "method" and "fn"', () => {
      const handler = new Handler( { method: 'GET', fn } );
      expect( handler ).toBeInstanceOf( Handler );
    } );

    it( 'Should create a handler with all possible matchers', () => {
      const handler = new Handler( {
        method: 'GET',
        fn,
        route: '/a/',
        routeIncludes: '/a/',
        routeNotIncludes: '/a/',
        routeMatches: /\/a\//,
        path: '/a/',
        pathIncludes: '/a/',
        pathNotIncludes: '/a/',
        pathMatches: /\/a\//
      } );

      expect( handler ).toBeInstanceOf( Handler );
    } );

    it( 'Should validate the presence of method', () => {
      expect( _ => new Handler( { fn } ) ).toThrow( LambdaApiValidationError );
    } );

    it( 'Should validate the presence of fn', () => {
      expect( _ => new Handler( { method: 'GET' } ) ).toThrow( LambdaApiValidationError );
    } );

    it( 'Should expose the fn', () => {
      const handler = new Handler( { method: 'GET', fn } );

      expect( handler.fn ).toEqual( fn );
    } );
  } );

  describe( 'Matcher', () => {
    it( 'Should match by "method"', () => {
      const handler = new Handler( { method: 'GET', fn } );
      expect( handler.match( event ) ).toBe( true );
    } );

    it( 'Should not match by "method" if it is different', () => {
      const handler = new Handler( { method: 'POST', fn } );
      expect( handler.match( event ) ).toBe( false );
    } );

    describe( 'Route', () => {
      it( 'Should match by "method" and "route"', () => {
        const handler = new Handler( { method: 'GET', route: '/v1/colors/{color_name}', fn } );
        expect( handler.match( event ) ).toBe( true );
      } );

      it( 'Should not match by "method" and "route" if the later is different', () => {
        const handler = new Handler( { method: 'GET', route: '/v2/colors/{color_name}', fn } );
        expect( handler.match( event ) ).toBe( false );
      } );

      it( 'Should match by "route" with precedence other matchers', () => {
        const h1 = new Handler( { method: 'GET', route: '/v1/colors/{color_name}', routeIncludes: 'v2', fn } );
        expect( h1.match( event ) ).toBe( true );
        const h2 = new Handler( { method: 'GET', route: '/v1/colors/{color_name}', routeNotIncludes: 'v1', fn } );
        expect( h2.match( event ) ).toBe( true );
        const h3 = new Handler( { method: 'GET', route: '/v1/colors/{color_name}', routeMatches: /v2/, fn } );
        expect( h3.match( event ) ).toBe( true );
      } );

      it( 'Should match by "method" and "routeIncludes"', () => {
        const handler = new Handler( { method: 'GET', routeIncludes: 'v1', fn } );
        expect( handler.match( event ) ).toBe( true );
      } );

      it( 'Should not match by "method" and "routeIncludes" if the later is different', () => {
        const handler = new Handler( { method: 'GET', routeIncludes: 'v2', fn } );
        expect( handler.match( event ) ).toBe( false );
      } );

      it( 'Should match by "method" and "routeNotIncludes"', () => {
        const handler = new Handler( { method: 'GET', routeNotIncludes: 'v2', fn } );
        expect( handler.match( event ) ).toBe( true );
      } );

      it( 'Should not match by "method" and "routeNotIncludes" if the later is different', () => {
        const handler = new Handler( { method: 'GET', routeNotIncludes: 'v1', fn } );
        expect( handler.match( event ) ).toBe( false );
      } );

      it( 'Should match by "method" and "routeMatches"', () => {
        const handler = new Handler( { method: 'GET', routeMatches: /v1/, fn } );
        expect( handler.match( event ) ).toBe( true );
      } );

      it( 'Should not match by "method" and "routeMatches" if the later is different', () => {
        const handler = new Handler( { method: 'GET', routeMatches: /v2/, fn } );
        expect( handler.match( event ) ).toBe( false );
      } );
    } );

    describe( 'Path', () => {
      it( 'Should match by "method" and "path"', () => {
        const handler = new Handler( { method: 'GET', path: '/v1/colors/red', fn } );
        expect( handler.match( event ) ).toBe( true );
      } );

      it( 'Should not match by "method" and "path" if the later is different', () => {
        const handler = new Handler( { method: 'GET', path: '/v2/colors/red', fn } );
        expect( handler.match( event ) ).toBe( false );
      } );

      it( 'Should match by "path" with precedence over other matchers', () => {
        const h1 = new Handler( { method: 'GET', path: '/v1/colors/red', pathIncludes: 'blue', fn } );
        expect( h1.match( event ) ).toBe( true );
        const h2 = new Handler( { method: 'GET', path: '/v1/colors/red', pathNotIncludes: 'red', fn } );
        expect( h2.match( event ) ).toBe( true );
        const h3 = new Handler( { method: 'GET', path: '/v1/colors/red', pathMatches: /blue/, fn } );
        expect( h3.match( event ) ).toBe( true );
      } );

      it( 'Should match by "method" and "pathIncludes"', () => {
        const handler = new Handler( { method: 'GET', pathIncludes: 'v1', fn } );
        expect( handler.match( event ) ).toBe( true );
      } );

      it( 'Should not match by "method" and "pathIncludes" if the later is different', () => {
        const handler = new Handler( { method: 'GET', pathIncludes: 'v2', fn } );
        expect( handler.match( event ) ).toBe( false );
      } );

      it( 'Should match by "method" and "pathNotIncludes"', () => {
        const handler = new Handler( { method: 'GET', pathNotIncludes: 'v2', fn } );
        expect( handler.match( event ) ).toBe( true );
      } );

      it( 'Should not match by "method" and "pathNotIncludes" if the later is different', () => {
        const handler = new Handler( { method: 'GET', pathNotIncludes: 'v1', fn } );
        expect( handler.match( event ) ).toBe( false );
      } );

      it( 'Should match by "method" and "pathMatches"', () => {
        const handler = new Handler( { method: 'GET', pathMatches: /v1/, fn } );
        expect( handler.match( event ) ).toBe( true );
      } );

      it( 'Should not match by "method" and "pathMatches" if the later is different', () => {
        const handler = new Handler( { method: 'GET', pathMatches: /v2/, fn } );
        expect( handler.match( event ) ).toBe( false );
      } );
    } );
  } );
} );
