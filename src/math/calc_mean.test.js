import { calcMean } from './calc_mean.js';
import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

describe( 'Math: Calc Mean Spec', () => {
  it( 'Should calculate the mean between a set of numbers', () => {
    const numbers = [ 1, 2, 0, 5 ];
    const result = calcMean( numbers );
    strictEqual( result, 2 );
  } );

  it( 'Should return NaN if the array is empty', () => {
    const result = calcMean( [] );
    strictEqual( result, NaN );
  } );
} );
