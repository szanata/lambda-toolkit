const copy = require( './copy' );
const download = require( './download' );
const getSignedUrl = require( './get_signed_url' );
const head = require( './head' );
const upload = require( './upload' );
const { S3Client } = require( '@aws-sdk/client-s3' );
const clientProvider = require( '../core/generic_client_provider' );
const createInstance = require( '../core/create_instance' );

const methods = {
  copy,
  download,
  getSignedUrl,
  head,
  upload
};

module.exports = createInstance( clientProvider.bind( null, S3Client ), methods );
