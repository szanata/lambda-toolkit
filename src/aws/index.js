const athena = require( './athena' );
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
