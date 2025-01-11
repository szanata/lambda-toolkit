const cache = require( './cache_storage' );

describe( 'Cache Spec', () => {
  it( 'Should set a value to cache hashing the key', () => {
    cache.set( '1', 'bar' );
    expect( global[Symbol.for( 'cache' )][Symbol.for( 'c4ca4238a0b923820dcc509a6f75849b' )] ).toBe( 'bar' );
  } );

  it( 'Should get null if key is not on cache', () => {
    const result = cache.get( '2' );
    expect( result ).toBe( undefined );
  } );

  it( 'Should return a vaklue from cache', () => {
    cache.set( '3', 'bar' );
    const result = cache.get( '3' );
    expect( result ).toBe( 'bar' );
  } );
} );
