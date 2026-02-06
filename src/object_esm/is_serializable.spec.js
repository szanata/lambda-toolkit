import { isSerializable } from './is_serializable.js';
import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

describe( 'Is Serializable', () => {
  it( 'Should return false for a Date', () => {
    const result = isSerializable( new Date() );
    strictEqual( result, false );
  } );

  it( 'Should return false for a Boolean', () => {
    const result = isSerializable( new Boolean() );
    strictEqual( result, false );
  } );

  it( 'Should return false for a Function', () => {
    const result = isSerializable( () => {} );
    strictEqual( result, false );
  } );

  it( 'Should return false for a String', () => {
    const result = isSerializable( new String( 'foo' ) );
    strictEqual( result, false );
  } );

  it( 'Should return false for a Number', () => {
    const result = isSerializable( new Number() );
    strictEqual( result, false );
  } );

  it( 'Should return false for a Date', () => {
    const result = isSerializable( new Date() );
    strictEqual( result, false );
  } );

  it( 'Should return false for a string', () => {
    const result = isSerializable( 'foo' );
    strictEqual( result, false );
  } );

  it( 'Should return false for a number', () => {
    const result = isSerializable( 1 );
    strictEqual( result, false );
  } );

  it( 'Should return false for a boolean', () => {
    const result = isSerializable( false );
    strictEqual( result, false );
  } );

  it( 'Should return false for a undefined', () => {
    const result = isSerializable( undefined );
    strictEqual( result, false );
  } );

  it( 'Should return false for a null', () => {
    const result = isSerializable( null );
    strictEqual( result, false );
  } );

  it( 'Should return true for a literal object */', () => {
    const result = isSerializable( { foo: 'bar' } );
    strictEqual( result, true );
  } );
} );
