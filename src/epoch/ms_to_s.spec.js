import { msToS } from './ms_to_s.js';
import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

describe( 'MS to S Spec', () => {
  it( 'Should return ms converted to s', () => {
    strictEqual( msToS( 49094 ), 50 );
  } );
} );
