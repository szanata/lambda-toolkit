import { WriteRecordsCommandOutput, RejectedRecord, _Record } from '@aws-sdk/client-timestream-write';

export type { WriteRecordsCommandOutput };

/**
 * Result of successfully writing records to Timestream.
 */
export interface WriteRecordsResult {
  /**
   * Number of records successfully ingested.
   */
  recordsIngested: number;
}

/**
 * Result when records are rejected and ignoreRejections is enabled.
 */
export interface WriteRecordsRejected {
  /**
   * Array of records that were rejected.
   */
  rejectedRecords: RejectedRecord[];
}

/**
 * Write records to a Timestream table.
 *
 * @param options Write options
 * @param options.database Database name
 * @param options.table Table name
 * @param options.records Array of records to write
 * @param options.ignoreRejections If false/omitted, throws on RejectedRecordsException; if true, returns rejected records (default: false)
 * @returns Number of successfully ingested records or array of rejected records
 *
 * @example
 * ```ts
 * import { aws } from 'lambda-toolkit';
 * const { timestreamWrite } = aws;
 *
 * const result = await timestreamWrite.writeRecords({
 *   database: 'my-database',
 *   table: 'my-table',
 *   records: [
 *     {
 *       Dimensions: [{ Name: 'host', Value: 'server-1' }],
 *       MeasureName: 'cpu',
 *       MeasureValue: '80',
 *       MeasureValueType: 'DOUBLE',
 *       Time: Date.now().toString(),
 *       TimeUnit: 'MILLISECONDS'
 *     }
 *   ]
 * });
 *
 * console.log(result.recordsIngested);
 * ```
 */
export function writeRecords(
  options: {
    database: string;
    table: string;
    records: _Record[];
    ignoreRejections?: false;
  }
): Promise<WriteRecordsResult>;

export function writeRecords(
  options: {
    database: string;
    table: string;
    records: _Record[];
    ignoreRejections: true;
  }
): Promise<WriteRecordsResult | WriteRecordsRejected>;
