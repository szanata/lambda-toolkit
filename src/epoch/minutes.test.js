import { minutes } from './minutes.js';
import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

describe( 'Minutes Spec', () => {
  it( 'Should return x minutes in ms', () => {
    strictEqual( minutes( 3 ), 180000 );
  } );
} );
