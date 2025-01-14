const deleteMessage = require( './delete_message' );
const sendMessage = require( './send_message' );
const sendMessageBatch = require( './send_message_batch' );
const { SQSClient } = require( '@aws-sdk/client-sqs' );
const clientProvider = require( '../core/generic_client_provider' );
const createInstance = require( '../core/create_instance' );

const methods = {
  deleteMessage,
  sendMessage,
  sendMessageBatch
};

module.exports = createInstance( clientProvider.bind( null, SQSClient ), methods );
