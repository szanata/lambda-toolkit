import { calcZScore } from './calc_z_score.js';
import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

describe( 'Math: Calc Z Score Spec', () => {
  it( 'Should the z score for given values', () => {
    const sample = 10;
    const mean = 20;
    const std = 10;
    const result = calcZScore( sample, mean, std );
    strictEqual( result, -1 );
  } );

  it( 'Should return NaN if the std is 0', () => {
    const result = calcZScore( 1, 4, 0 );
    strictEqual( result, NaN );
  } );
} );
