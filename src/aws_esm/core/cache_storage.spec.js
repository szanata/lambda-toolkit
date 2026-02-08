import { CacheStorage } from './cache_storage.js';
import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

describe( 'Cache Spec', () => {
  it( 'Should set a value to cache hashing the key', () => {
    CacheStorage.set( '1', 'bar' );
    strictEqual( global[Symbol.for( 'cache' )][Symbol.for( 'c4ca4238a0b923820dcc509a6f75849b' )], 'bar' );
  } );

  it( 'Should get null if key is not on cache', () => {
    const result = CacheStorage.get( '2' );
    strictEqual( result, undefined );
  } );

  it( 'Should return a vaklue from cache', () => {
    CacheStorage.set( '3', 'bar' );
    const result = CacheStorage.get( '3' );
    strictEqual( result, 'bar' );
  } );
} );
