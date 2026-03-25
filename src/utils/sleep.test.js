import { sleep } from './sleep.js';
import { describe, it } from 'node:test';
import { ok } from 'node:assert';

describe( 'Sleep spec', () => {
  it( 'Should sleep (process block) for x time', async () => {
    const startTime = Date.now();
    const sleepTime = 500;
    await sleep( sleepTime );
    const elapsed = Date.now() - startTime;

    ok( !( elapsed < sleepTime ) );
  } );
} );
