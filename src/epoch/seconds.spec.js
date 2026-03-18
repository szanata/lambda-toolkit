import { seconds } from './seconds.js';
import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

describe( 'Seconds Spec', () => {
  it( 'Should return x seconds in ms', () => {
    strictEqual( seconds( 3 ), 3000 );
  } );
} );
