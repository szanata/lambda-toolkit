import { describe, it, mock, afterEach } from 'node:test';
import { strictEqual, deepStrictEqual, ok } from 'node:assert';
import { Agent } from 'node:https';

const constructorMock = mock.fn( () => ( {} ) );

mock.module( '@aws-sdk/client-timestream-write', {
  namedExports: {
    TimestreamWriteClient: new Proxy( class TimestreamWriteClient {}, {
      construct( _target, args ) {
        return constructorMock( ...args );
      }
    } ),
    WriteRecordsCommand: class {}
  }
} );

const cache = new Map();
mock.module( '../core/cache_storage.js', {
  namedExports: {
    CacheStorage: {
      get: key => cache.get( key ),
      set: ( key, value ) => cache.set( key, value )
    }
  }
} );

const { timestreamWrite } = await import( './index.js' );

const constructorArgs = () => constructorMock.mock.calls[0].arguments;

describe( 'Timestream Write Instance Contract', () => {
  afterEach( () => {
    cache.clear();
    constructorMock.mock.resetCalls();
  } );

  it( 'Singleton builds the client with the default config as the single argument', () => {
    timestreamWrite.getClient();

    strictEqual( constructorMock.mock.calls.length, 1 );
    strictEqual( constructorArgs().length, 1 );

    const [ config ] = constructorArgs();
    strictEqual( config.maxRetries, 10 );
    strictEqual( config.httpOptions.timeout, 60000 );
    ok( config.httpOptions.agent instanceof Agent );
  } );

  it( 'Factory merges the config object into the defaults as the single argument', () => {
    timestreamWrite( { region: 'us-east-1' } );

    strictEqual( constructorArgs().length, 1 );

    const [ config ] = constructorArgs();
    strictEqual( config.region, 'us-east-1' );
    strictEqual( config.maxRetries, 10 );
    strictEqual( config.httpOptions.timeout, 60000 );
  } );

  it( 'Factory config overrides the defaults', () => {
    timestreamWrite( { maxRetries: 3, httpOptions: { timeout: 1000 } } );

    const [ config ] = constructorArgs();
    strictEqual( config.maxRetries, 3 );
    deepStrictEqual( config.httpOptions, { timeout: 1000 } );
  } );

  it( 'Factory instances expose the same methods as the singleton', () => {
    const instance = timestreamWrite( { region: 'us-east-1' } );

    deepStrictEqual( Object.keys( instance ).sort(), [ 'getClient', 'writeRecords' ] );
  } );
} );
