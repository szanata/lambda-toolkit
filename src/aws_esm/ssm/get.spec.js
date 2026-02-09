import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import { strictEqual, deepStrictEqual, rejects } from 'node:assert';

const cacheStorageMock = {
  set: mock.fn(),
  get: mock.fn()
};

mock.module( '../core/cache_storage.js', {
  namedExports: { CacheStorage: cacheStorageMock }
} );

const commandInstance = {};
const constructorMock = mock.fn( () => commandInstance );

mock.module( '@aws-sdk/client-ssm', {
  namedExports: {
    GetParameterCommand: new Proxy( class GetParameterCommand {}, {
      construct( _, args ) {
        return constructorMock( ...args );
      }
    } )
  }
} );

const { get } = await import( './get.js' );

const client = { send: mock.fn() };
const name = 'key';
const value = 'value';
const cacheKey = 'SSM_key';

describe( 'SSM Get Spec', () => {
  beforeEach( () => {
    constructorMock.mock.mockImplementation( () => commandInstance );
  } );

  afterEach( () => {
    strictEqual( cacheStorageMock.get.mock.calls.length, 1 );
    strictEqual( cacheStorageMock.get.mock.calls[0].arguments[0], cacheKey );

    mock.restoreAll();
    client.send.mock.resetCalls();
    cacheStorageMock.set.mock.resetCalls();
    cacheStorageMock.get.mock.resetCalls();
    constructorMock.mock.resetCalls();
  } );

  it( 'Should get a parameter from storage and return it, storing to cache', async () => {
    client.send.mock.mockImplementation( () => ( { Parameter: { Value: value } } ) );

    const result = await get( client, name );

    strictEqual( result, value );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], { Name: name, WithDecryption: true } );
    strictEqual( client.send.mock.calls.length, 1 );
    strictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
    strictEqual( cacheStorageMock.set.mock.calls.length, 1 );
    deepStrictEqual( cacheStorageMock.set.mock.calls[0].arguments, [ cacheKey, value ] );
  } );

  it( 'Should return from cache if it is there', async () => {
    cacheStorageMock.get.mock.mockImplementation( () => value );

    const result = await get( client, name );

    strictEqual( result, value );
    strictEqual( client.send.mock.calls.length, 0 );
    strictEqual( constructorMock.mock.calls.length, 0 );
  } );

  it( 'Should return null on parameter not found', async () => {
    class ParameterNotFound extends Error {
      constructor() {
        super( 'UnknownError' );
        this.name = 'ParameterNotFound';
      }
    }

    const error = new ParameterNotFound();
    client.send.mock.mockImplementation( () => { throw error; } );

    const result = await get( client, name );

    strictEqual( result, null );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], { Name: name, WithDecryption: true } );
    strictEqual( client.send.mock.calls.length, 1 );
    strictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
    strictEqual( cacheStorageMock.set.mock.calls.length, 0 );
  } );

  it( 'Should throw other errors', async () => {
    const error = new Error();
    client.send.mock.mockImplementation( () => { throw error; } );

    rejects( async () => get( client, name ), error );

    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], { Name: name, WithDecryption: true } );
    strictEqual( client.send.mock.calls.length, 1 );
    strictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
    strictEqual( cacheStorageMock.set.mock.calls.length, 0 );
  } );
} );
