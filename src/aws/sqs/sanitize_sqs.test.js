import { sanitizeSqs } from './sanitize_sqs.js';
import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

describe( 'Sanitize SQS', () => {
  it( 'Should replace invalid SQS characters from strings', () => {
    const result = sanitizeSqs( String.fromCharCode( 0x00 ) + 'foo' );
    strictEqual( result, 'foo' );
  } );
} );
