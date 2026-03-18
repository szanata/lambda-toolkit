import { calcStdDevSample } from './calc_std_dev_sample.js';
import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

describe( 'Math: Calc Sample Standard Deviation Spec', () => {
  it( 'Should calculate the sample standard deviation between a set of numbers', () => {
    const numbers = [ 5, 3, 2, 4 ];
    const result = calcStdDevSample( numbers );
    strictEqual( result, 1.2909944487358056 );
  } );

  it( 'Should return NaN if the array is empty', () => {
    const result = calcStdDevSample( [] );
    strictEqual( result, NaN );
  } );

  it( 'Should return 0 if the array have length 1', () => {
    const result = calcStdDevSample( [ 3 ] );
    strictEqual( result, NaN );
  } );
} );
