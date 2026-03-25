import { roundStandard } from './round_standard.js';
import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

describe( 'Math: Round Standard Spec', () => {
  it( 'Should round numbers using simple arithmetic method', () => {
    strictEqual( roundStandard( 1.3150 ), 1.32 );
    strictEqual( roundStandard( 1.3250 ), 1.33 );
    strictEqual( roundStandard( 1.0000001 ), 1 );
    strictEqual( roundStandard( 1.009 ), 1.01 );
    strictEqual( roundStandard( 1.5666 ), 1.57 );
    strictEqual( roundStandard( 1.4444 ), 1.44 );
    strictEqual( roundStandard( 1 ), 1 );
  } );

  it( 'Should round negative number', () => {
    strictEqual( roundStandard( -1.3150 ), -1.31 );
    strictEqual( roundStandard( -1.3250 ), -1.32 );
    strictEqual( roundStandard( -1.0000001 ), -1 );
    strictEqual( roundStandard( -1.009 ), -1.01 );
    strictEqual( roundStandard( -1.5666 ), -1.57 );
    strictEqual( roundStandard( -1.4444 ), -1.44 );
    strictEqual( roundStandard( -1 ), -1 );
  } );

  it( 'Should work with exponential numbers', () => {
    strictEqual( roundStandard( -4.625929269271485e-18 ), -0 );
    strictEqual( roundStandard( 1.3250e2 ), 132.5 );
  } );

  it( 'Should round to different precisions', () => {
    strictEqual( roundStandard( 3.333333, 0 ), 3. );
    strictEqual( roundStandard( 3.333333, 1 ), 3.3 );
    strictEqual( roundStandard( 3.333333, 2 ), 3.33 );
    strictEqual( roundStandard( 3.333333, 3 ), 3.333 );
    strictEqual( roundStandard( 3.333333, 4 ), 3.3333 );
  } );
} );
