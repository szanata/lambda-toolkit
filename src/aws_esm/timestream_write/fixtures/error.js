

// Error classes replicate real errors from TimeStream
export class RejectedRecordsException extends Error {
  constructor() {
    super( 'One or more records have been rejected. See RejectedRecords for details.' );
    this.name = 'RejectedRecordsException';
    this.$fault = 'client';
    this.$metadata = {
      httpStatusCode: 419,
      requestId: 'O4YUOZLCSHNYVGX7UUNZFUE4YA',
      extendedRequestId: undefined,
      cfId: undefined,
      attempts: 1,
      totalRetryDelay: 0
    };
    this.RejectedRecords = [
      {
        ExistingVersion: undefined,
        Reason: 'The record timestamp is outside the time range [2023-02-13T19:22:45.051Z, 2023-02-20T20:02:45.051Z) of the memory store.',
        RecordIndex: 1
      }
    ];
    this.__type = 'com.amazonaws.timestream.v20181101#RejectedRecordsException';
  }
}

export class ValidationException extends Error {
  constructor() {
    super( '1 validation error detected: Value \'X\' at \'records.1.member.dimensions\
.1.member.dimensionValueType\' failed to satisfy constraint: Member must satisfy enum value set: [VARCHAR]' );
    this.name = 'ValidationException';
    this.$fault = 'client';
    this.$metadata = {
      httpStatusCode: 400,
      requestId: 'IZGZ3TF5R2H6776MZ3DO3MO7TQ',
      extendedRequestId: undefined,
      cfId: undefined,
      attempts: 1,
      totalRetryDelay: 0
    };
    this.__type = 'com.amazon.coral.validate#ValidationException';
  }
}
