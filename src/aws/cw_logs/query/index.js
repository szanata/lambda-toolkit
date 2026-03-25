import { startQuery } from './start_query.js';
import { getResults } from './get_results.js';
import { parseResults } from './parse_results.js';

/**
 * @class Result
 * @type {Object}
 * @property {Object[]} items Each query result row, parsed to a camelized js object
 * @property {Number} count Total number of results
 */

/**
 * Executes an Athena Query
 * @param {*} client The native client
 * @param {Object} nativeArgs The native args to start the Cloudwatch Query
 * @param {Object=} options Extra options for this command
 * @param {Object=} options.range Since the nativeArgs "startTime" and "endTime" are second based epochs, the "range" argument accepts milliseconds based epochs for convenience, thus overwriting the "nativeArgs"
 * @param {Number} options.range.from The beginning of the time range to query, overwrites "startTime"
 * @param {Number} options.range.to The end of the time range to query, overwrites "endTime"
 * @returns {Result} The query result
 */
export const query = async ( client, nativeArgs, { range = {} } = {} ) => {
  const queryId = await startQuery( { client, nativeArgs, range } );
  const results = await getResults( { client, queryId } );
  const items = parseResults( results );
  return { items, count: items.length };
};
