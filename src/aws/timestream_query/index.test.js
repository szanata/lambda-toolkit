import { describe, it, mock, afterEach } from 'node:test';
import { strictEqual, deepStrictEqual, ok } from 'node:assert';
import { Agent } from 'node:https';

const client = { id: 'client' };
const providerMock = mock.fn( () => client );

mock.module( '@aws-sdk/client-timestream-query', {
  namedExports: {
    TimestreamQueryClient: class TimestreamQueryClient {},
    QueryCommand: class {},
    ScalarType: {}
  }
} );

mock.module( '../core/generic_client_provider.js', {
  namedExports: { genericClientProvider: providerMock }
} );

const { TimestreamQueryClient } = await import( '@aws-sdk/client-timestream-query' );
const { timestreamQuery } = await import( './index.js' );

const providerArgs = () => providerMock.mock.calls[0].arguments;

describe( 'Timestream Query Args', () => {
  afterEach( () => {
    mock.reset();
    providerMock.mock.resetCalls();
  } );

  it( 'Singleton calls the provider with the client and the default config', () => {
    timestreamQuery.getClient();

    strictEqual( providerMock.mock.calls.length, 1 );

    const [ constructor, config, ...rest ] = providerArgs();
    strictEqual( constructor, TimestreamQueryClient );
    strictEqual( rest.length, 0 );
    strictEqual( config.maxRetries, 10 );
    strictEqual( config.httpOptions.timeout, 60000 );
    ok( config.httpOptions.agent instanceof Agent );
  } );

  it( 'Factory merges the given config into the defaults', () => {
    timestreamQuery( { region: 'us-east-1' } );

    const [ , config, ...rest ] = providerArgs();
    strictEqual( rest.length, 0 );
    strictEqual( config.region, 'us-east-1' );
    strictEqual( config.maxRetries, 10 );
    strictEqual( config.httpOptions.timeout, 60000 );
  } );

  it( 'Factory config overrides the defaults', () => {
    timestreamQuery( { maxRetries: 3, httpOptions: { timeout: 1000 } } );

    const [ , config ] = providerArgs();
    strictEqual( config.maxRetries, 3 );
    deepStrictEqual( config.httpOptions, { timeout: 1000 } );
  } );

  it( 'Factory called with the deprecated array syntax still merges the config', () => {
    const warn = mock.method( console, 'warn', () => {} );
    timestreamQuery( [ { region: 'us-east-1' } ] );

    const [ , config, ...rest ] = providerArgs();
    strictEqual( rest.length, 0 );
    strictEqual( config.region, 'us-east-1' );
    strictEqual( config.maxRetries, 10 );
    strictEqual( '0' in config, false );
    strictEqual( warn.mock.calls.length, 1 );
  } );
} );
