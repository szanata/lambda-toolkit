import { describe, it, mock, afterEach } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';

const cacheStorageMock = {
  set: mock.fn(),
  get: mock.fn()
};

mock.module( './cache_storage.js', {
  namedExports: { CacheStorage: cacheStorageMock }
} );

const { genericClientProvider } = await import( './generic_client_provider.js' );

const instance = { prop: 'I\'m an instance' };
const constructorMock = mock.fn( () => instance );

const ProxiedMockClass = new Proxy( class MockClass {}, {
  construct( _target, args ) {
    return constructorMock( ...args );
  }
} );

describe( 'Generic Client Provider', () => {
  afterEach( () => {
    mock.reset();
    cacheStorageMock.set.mock.resetCalls();
    cacheStorageMock.get.mock.resetCalls();
    constructorMock.mock.resetCalls();
  } );

  it( 'Should return from cache if present', () => {
    cacheStorageMock.get.mock.mockImplementation( () => 'cache-value' );

    const result = genericClientProvider( ProxiedMockClass );

    strictEqual( result, 'cache-value' );
    strictEqual( cacheStorageMock.get.mock.calls[0].arguments[0], 'MockClass()' );
    strictEqual( cacheStorageMock.set.mock.calls.length, 0 );
    strictEqual( constructorMock.mock.calls.length, 0 );
  } );

  describe( 'If not on cache', () => {
    it( 'Should initialize constructor without arguments and save to cache', () => {
      const result = genericClientProvider( ProxiedMockClass );

      strictEqual( result, instance );
      strictEqual( cacheStorageMock.get.mock.calls[0].arguments[0], 'MockClass()' );
      deepStrictEqual( cacheStorageMock.set.mock.calls[0].arguments, [ 'MockClass()', instance ] );
      strictEqual( constructorMock.mock.calls.length, 1 );
    } );

    it( 'Should initialize constructor with arguments and save to cache', () => {
      const args = [ { option: 'none' }, 2, '3' ];

      const result = genericClientProvider( ProxiedMockClass, args );

      const key = 'MockClass({"option":"none"},2,"3")';
      strictEqual( result, instance );
      strictEqual( cacheStorageMock.get.mock.calls[0].arguments[0], key );
      deepStrictEqual( cacheStorageMock.set.mock.calls[0].arguments, [ key, instance ] );
      deepStrictEqual( constructorMock.mock.calls[0].arguments, args );
    } );
  } );
} );
