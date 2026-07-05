import { CloudWatchLogsClient, CloudWatchLogsClientConfig } from '@aws-sdk/client-cloudwatch-logs';
import { query } from './query.js';
export type { CloudWatchLogsQueryResult, StartQueryCommandInput } from './query.js';

/**
 * CloudWatch Logs: Query logs using CloudWatch Logs Insights.
 * Automatically handles polling for query completion and result pagination.
 */
export interface CloudWatchLogs {
  /**
   * Execute a CloudWatch Logs Insights query.
   */
  query: typeof query;

  /**
   * Access the underlying CloudWatch Logs client for advanced usage.
   */
  getClient(): CloudWatchLogsClient;

  /**
   * Create a new CloudWatch Logs instance with custom client configuration.
   */
  (config?: CloudWatchLogsClientConfig): CloudWatchLogs;
}

/**
 * CloudWatch Logs: Query logs using CloudWatch Logs Insights.
 */
export const cwLogs: CloudWatchLogs;
