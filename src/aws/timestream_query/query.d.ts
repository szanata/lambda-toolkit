import { QueryCommandOutput } from '@aws-sdk/client-timestream-query';

export type { QueryCommandOutput };

/**
 * Parsed Timestream query result.
 */
export interface TimestreamQueryResult {
  /**
   * Array of parsed result rows as camelized JavaScript objects.
   */
  items: Record<string, any>[];
  /**
   * Total number of rows in this response.
   */
  count: number;
  /**
   * Token for pagination if more results exist.
   */
  nextToken?: string;
  /**
   * Query status with execution metadata.
   */
  queryStatus?: Record<string, any>;
}

/**
 * Execute a Timestream query.
 *
 * @param queryString The Timestream SQL query string
 * @param options Query options
 * @param options.recursive Automatically fetch all pages of results (default: false)
 * @param options.paginationToken NextToken for resuming paginated queries
 * @param options.maxRows Maximum rows per response page
 * @param options.rawResponse Return raw SDK response instead of parsed results (default: false)
 * @returns Parsed query results or raw SDK response if rawResponse=true
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { timestreamQuery } = aws;
 *
 * const results = await timestreamQuery.query(
 *   'SELECT * FROM "database"."table" WHERE time > ago(1h)',
 *   { recursive: true }
 * );
 *
 * console.log(results.count, results.items);
 * ```
 */
export function query(
  queryString: string,
  options?: {
    recursive?: boolean;
    paginationToken?: string;
    maxRows?: number;
    rawResponse?: false;
  }
): Promise<TimestreamQueryResult>;

export function query(
  queryString: string,
  options: {
    recursive?: boolean;
    paginationToken?: string;
    maxRows?: number;
    rawResponse: true;
  }
): Promise<QueryCommandOutput>;
