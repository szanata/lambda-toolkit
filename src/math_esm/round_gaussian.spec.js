import { roundGaussian } from './round_gaussian.js';
import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

describe( 'Math: Round Gaussian Spec', () => {
  it( 'Should round numbers using Gaussian/Bankers method', () => {
    strictEqual( roundGaussian( 1.3150 ), 1.32 )
    strictEqual( roundGaussian( 1.3250 ), 1.32 )
    strictEqual( roundGaussian( 1.0000001 ), 1 )
    strictEqual( roundGaussian( 1.009 ), 1.01 )
    strictEqual( roundGaussian( 1.5666 ), 1.57 )
    strictEqual( roundGaussian( 1.4444 ), 1.44 )
    strictEqual( roundGaussian( 1 ), 1 )
  } );

  it( 'Should return NaN if number is invalid', () => {
    strictEqual( roundGaussian( null ), NaN )
    strictEqual( roundGaussian( NaN ), NaN )
    strictEqual( roundGaussian( undefined ), NaN )
    strictEqual( roundGaussian( '0' ), NaN )
  } );

  it( 'Should work with exponential numbers', () => {
    strictEqual( roundGaussian( -4.625929269271485e-18 ), -0 )
    strictEqual( roundGaussian( 1.3250e2 ), 132.5 )
  } );
} );
