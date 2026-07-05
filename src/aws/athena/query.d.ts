import { StartQueryExecutionInput } from '@aws-sdk/client-athena';

export type { StartQueryExecutionInput };

/**
 * Result of an Athena query.
 */
export interface AthenaQueryResult {
  /**
   * Array of parsed result rows as camelized JavaScript objects.
   */
  items: Record<string, any>[];
  /**
   * Pagination token for fetching the next page of results (only when recursive=false).
   */
  paginationToken?: string;
}

/**
 * Execute an Athena query.
 * Supports both recursive (fetch all results) and paginated (token-based) modes.
 *
 * @param nativeArgs Athena StartQueryExecutionCommand parameters
 * @param nativeArgs.QueryString The SQL query to execute
 * @param nativeArgs.QueryExecutionContext Database and catalog context
 * @param nativeArgs.ResultConfiguration Output location for query results (S3 path)
 * @param options Query execution options
 * @param options.recursive Fetch all results automatically (default: false)
 * @param options.paginationToken Token from previous query to resume pagination
 * @param options.maxResults Maximum results per page
 * @returns Query results with items array and optional pagination token
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { athena } = aws;
 *
 * // Recursive query (fetches all results)
 * const result = await athena.query(
 *   {
 *     QueryString: 'SELECT * FROM my_table LIMIT 100',
 *     QueryExecutionContext: { Database: 'my_db' },
 *     ResultConfiguration: { OutputLocation: 's3://my-bucket/results/' }
 *   },
 *   { recursive: true }
 * );
 *
 * console.log(result.items);
 * ```
 */
export function query(
  nativeArgs: Partial<StartQueryExecutionInput>,
  options?: {
    recursive?: boolean;
    paginationToken?: string;
    maxResults?: number;
  }
): Promise<AthenaQueryResult>;
