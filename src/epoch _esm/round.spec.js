import { round } from './round.js';
import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

const now = 1679830316091;

describe( 'Round Spec', () => {
  it( 'Should round an epoch to given integer', () => {
    strictEqual( round( now, 1000 ), 1679830316000 );
    strictEqual( round( now, 10000 ), 1679830310000 );
    strictEqual( round( now, 50000 ), 1679830300000 );
  } );
} );
