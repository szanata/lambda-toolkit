import { TimestreamWriteClient, TimestreamWriteClientConfig } from '@aws-sdk/client-timestream-write';
import { writeRecords } from './write_records.js';
export type { WriteRecordsResult, WriteRecordsRejected, WriteRecordsCommandOutput } from './write_records.js';

/**
 * Timestream Write: Ingest time series data into Timestream tables.
 * Includes default timeout and retry configuration optimized for Timestream.
 */
export interface TimestreamWrite {
  /**
   * Write records to a Timestream table.
   */
  writeRecords: typeof writeRecords;

  /**
   * Access the underlying Timestream Write client for advanced usage.
   */
  getClient(): TimestreamWriteClient;

  /**
   * Create a new Timestream Write instance with custom client configuration.
   */
  (config?: TimestreamWriteClientConfig): TimestreamWrite;
}

/**
 * Timestream Write: Ingest time series data into Timestream tables.
 */
export const timestreamWrite: TimestreamWrite;
