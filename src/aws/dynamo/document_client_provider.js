const { DynamoDBClient } = require( '@aws-sdk/client-dynamodb' );
const { DynamoDBDocumentClient } = require( '@aws-sdk/lib-dynamodb' );
const cache = require( '../core/cache_storage' );

module.exports = nativeArgs => {
  const translateConfig = {
    // Yes I copied those from the docs, read more here:
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_lib_dynamodb.html#dynamodbdocumentclientresolvedconfig-1
    marshallOptions: {
      // Whether to automatically convert empty strings, blobs, and sets to `null`.
      convertEmptyValues: true, // false, by default.
      // Whether to remove undefined values while marshalling.
      removeUndefinedValues: true, // false, by default.
      // Whether to convert typeof object to map attribute.
      convertClassInstanceToMap: true // false, by default.
    },
    unmarshallOptions: {
      // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
      wrapNumbers: false // false, by default.
    }
  };

  const key = `Dynamodb(${JSON.stringify( nativeArgs )}).DocumentClient`;
  return cache.get( key ) ?? ( () => {
    const client = new DynamoDBClient( nativeArgs );
    const docClient = DynamoDBDocumentClient.from( client, translateConfig );

    cache.set( key, docClient );
    return docClient;
  } )();
};
