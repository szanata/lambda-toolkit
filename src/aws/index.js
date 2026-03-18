import { athena } from './athena/index.js';
import { cwLogs } from './cw_logs/index.js';
import { dynamo } from './dynamo/index.js';
import { lambda } from './lambda/index.js';
import { s3 } from './s3/index.js';
import { ses } from './ses/index.js';
import { sns } from './sns/index.js';
import { sqs } from './sqs/index.js';
import { ssm } from './ssm/index.js';
import { timestreamQuery } from './timestream_query/index.js';
import { timestreamWrite } from './timestream_write/index.js';

export {
  athena,
  cwLogs,
  dynamo,
  lambda,
  s3,
  ses,
  sns,
  sqs,
  ssm,
  timestreamQuery,
  timestreamWrite
};
