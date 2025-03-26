const athena = require( './athena' );
const cwLogs = require( './cw_logs' );
const dynamo = require( './dynamo' );
const lambda = require( './lambda' );
const s3 = require( './s3' );
const ses = require( './ses' );
const sns = require( './sns' );
const sqs = require( './sqs' );
const ssm = require( './ssm' );
const timestreamQuery = require( './timestream_query' );
const timestreamWrite = require( './timestream_write' );

module.exports = {
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
