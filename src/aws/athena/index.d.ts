import { AthenaClient, AthenaClientConfig } from '@aws-sdk/client-athena';
import { query } from './query.js';
export type { AthenaQueryResult, StartQueryExecutionInput } from './query.js';

/**
 * Athena: Execute SQL queries on data stored in S3.
 */
export interface Athena {
  /**
   * Execute an Athena query.
   */
  query: typeof query;

  /**
   * Access the underlying Athena client for advanced usage.
   */
  getClient(): AthenaClient;

  /**
   * Create a new Athena instance with custom client configuration.
   */
  (config?: AthenaClientConfig): Athena;
}

/**
 * Athena: Execute SQL queries on data stored in S3.
 */
export const athena: Athena;
