import { LambdaApi } from './lambda_api.js';
import { Event } from './event.js';
import { describe, it } from 'node:test';
import { ok, partialDeepStrictEqual, strictEqual } from 'node:assert';

const awsEvent = {
  version: '2.0',
  requestContext: {
    http: {
      method: 'GET',
      path: '/'
    }
  }
};

class WellDefinedError extends Error {
  constructor() {
    super( 'This is a feature not a bug' );
  }
};

describe( 'Api Spec', () => {
  describe( 'Handler triggered', () => {
    it( 'Should handle an event using the registered async handler', async () => {
      const api = new LambdaApi();
      api.addHandler( {
        method: 'GET', fn: async _ => {
          const body = await Promise.resolve( 'Ok' );
          return [ 200, body ];
        }
      } );

      const result = await api.process( awsEvent );
      partialDeepStrictEqual( result, { statusCode: 200, body: 'Ok' } );
    } );

    it( 'Should handle an event using the registered sync handler', async () => {
      const api = new LambdaApi();
      api.addHandler( { method: 'GET', fn: _ => 200 } );

      const result = await api.process( awsEvent );

      partialDeepStrictEqual( result, { statusCode: 200 } );
    } );

    it( 'Should invoke just the first matching handler', async () => {
      const api = new LambdaApi();
      api.addHandler( { method: 'GET', fn: _ => 200 } );
      api.addHandler( { method: 'GET', fn: _ => 300 } );

      const result = await api.process( awsEvent );
      partialDeepStrictEqual( result, { statusCode: 200 } );
    } );

    it( 'Should append extra headers in the responses', async () => {
      const api = new LambdaApi( { headers: { 'X-Custom': 'Foo' } } );
      api.addHandler( {
        method: 'GET', fn: _ => 200
      } );

      const result = await api.process( awsEvent );
      partialDeepStrictEqual( result, {
        statusCode: 200,
        body: '',
        headers: {
          'X-Custom': 'Foo'
        }
      } );
    } );

    it( 'Should receive event as handler argument', async t => {
      const control = t.mock.fn();
      const api = new LambdaApi();
      api.addHandler( {
        method: 'GET', fn: event => {
          control( event );
          return 200;
        }
      } );

      const result = await api.process( awsEvent );
      partialDeepStrictEqual( result, { statusCode: 200 } );
      ok( control.mock.calls[0].arguments[0] instanceof Event );
    } );
  } );

  describe( 'Default error handling', () => {
    it( 'Should return HTTP 500 when async handler throws error', async () => {
      const api = new LambdaApi();
      api.addHandler( {
        method: 'GET', fn: async _ => {
          await ( async () => { throw new WellDefinedError(); } )();
          return 200;
        }
      } );

      const result = await api.process( awsEvent );
      partialDeepStrictEqual( result, { statusCode: 500, body: 'Internal Server Error' } );
    } );

    it( 'Should return HTTP 500 when sync handler throws error', async () => {
      const api = new LambdaApi();
      api.addHandler( { method: 'GET', fn: _ => { throw new WellDefinedError(); } } );

      const result = await api.process( awsEvent );
      partialDeepStrictEqual( result, { statusCode: 500, body: 'Internal Server Error' } );
    } );

    it( 'Should return HTTP 405 when no handler is matched', async () => {
      const api = new LambdaApi();
      api.addHandler( { method: 'POST', fn: _ => { throw new WellDefinedError(); } } );

      const result = await api.process( awsEvent );
      partialDeepStrictEqual( result, { statusCode: 405, body: 'Method Not Allowed' } );
    } );

    it( 'Should append extra headers in the responses', async () => {
      const api = new LambdaApi( { headers: { 'X-Custom': 'Foo' } } );
      api.addHandler( { method: 'GET', fn: _ => { throw new WellDefinedError(); } } );

      const result = await api.process( awsEvent );
      partialDeepStrictEqual( result, {
        statusCode: 500,
        body: 'Internal Server Error',
        headers: {
          'X-Custom': 'Foo'
        }
      } );
    } );
  } );

  describe( 'Custom error handling', () => {
    it( 'Should handle an error by its class and return a specific HTTP code', async () => {
      const api = new LambdaApi();
      api.addErrorHandler( { errorType: WellDefinedError, code: 413 } );
      api.addHandler( {
        method: 'GET', fn: async _ => {
          await Promise.reject( new WellDefinedError() );
          return 200;
        }
      } );

      const result = await api.process( awsEvent );
      partialDeepStrictEqual( result, { statusCode: 413, body: 'This is a feature not a bug' } );
    } );

    it( 'Should handle an error by its extended class and return a specific HTTP code', async () => {
      const api = new LambdaApi();
      api.addErrorHandler( { errorType: Error, code: 413 } );
      api.addHandler( {
        method: 'GET', fn: async _ => {
          await Promise.reject( new WellDefinedError() );
          return 200;
        }
      } );

      const result = await api.process( awsEvent );
      partialDeepStrictEqual( result, { statusCode: 413, body: 'This is a feature not a bug' } );
    } );

    it( 'Should respect the order of the error handlers when many match the error thrown', async () => {
      const api = new LambdaApi();
      api.addErrorHandler( { errorType: Error, code: 411 } );
      api.addErrorHandler( { errorType: Error, code: 413 } );
      api.addHandler( {
        method: 'GET', fn: async _ => {
          await Promise.reject( new WellDefinedError() );
          return 200;
        }
      } );

      const result = await api.process( awsEvent );
      partialDeepStrictEqual( result, { statusCode: 411, body: 'This is a feature not a bug' } );
    } );

    it( 'Should return registered HTTP code + message when handler throws expected error', async () => {
      const api = new LambdaApi();
      api.addErrorHandler( { errorType: WellDefinedError, code: 413, message: 'I\'m error' } );
      api.addHandler( {
        method: 'GET', fn: async _ => {
          await Promise.reject( new WellDefinedError() );
          return 200;
        }
      } );

      const result = await api.process( awsEvent );
      partialDeepStrictEqual( result, { statusCode: 413, body: 'I\'m error' } );
    } );
  } );

  describe( 'Hooks', () => {
    describe( 'If a handler is found', () => {
      it( 'Should execute the before hooks in order', async t => {
        const control = t.mock.fn();
        const api = new LambdaApi();
        api.addBeforeHook( { fn: _ => control( 1 ) } );
        api.addBeforeHook( { fn: _ => control( 2 ) } );
        api.addHandler( {
          method: 'GET', fn: _ => {
            control( 3 );
            return 200;
          }
        } );

        const result = await api.process( awsEvent );
        partialDeepStrictEqual( result, { statusCode: 200 } );
        strictEqual( control.mock.calls[0].arguments[0], 1 );
        strictEqual( control.mock.calls[1].arguments[0], 2 );
        strictEqual( control.mock.calls[2].arguments[0], 3 );
      } );

      it( 'Should execute the after hooks in order', async t => {
        const control = t.mock.fn();
        const api = new LambdaApi();
        api.addAfterHook( { fn: _ => control( 1 ) } );
        api.addAfterHook( { fn: _ => control( 2 ) } );
        api.addHandler( {
          method: 'GET', fn: _ => {
            control( 3 );
            return 200;
          }
        } );

        const result = await api.process( awsEvent );
        partialDeepStrictEqual( result, { statusCode: 200 } );
        strictEqual( control.mock.calls[0].arguments[0], 3 );
        strictEqual( control.mock.calls[1].arguments[0], 1 );
        strictEqual( control.mock.calls[2].arguments[0], 2 );
      } );

      it( 'Should share event.context between before hook, handler and after.hook', async t => {
        const control = t.mock.fn();
        const api = new LambdaApi();
        api.addBeforeHook( {
          fn: event => {
            event.context = 'before hook';
          }
        } );
        api.addAfterHook( {
          fn: event => {
            control( event.context );
          }
        } );
        api.addHandler( {
          method: 'GET', fn: event => {
            control( event.context );
            event.context = 'handler';
            return 200;
          }
        } );

        const result = await api.process( awsEvent );
        partialDeepStrictEqual( result, { statusCode: 200 } );
        strictEqual( control.mock.calls[0].arguments[0], 'before hook' );
        strictEqual( control.mock.calls[1].arguments[0], 'handler' );
      } );
    } );

    it( 'If no handler is match it should not execute hooks', async t => {
      const control = t.mock.fn();
      const api = new LambdaApi();
      api.addBeforeHook( { fn: _ => control( 1 ) } );
      api.addAfterHook( { fn: _ => control( 1 ) } );
      api.addHandler( { method: 'POST', fn: _ => { throw new WellDefinedError(); } } );

      const result = await api.process( awsEvent );
      partialDeepStrictEqual( result, { statusCode: 405, body: 'Method Not Allowed' } );
      strictEqual( control.mock.calls.length, 0 );
    } );
  } );
} );
