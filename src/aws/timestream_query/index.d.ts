import { TimestreamQueryClient, TimestreamQueryClientConfig } from '@aws-sdk/client-timestream-query';
import { query } from './query.js';
export type { TimestreamQueryResult, QueryCommandOutput } from './query.js';

/**
 * Timestream Query: Execute SQL queries against time series data.
 * Includes default timeout and retry configuration optimized for Timestream.
 */
export interface TimestreamQuery {
  /**
   * Execute a Timestream SQL query.
   */
  query: typeof query;

  /**
   * Access the underlying Timestream Query client for advanced usage.
   */
  getClient(): TimestreamQueryClient;

  /**
   * Create a new Timestream Query instance with custom client configuration.
   */
  (config?: TimestreamQueryClientConfig): TimestreamQuery;
}

/**
 * Timestream Query: Execute SQL queries against time series data.
 */
export const timestreamQuery: TimestreamQuery;
