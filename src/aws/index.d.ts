/**
 * AWS: Simplified abstractions for common AWS services.
 * 
 * Each service can be used directly or instantiated with custom configuration.
 * Use `.getClient()` to access the underlying AWS SDK client if needed.
 */

export { sns, type SNS } from './sns/index.js';
export { ses, type SES } from './ses/index.js';
export { ssm, type SSM } from './ssm/index.js';
export { cwLogs, type CloudWatchLogs } from './cw_logs/index.js';
export { timestreamQuery, type TimestreamQuery } from './timestream_query/index.js';
export { timestreamWrite, type TimestreamWrite } from './timestream_write/index.js';
export { sqs, type SQS } from './sqs/index.js';
export { s3, type S3 } from './s3/index.js';
export { athena, type Athena } from './athena/index.js';
export { lambda, type Lambda, LambdaError } from './lambda/index.js';
export { dynamo, type Dynamo, type DynamoQueryResult, type DynamoScanResult } from './dynamo/index.js';
