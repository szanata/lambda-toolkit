const validators = require( './validators' );
const LambdaApiValidationError = require( './lambda_api_validation_error' );

describe( 'Validators Spec', () => {
  describe( 'errorType', () => {
    it( 'Should allow a constructor', () => {
      expect( _ => validators.errorType( Error ) ).not.toThrow();
      expect( _ => validators.errorType( function x() {} ) ).not.toThrow();
    } );
    it( 'Should throw on other values', () => {
      expect( _ => validators.errorType( 'foo' ) ).toThrow( LambdaApiValidationError );
      expect( _ => validators.errorType( {} ) ).toThrow( LambdaApiValidationError );
      expect( _ => validators.errorType( 1 ) ).toThrow( LambdaApiValidationError );
      expect( _ => validators.errorType( /a/ ) ).toThrow( LambdaApiValidationError );
      expect( _ => validators.errorType( true ) ).toThrow( LambdaApiValidationError );
      expect( _ => validators.errorType( [] ) ).toThrow( LambdaApiValidationError );
      expect( _ => validators.errorType( _ => {} ) ).toThrow( LambdaApiValidationError );
      expect( _ => validators.errorType( undefined ) ).toThrow( LambdaApiValidationError );
      expect( _ => validators.errorType( null ) ).toThrow( LambdaApiValidationError );
    } );
  } );

  describe( 'fn', () => {
    it( 'Should allow a function', () => {
      expect( _ => validators.function( Error ) ).not.toThrow();
      expect( _ => validators.function( function x() {} ) ).not.toThrow();
      expect( _ => validators.function( _ => {} ) ).not.toThrow();
    } );
    it( 'Should throw on other values', () => {
      expect( _ => validators.function( 'foo' ) ).toThrow( LambdaApiValidationError );
      expect( _ => validators.function( {} ) ).toThrow( LambdaApiValidationError );
      expect( _ => validators.function( 1 ) ).toThrow( LambdaApiValidationError );
      expect( _ => validators.function( /a/ ) ).toThrow( LambdaApiValidationError );
      expect( _ => validators.function( true ) ).toThrow( LambdaApiValidationError );
      expect( _ => validators.function( [] ) ).toThrow( LambdaApiValidationError );
      expect( _ => validators.function( undefined ) ).toThrow( LambdaApiValidationError );
      expect( _ => validators.function( null ) ).toThrow( LambdaApiValidationError );
    } );
  } );

  describe( 'httpMethod', () => {
    it( 'Should allow know HTTP methods constructor', () => {
      expect( _ => validators.httpMethod( 'DELETE' ) ).not.toThrow();
      expect( _ => validators.httpMethod( 'GET' ) ).not.toThrow();
      expect( _ => validators.httpMethod( 'HEAD' ) ).not.toThrow();
      expect( _ => validators.httpMethod( 'PATCH' ) ).not.toThrow();
      expect( _ => validators.httpMethod( 'POST' ) ).not.toThrow();
      expect( _ => validators.httpMethod( 'PUT' ) ).not.toThrow();
    } );
    it( 'Should throw on other values', () => {
      expect( _ => validators.errorType( 'get' ) ).toThrow( LambdaApiValidationError );
      expect( _ => validators.errorType( 'put' ) ).toThrow( LambdaApiValidationError );
      expect( _ => validators.errorType( Symbol.for( 'GET' ) ) ).toThrow( LambdaApiValidationError );
      expect( _ => validators.errorType( '' ) ).toThrow( LambdaApiValidationError );
    } );
  } );

  const g1 = [ 'matcherPath', 'matcherPathIncludes', 'matcherPathNotIncludes', 'matcherRoute', 'matcherRouteIncludes', 'matcherRouteNotIncludes' ];
  for ( const fn of g1 ) {
    describe( fn, () => {
      it( 'Should allow undefined', () => {
        expect( _ => validators[fn]( undefined ) ).not.toThrow();
      } );

      it( 'Should a string', () => {
        expect( _ => validators[fn]( '/foo/bar' ) ).not.toThrow();
      } );

      it( 'Should not allow an empty string', () => {
        expect( _ => validators[fn]( '' ) ).toThrow( LambdaApiValidationError );
      } );

      it( 'Should throw on other values', () => {
        expect( _ => validators[fn]( 1 ) ).toThrow( LambdaApiValidationError );
        expect( _ => validators[fn]( true ) ).toThrow( LambdaApiValidationError );
        expect( _ => validators[fn]( /a/ ) ).toThrow( LambdaApiValidationError );
        expect( _ => validators[fn]( null ) ).toThrow( LambdaApiValidationError );
      } );
    } );
  }

  const g2 = [ 'matcherPathMatch', 'matcherRouteMatch' ];
  for ( const fn of g2 ) {
    describe( fn, () => {
      it( 'Should allow undefined', () => {
        expect( _ => validators[fn]( undefined ) ).not.toThrow();
      } );

      it( 'Should allow a RegExp', () => {
        expect( _ => validators[fn]( /foo/ ) ).not.toThrow();
        expect( _ => validators[fn]( new RegExp( 'foo' ) ) ).not.toThrow();
      } );

      it( 'Should throw on other values', () => {
        expect( _ => validators[fn]( '/foo/bar/' ) ).toThrow( LambdaApiValidationError );
        expect( _ => validators[fn]( 1 ) ).toThrow( LambdaApiValidationError );
        expect( _ => validators[fn]( true ) ).toThrow( LambdaApiValidationError );
        expect( _ => validators[fn]( null ) ).toThrow( LambdaApiValidationError );
      } );
    } );
  }

  const g3 = [ 'transformRequest', 'transformResponse' ];
  for ( const fn of g3 ) {
    describe( fn, () => {
      it( 'Should allow null', () => {
        expect( _ => validators[fn]( null ) ).not.toThrow();
      } );

      it( 'Should allow a false', () => {
        expect( _ => validators[fn]( false ) ).not.toThrow();
      } );

      it( 'Should allow snakecase', () => {
        expect( _ => validators[fn]( 'snakecase' ) ).not.toThrow();
      } );

      it( 'Should allow camelcase', () => {
        expect( _ => validators[fn]( 'camelcase' ) ).not.toThrow();
      } );

      it( 'Should throw on other values', () => {
        expect( _ => validators[fn]( 'kebabcase' ) ).toThrow( LambdaApiValidationError );
        expect( _ => validators[fn]( undefined ) ).toThrow( LambdaApiValidationError );
        expect( _ => validators[fn]( true ) ).toThrow( LambdaApiValidationError );
      } );
    } );
  }
} );
