import { Handler } from './handler.js';
import { LambdaApiValidationError } from './lambda_api_validation_error.js';
import { describe, it } from 'node:test';
import { ok, strictEqual, throws } from 'node:assert';

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
      ok( handler instanceof Handler );
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

      ok( handler instanceof Handler );
    } );

    it( 'Should validate the presence of method', () => {
      throws( _ => new Handler( { fn } ), LambdaApiValidationError );
    } );

    it( 'Should validate the presence of fn', () => {
      throws( _ => new Handler( { method: 'GET' } ), LambdaApiValidationError );
    } );

    it( 'Should expose the fn', () => {
      const handler = new Handler( { method: 'GET', fn } );

      strictEqual( handler.fn, fn );
    } );
  } );

  describe( 'Matcher', () => {
    it( 'Should match by "method"', () => {
      const handler = new Handler( { method: 'GET', fn } );
      ok( handler.match( event ) );
    } );

    it( 'Should not match by "method" if it is different', () => {
      const handler = new Handler( { method: 'POST', fn } );
      ok( !handler.match( event ) );
    } );

    describe( 'Route', () => {
      it( 'Should match by "method" and "route"', () => {
        const handler = new Handler( { method: 'GET', route: '/v1/colors/{color_name}', fn } );
        ok( handler.match( event ) );
      } );

      it( 'Should not match by "method" and "route" if the later is different', () => {
        const handler = new Handler( { method: 'GET', route: '/v2/colors/{color_name}', fn } );
        ok( !handler.match( event ) );
      } );

      it( 'Should match by "route" with precedence other matchers', () => {
        const h1 = new Handler( { method: 'GET', route: '/v1/colors/{color_name}', routeIncludes: 'v2', fn } );
        ok( h1.match( event ) );
        const h2 = new Handler( { method: 'GET', route: '/v1/colors/{color_name}', routeNotIncludes: 'v1', fn } );
        ok( h2.match( event ) );
        const h3 = new Handler( { method: 'GET', route: '/v1/colors/{color_name}', routeMatches: /v2/, fn } );
        ok( h3.match( event ) );
      } );

      it( 'Should match by "method" and "routeIncludes"', () => {
        const handler = new Handler( { method: 'GET', routeIncludes: 'v1', fn } );
        ok( handler.match( event ) );
      } );

      it( 'Should not match by "method" and "routeIncludes" if the later is different', () => {
        const handler = new Handler( { method: 'GET', routeIncludes: 'v2', fn } );
        ok( !handler.match( event ) );
      } );

      it( 'Should match by "method" and "routeNotIncludes"', () => {
        const handler = new Handler( { method: 'GET', routeNotIncludes: 'v2', fn } );
        ok( handler.match( event ) );
      } );

      it( 'Should not match by "method" and "routeNotIncludes" if the later is different', () => {
        const handler = new Handler( { method: 'GET', routeNotIncludes: 'v1', fn } );
        ok( !handler.match( event ) );
      } );

      it( 'Should match by "method" and "routeMatches"', () => {
        const handler = new Handler( { method: 'GET', routeMatches: /v1/, fn } );
        ok( handler.match( event ) );
      } );

      it( 'Should not match by "method" and "routeMatches" if the later is different', () => {
        const handler = new Handler( { method: 'GET', routeMatches: /v2/, fn } );
        ok( !handler.match( event ) );
      } );
    } );

    describe( 'Path', () => {
      it( 'Should match by "method" and "path"', () => {
        const handler = new Handler( { method: 'GET', path: '/v1/colors/red', fn } );
        ok( handler.match( event ) );
      } );

      it( 'Should not match by "method" and "path" if the later is different', () => {
        const handler = new Handler( { method: 'GET', path: '/v2/colors/red', fn } );
        ok( !handler.match( event ) );
      } );

      it( 'Should match by "path" with precedence over other matchers', () => {
        const h1 = new Handler( { method: 'GET', path: '/v1/colors/red', pathIncludes: 'blue', fn } );
        ok( h1.match( event ) );
        const h2 = new Handler( { method: 'GET', path: '/v1/colors/red', pathNotIncludes: 'red', fn } );
        ok( h2.match( event ) );
        const h3 = new Handler( { method: 'GET', path: '/v1/colors/red', pathMatches: /blue/, fn } );
        ok( h3.match( event ) );
      } );

      it( 'Should match by "method" and "pathIncludes"', () => {
        const handler = new Handler( { method: 'GET', pathIncludes: 'v1', fn } );
        ok( handler.match( event ) );
      } );

      it( 'Should not match by "method" and "pathIncludes" if the later is different', () => {
        const handler = new Handler( { method: 'GET', pathIncludes: 'v2', fn } );
        ok( !handler.match( event ) );
      } );

      it( 'Should match by "method" and "pathNotIncludes"', () => {
        const handler = new Handler( { method: 'GET', pathNotIncludes: 'v2', fn } );
        ok( handler.match( event ) );
      } );

      it( 'Should not match by "method" and "pathNotIncludes" if the later is different', () => {
        const handler = new Handler( { method: 'GET', pathNotIncludes: 'v1', fn } );
        ok( !handler.match( event ) );
      } );

      it( 'Should match by "method" and "pathMatches"', () => {
        const handler = new Handler( { method: 'GET', pathMatches: /v1/, fn } );
        ok( handler.match( event ) );
      } );

      it( 'Should not match by "method" and "pathMatches" if the later is different', () => {
        const handler = new Handler( { method: 'GET', pathMatches: /v2/, fn } );
        ok( !handler.match( event ) );
      } );
    } );
  } );
} );
