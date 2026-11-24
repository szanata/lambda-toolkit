import { sleep } from './sleep.js';
import { describe, it, mock, afterEach } from 'node:test';
import { strictEqual } from 'node:assert';

describe( 'Sleep spec', () => {
  afterEach( () => {
    mock.timers.reset();
  } );

  it( 'Should resolve only after the given time', async () => {
    mock.timers.enable( { apis: [ 'setTimeout' ] } );
    const state = { resolved: false };

    const promise = sleep( 500 ).then( () => { state.resolved = true; } );

    mock.timers.tick( 499 );
    await Promise.resolve();
    strictEqual( state.resolved, false );

    mock.timers.tick( 1 );
    await promise;
    strictEqual( state.resolved, true );
  } );
} );
