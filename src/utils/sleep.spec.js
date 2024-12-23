const sleep = require( './sleep' );

describe( 'Sleep spec', () => {
  it( 'Should sleep (process block) for x time', async () => {
    const startTime = Date.now();
    const sleepTime = 500;
    await sleep( sleepTime );
    const elapsed = Date.now() - startTime;

    expect( elapsed ).not.toBeLessThan( sleepTime );
  } );
} );
