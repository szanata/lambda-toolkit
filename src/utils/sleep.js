/**
 * Sleep for a specified amount of time
 *
 * @param {number} t The time to sleep in milliseconds
 * @returns {Promise<void>} A promise that resolves after the specified time
 * @type {(t: number) => Promise<void>}
 */
export const sleep = t => new Promise( r => setTimeout( r, t ) );
