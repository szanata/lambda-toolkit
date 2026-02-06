import { UserResponse } from './user_response.js';
import { describe, it } from 'node:test';
import { deepStrictEqual, partialDeepStrictEqual } from 'node:assert';

describe( 'User Response Spec', () => {
  it( 'Should accept a string and use it as the body of the response inferring 200', () => {
    const response = new UserResponse( 'Ops' );
    deepStrictEqual( response.values, [ 200, 'Ops' ] );
  } );

  it( 'Should accept an empty string and infer 204 without body', () => {
    const response = new UserResponse( 'Ops' );
    deepStrictEqual( response.values, [ 200, 'Ops' ] );
  } );

  it( 'Should accept a status code', () => {
    const response = new UserResponse( 304 );
    deepStrictEqual( response.values, [ 304 ] );
  } );

  it( 'Should accept undefined an infer 204', () => {
    const response = new UserResponse();
    deepStrictEqual( response.values, [ 204 ] );
  } );

  it( 'Should accept an array, where positions are status code, body, headers, isBase64Encoded respectively', () => {
    const response = new UserResponse( [ 304, 'foo', { 'X-header': 'Bar' }, false ] );
    deepStrictEqual( response.values, [ 304, 'foo', { 'X-header': 'Bar' }, false ] );
  } );

  it( 'Should accept an array with just one position, status code', () => {
    const response = new UserResponse( [ 304 ] );
    deepStrictEqual( response.values, [ 304 ] );
  } );

  it( 'Should accept an object, with the following properties: statusCode, body, headers and isBase64Encoded', () => {
    const response = new UserResponse( { statusCode: 304, body: 'foo', headers: { 'X-header': 'Bar' }, isBase64Encoded: true } );
    deepStrictEqual( response.values, [ 304, 'foo', { 'X-header': 'Bar' }, true ] );
  } );

  it( 'Should accept an object, with just statusCode', () => {
    const response = new UserResponse( { statusCode: 304 } );
    partialDeepStrictEqual( response.values, [ 304 ] );
  } );
} );
