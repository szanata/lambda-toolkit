const retry = require( './retry_on_error' );

class RootError extends Error {}
class HookError extends Error {}

describe( 'Retry On Error Spec', () => {
  it( 'Should execute a sync closure', async () => {
    const result = await retry( _ => 1 );
    expect( result ).toBe( 1 );
  } );

  it( 'Should execute an async closure that return an async function', async () => {
    const closure = _ => Promise.resolve( 5 );

    const result = await retry( closure );

    expect( result ).toBe( 5 );
  } );

  describe( 'Retries', () => {
    it( 'Should retry the closure execution until it does not throw', async () => {
      const state = { calls: 0 };
      const closure = () => {
        if ( state.calls < 3 ) {
          state.calls++;
          throw new RootError();
        }
        return 1;
      };

      const result = await retry( closure, { limit: 5 } );

      expect( state.calls ).toBe( 3 );
      expect( result ).toBe( 1 );
    } );

    it( 'Should not retry if the the limit is 0', async () => {
      const state = { calls: 0 };
      const closure = () => { state.calls++; throw new RootError(); };

      await expect( retry( closure, { limit: 0 } ) ).rejects.toThrow( RootError );

      expect( state.calls ).toBe( 1 );
    } );

    it( 'Should retry the closure execution until the limit is reached', async () => {
      const state = { calls: 0 };
      const closure = () => { state.calls++; throw new RootError(); };

      await expect( retry( closure, { limit: 3 } ) ).rejects.toThrow( RootError );

      expect( state.calls ).toBe( 4 );
    } );

    it( 'Should delay exponentially the retries using the delay argument as base', async () => {
      const closure = () => { throw new RootError(); };

      const startTime = Date.now();
      await expect( retry( closure, { delay: 5, limit: 3 } ) ).rejects.toThrow( RootError );
      const elapsedTime = Date.now() - startTime;

      const uncertainty = 50;
      expect( elapsedTime ).toBeGreaterThan( 155 - uncertainty );
      expect( elapsedTime ).toBeLessThan( 155 + uncertainty );
    } );
  } );

  describe( 'Retry Hook', () => {
    it( 'Should stop the reties if retry hook returns false', async () => {
      const state = { calls: 0 };
      const fn = () => { state.calls++; throw new RootError(); };

      const result = await retry( fn, { limit: 5, retryHook: _ => false } );

      expect( state.calls ).toBe( 1 );
      expect( result ).toBe( false );
    } );

    it( 'Should throw error if the retry hook throws error', async () => {
      const state = { calls: 0 };
      const fn = () => { state.calls++; throw new RootError(); };

      await expect( retry( fn, { limit: 5, retryHook: _ => { throw new HookError(); } } ) ).rejects.toThrow( HookError );

      expect( state.calls ).toBe( 1 );
    } );

    it( 'Should throw error if the retry hook resolves to error', async () => {
      const state = { calls: 0 };
      const fn = () => { state.calls++; throw new RootError(); };

      await expect( retry( fn, { limit: 5, retryHook: async _ => Promise.reject( new HookError() ) } ) ).rejects.toThrow( HookError );

      expect( state.calls ).toBe( 1 );
    } );
  } );
} );
