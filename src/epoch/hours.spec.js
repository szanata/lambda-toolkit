import { hours } from './hours.js';
import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

describe( 'Hours Spec', () => {
  it( 'Should return x hours in ms', () => {
    strictEqual( hours( 3 ), 1.08e+7 );
  } );
} );
