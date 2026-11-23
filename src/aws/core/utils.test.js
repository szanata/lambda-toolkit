import { describe, it, mock, afterEach } from 'node:test';
import { deepStrictEqual, strictEqual, ok } from 'node:assert';
import { unwrapOldNativeArgsSyntax } from './utils.js';

describe( 'unwrapOldNativeArgsSyntax', () => {
  afterEach( () => {
    mock.reset();
  } );

  it( 'Unwraps a single array argument and warns with the factory name', () => {
    const warn = mock.method( console, 'warn', () => {} );
    const result = unwrapOldNativeArgsSyntax( [ [ { region: 'us-east-1' } ] ], 'MockClient' );

    deepStrictEqual( result, [ { region: 'us-east-1' } ] );
    strictEqual( warn.mock.calls.length, 1 );
    ok( warn.mock.calls[0].arguments[0].includes( 'MockClient' ) );
  } );

  it( 'Returns the args untouched and does not warn when not using the array syntax', () => {
    const warn = mock.method( console, 'warn', () => {} );

    deepStrictEqual( unwrapOldNativeArgsSyntax( [ { region: 'us-east-1' } ], 'MockClient' ), [ { region: 'us-east-1' } ] );
    deepStrictEqual( unwrapOldNativeArgsSyntax( [], 'MockClient' ), [] );
    deepStrictEqual( unwrapOldNativeArgsSyntax( [ 1, 2 ], 'MockClient' ), [ 1, 2 ] );
    deepStrictEqual( unwrapOldNativeArgsSyntax( [ [] ], 'MockClient' ), [ [] ] );
    deepStrictEqual( unwrapOldNativeArgsSyntax( [ [ {} ], 'extra' ], 'MockClient' ), [ [ {} ], 'extra' ] );
    strictEqual( warn.mock.calls.length, 0 );
  } );

  it( 'Does not throw on nullish args', () => {
    strictEqual( unwrapOldNativeArgsSyntax( null, 'MockClient' ), null );
    strictEqual( unwrapOldNativeArgsSyntax( undefined, 'MockClient' ), undefined );
  } );
} );
