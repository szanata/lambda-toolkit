import { sleep } from './sleep.js';

const execWithRetry = async ( closure, { limit, delay, retryHook, execCount = 0 } ) => {
  if ( !( closure instanceof Function ) ) {
    throw new Error( 'Closure is not a function' );
  }

  try {
    return await closure();
  } catch ( error ) {
    // exhausted
    if ( execCount === limit ) { throw error; }

    // async retry hook to check if it should retry or give up and throw
    if ( retryHook instanceof Function ) {
      try {
        const retry = await retryHook( error, execCount );
        if ( retry === false ) { return false; }

      // Hook errors break the flow
      } catch ( hookError ) {
        console.debug( hookError );
        throw hookError;
      }
    }

    // if there is no hook back-off and retry
    if ( delay > 0 ) {
      await sleep( delay ** ( 1 + execCount ) );
    }
    return execWithRetry( closure, { limit, delay, retryHook, execCount: execCount + 1 } );
  }
};

/**
 *
 * @param {Function} closure A self contained function that will be invoked
 * @param {Object} config
 * @param {Number} config.limit The max number of retries
 * @param {Number} config.delay The delay between each retry (it will be raised to the power of the number of retries, so it is exponential back-off)
 * @param {Function} config.retryHook A function to be called every time a retry is needed.
 *                             If this functions returns true, the retry flow continues until limit
 *                             If this functions returns false, the retry flow is aborted, returning false
 *                             If this functions throws an error, the retry flow is aborted with that error
 * @returns {*} The closure result
 */
export const retryOnError = async ( closure, { limit = 0, delay = 0, retryHook = null } = {} ) =>
  execWithRetry( closure, { limit, delay, retryHook } );
