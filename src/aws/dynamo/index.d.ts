import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { get } from './get.js';
import { put } from './put.js';
import { putBatch } from './put_batch.js';
import { query } from './query.js';
import { remove } from './remove.js';
import { removeBatch } from './remove_batch.js';
import { scan } from './scan.js';
import { smartUpdate } from './smart_update.js';
import { transactWrite } from './transact_write.js';
import { update } from './update.js';

export type { DynamoQueryResult } from './query.js';
export type { DynamoScanResult } from './scan.js';

/**
 * DynamoDB: Simplified document client for DynamoDB operations.
 *
 * Features:
 * - Automatic document marshalling/unmarshalling
 * - Sugar syntax for common operations (get, put, remove)
 * - Batch operations with automatic chunking
 * - Query/Scan with pagination support
 * - Smart update with automatic expression building
 * - Transactional writes
 */
export interface Dynamo {
  /**
   * Get a single item by key (supports both sugar and native syntax).
   */
  get: typeof get;

  /**
   * Put an item (supports both sugar and native syntax).
   */
  put: typeof put;

  /**
   * Put multiple items in batches.
   */
  putBatch: typeof putBatch;

  /**
   * Query items by partition key with optional sort key condition.
   */
  query: typeof query;

  /**
   * Delete a single item by key (supports both sugar and native syntax).
   */
  remove: typeof remove;

  /**
   * Delete multiple items in batches.
   */
  removeBatch: typeof removeBatch;

  /**
   * Scan all items in a table with optional filter.
   */
  scan: typeof scan;

  /**
   * Update an item with automatic expression building.
   */
  smartUpdate: typeof smartUpdate;

  /**
   * Perform transactional writes (all or none).
   */
  transactWrite: typeof transactWrite;

  /**
   * Update an item using full UpdateCommandInput.
   */
  update: typeof update;

  /**
   * Get the underlying DynamoDBDocumentClient.
   * @param config Optional client configuration
   * @returns The configured document client
   */
  getClient(config?: DynamoDBClientConfig): DynamoDBDocumentClient;
}

/**
 * Create a Dynamo instance with optional custom configuration.
 *
 * @param config Optional DynamoDB client configuration
 * @returns Dynamo instance with all methods
 *
 * @example
 * ```ts
 * import { dynamo } from 'lambda-toolkit';
 *
 * // Use default configuration
 * const item = await dynamo.get('Users', { id: '123' });
 *
 * // Or create with custom config
 * const customDynamo = dynamo({ region: 'us-west-2' });
 * const item2 = await customDynamo.get('Users', { id: '456' });
 * ```
 */
export declare const dynamo: Dynamo & ((config?: DynamoDBClientConfig) => Dynamo);
