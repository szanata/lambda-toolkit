import { Validator } from './validator.js';
import { LambdaApiValidationError } from './lambda_api_validation_error.js';
import { describe, it } from 'node:test';
import { throws, doesNotThrow } from 'node:assert';

describe( 'Validator Spec', () => {
  describe( 'errorType', () => {
    it( 'Should allow a constructor', () => {
      doesNotThrow( _ => Validator.errorType( Error ) );
      doesNotThrow( _ => Validator.errorType( function x() {} ) );
    } );
    it( 'Should throw on other values', () => {
      throws( _ => Validator.errorType( 'foo' ), LambdaApiValidationError );
      throws( _ => Validator.errorType( {} ), LambdaApiValidationError );
      throws( _ => Validator.errorType( 1 ), LambdaApiValidationError );
      throws( _ => Validator.errorType( /a/ ), LambdaApiValidationError );
      throws( _ => Validator.errorType( true ), LambdaApiValidationError );
      throws( _ => Validator.errorType( [] ), LambdaApiValidationError );
      throws( _ => Validator.errorType( _ => {} ), LambdaApiValidationError );
      throws( _ => Validator.errorType( undefined ), LambdaApiValidationError );
      throws( _ => Validator.errorType( null ), LambdaApiValidationError );
    } );
  } );

  describe( 'fn', () => {
    it( 'Should allow a function', () => {
      doesNotThrow( _ => Validator.function( Error ) );
      doesNotThrow( _ => Validator.function( function x() {} ) );
      doesNotThrow( _ => Validator.function( _ => {} ) );
    } );
    it( 'Should throw on other values', () => {
      throws( _ => Validator.function( 'foo' ), LambdaApiValidationError );
      throws( _ => Validator.function( {} ), LambdaApiValidationError );
      throws( _ => Validator.function( 1 ), LambdaApiValidationError );
      throws( _ => Validator.function( /a/ ), LambdaApiValidationError );
      throws( _ => Validator.function( true ), LambdaApiValidationError );
      throws( _ => Validator.function( [] ), LambdaApiValidationError );
      throws( _ => Validator.function( undefined ), LambdaApiValidationError );
      throws( _ => Validator.function( null ), LambdaApiValidationError );
    } );
  } );

  describe( 'httpMethod', () => {
    it( 'Should allow know HTTP methods constructor', () => {
      doesNotThrow( _ => Validator.httpMethod( 'DELETE' ) );
      doesNotThrow( _ => Validator.httpMethod( 'GET' ) );
      doesNotThrow( _ => Validator.httpMethod( 'HEAD' ) );
      doesNotThrow( _ => Validator.httpMethod( 'PATCH' ) );
      doesNotThrow( _ => Validator.httpMethod( 'POST' ) );
      doesNotThrow( _ => Validator.httpMethod( 'PUT' ) );
    } );
    it( 'Should throw on other values', () => {
      throws( _ => Validator.errorType( 'get' ), LambdaApiValidationError );
      throws( _ => Validator.errorType( 'put' ), LambdaApiValidationError );
      throws( _ => Validator.errorType( Symbol.for( 'GET' ) ), LambdaApiValidationError );
      throws( _ => Validator.errorType( '' ), LambdaApiValidationError );
    } );
  } );

  const g1 = [ 'matcherPath', 'matcherPathIncludes', 'matcherPathNotIncludes', 'matcherRoute', 'matcherRouteIncludes', 'matcherRouteNotIncludes' ];
  for ( const fn of g1 ) {
    describe( fn, () => {
      it( 'Should allow undefined', () => {
        doesNotThrow( _ => Validator[fn]( undefined ) );
      } );

      it( 'Should a string', () => {
        doesNotThrow( _ => Validator[fn]( '/foo/bar' ) );
      } );

      it( 'Should not allow an empty string', () => {
        throws( _ => Validator[fn]( '' ), LambdaApiValidationError );
      } );

      it( 'Should throw on other values', () => {
        throws( _ => Validator[fn]( 1 ), LambdaApiValidationError );
        throws( _ => Validator[fn]( true ), LambdaApiValidationError );
        throws( _ => Validator[fn]( /a/ ), LambdaApiValidationError );
        throws( _ => Validator[fn]( null ), LambdaApiValidationError );
      } );
    } );
  }

  const g2 = [ 'matcherPathMatch', 'matcherRouteMatch' ];
  for ( const fn of g2 ) {
    describe( fn, () => {
      it( 'Should allow undefined', () => {
        doesNotThrow( _ => Validator[fn]( undefined ) );
      } );

      it( 'Should allow a RegExp', () => {
        doesNotThrow( _ => Validator[fn]( /foo/ ) );
        doesNotThrow( _ => Validator[fn]( new RegExp( 'foo' ) ) );
      } );

      it( 'Should throw on other values', () => {
        throws( _ => Validator[fn]( '/foo/bar/' ), LambdaApiValidationError );
        throws( _ => Validator[fn]( 1 ), LambdaApiValidationError );
        throws( _ => Validator[fn]( true ), LambdaApiValidationError );
        throws( _ => Validator[fn]( null ), LambdaApiValidationError );
      } );
    } );
  }

  const g3 = [ 'transformRequest', 'transformResponse' ];
  for ( const fn of g3 ) {
    describe( fn, () => {
      it( 'Should allow null', () => {
        doesNotThrow( _ => Validator[fn]( null ) );
      } );

      it( 'Should allow a false', () => {
        doesNotThrow( _ => Validator[fn]( false ) );
      } );

      it( 'Should allow snakecase', () => {
        doesNotThrow( _ => Validator[fn]( 'snakecase' ) );
      } );

      it( 'Should allow camelcase', () => {
        doesNotThrow( _ => Validator[fn]( 'camelcase' ) );
      } );

      it( 'Should throw on other values', () => {
        throws( _ => Validator[fn]( 'kebabcase' ), LambdaApiValidationError );
        throws( _ => Validator[fn]( undefined ), LambdaApiValidationError );
        throws( _ => Validator[fn]( true ), LambdaApiValidationError );
      } );
    } );
  }
} );
