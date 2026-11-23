import { describe, it, mock, afterEach } from 'node:test';
import { strictEqual, deepStrictEqual, notStrictEqual } from 'node:assert';

const cache = new Map();
mock.module( './cache_storage.js', {
  namedExports: {
    CacheStorage: {
      get: key => cache.get( key ),
      set: ( key, value ) => cache.set( key, value )
    }
  }
} );

const { genericClientProvider } = await import( './generic_client_provider.js' );
const { createInstance } = await import( './create_instance.js' );

const constructorMock = mock.fn( () => ( {} ) );

// Stands in for any AWS SDK client; mirrors how every service module wires its provider
const FakeClient = new Proxy( class FakeClient {}, {
  construct( _target, args ) {
    return constructorMock( ...args );
  }
} );

const methods = {
  foo: ( client, ...args ) => ( { client, args } ),
  bar: client => client
};

const service = createInstance( genericClientProvider.bind( null, FakeClient ), methods );

describe( 'Client Instance Contract', () => {
  afterEach( () => {
    cache.clear();
    constructorMock.mock.resetCalls();
  } );

  describe( 'Singleton', () => {
    it( 'Builds the client with no constructor arguments', () => {
      service.getClient();

      strictEqual( constructorMock.mock.calls.length, 1 );
      deepStrictEqual( constructorMock.mock.calls[0].arguments, [] );
    } );

    it( 'Methods receive the cached singleton client', () => {
      const client = service.getClient();

      strictEqual( service.foo().client, client );
      strictEqual( service.bar(), client );
      strictEqual( constructorMock.mock.calls.length, 1 );
    } );
  } );

  describe( 'Factory', () => {
    it( 'Passes the config object directly as the single constructor argument', () => {
      const config = { region: 'us-east-1', endpoint: 'http://localhost:4566' };

      const instance = service( config );

      strictEqual( constructorMock.mock.calls.length, 1 );
      deepStrictEqual( constructorMock.mock.calls[0].arguments, [ config ] );
      strictEqual( instance.getClient(), constructorMock.mock.calls[0].result );
    } );

    it( 'Exposes the same methods as the singleton, bound to the factory client', () => {
      const instance = service( { region: 'us-east-1' } );

      deepStrictEqual( Object.keys( instance ).sort(), [ 'bar', 'foo', 'getClient' ] );
      strictEqual( instance.foo().client, instance.getClient() );
      deepStrictEqual( instance.foo( 1, 2 ).args, [ 1, 2 ] );
    } );

    it( 'Reuses the cached client for the same config and builds a new one for a different config', () => {
      const first = service( { region: 'us-east-1' } ).getClient();
      const same = service( { region: 'us-east-1' } ).getClient();
      const other = service( { region: 'eu-west-1' } ).getClient();

      strictEqual( constructorMock.mock.calls.length, 2 );
      strictEqual( first, same );
      notStrictEqual( first, other );
    } );

    it( 'Factory client is distinct from the singleton client', () => {
      const singleton = service.getClient();
      const instance = service( { region: 'us-east-1' } ).getClient();

      notStrictEqual( singleton, instance );
      strictEqual( constructorMock.mock.calls.length, 2 );
    } );
  } );
} );
