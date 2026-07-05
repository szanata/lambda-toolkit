import { StartQueryCommandInput } from '@aws-sdk/client-cloudwatch-logs';

export type { StartQueryCommandInput };

/**
 * Result of a CloudWatch Logs Insights query.
 */
export interface CloudWatchLogsQueryResult {
  /**
   * Array of parsed result rows as camelized JavaScript objects.
   */
  items: Record<string, any>[];
  /**
   * Total number of results returned.
   */
  count: number;
}

/**
 * Execute a CloudWatch Logs Insights query.
 * Automatically handles polling for results until query completes.
 *
 * @param nativeArgs CloudWatch StartQueryCommand parameters
 * @param nativeArgs.logGroupName CloudWatch log group name
 * @param nativeArgs.logGroupNames Array of log group names to query across multiple groups
 * @param nativeArgs.queryString The CloudWatch Logs Insights query string
 * @param nativeArgs.startTime Query start time (Unix timestamp in seconds)
 * @param nativeArgs.endTime Query end time (Unix timestamp in seconds)
 * @param nativeArgs.limit Maximum number of log events to return
 * @param options Additional options
 * @param options.range Convenience parameter for time range in milliseconds (overrides startTime/endTime)
 * @param options.range.from Range start in milliseconds (converted to seconds)
 * @param options.range.to Range end in milliseconds (converted to seconds)
 * @returns Object with parsed query results
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { cwLogs } = aws;
 *
 * const results = await cwLogs.query(
 *   {
 *     logGroupName: '/aws/lambda/my-function',
 *     queryString: 'fields @timestamp, @message | stats count() by @message',
 *     startTime: 1704067200,
 *     endTime: 1704153600
 *   }
 * );
 *
 * console.log(results.count, results.items);
 * ```
 */
export function query(
  nativeArgs: Partial<StartQueryCommandInput>,
  options?: {
    range?: {
      from: number;
      to: number;
    };
  }
): Promise<CloudWatchLogsQueryResult>;
