# SNS

Abstraction over `@aws-sdk/client-sns`.

Namespace: `aws.sns.`

## Index
- [client](#client)
- [`fn` publish](#fn-publish)
- [`fn` publishBatch](#fn-publishbatch)

## Client

The SDK's SNS client is instantiated with no options.

## Members

### `fn` publish

Publishes a message to a topic. Abstracts the `PublishCommand`.

Example:
```js
const { aws: { sns } } = require( '<this-library>' );

await sns.publish( 'my-topic', {
  title: 'The 7th Voyage of Sinbad'
} );
```

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|topicArn|String|The arn of the topic to publish the message||
|message|String,Object|The content of the message, if it is not an String, it will be cast using `JSON.stringify`||
|nativeArgs|Object|All `client-sns` SDK [PublishCommand arguments](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-sns/Class/PublishCommand/) except `TopicArn` and `Message`, which are defined by the previous arguments||

#### Return

The `MessageId` attribute from the SDK [response](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-sns/Interface/PublishCommandOutput/).

#### Permissions needed

The AWS policy statement to use this function is:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "sns:Publish"
      ],
      "Resource": [
        "<topic arn>"
      ]
    }
  ]
}
```

### `fn` publishBatch

Publishes a batch of messages to a topic. Abstracts the `PublishBatchCommand`.

Example:
```js
const { aws: { sns } } = require( '<this-library>' );

await sns.publishBatch( 'my-topic', [
  {
    message: {
      title: 'The 7th Voyage of Sinbad'
    }
  },
  {
    message: {
      title: 'The Golden Voyage of Sinbad'
    }
  },
] );
```

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|topicArn|String|The arn of the topic to publish the message||
|messages|Array<Object>|Array of messages to publish, see each property below. The maximum allowed length is 10.||
|messages.*.body|String,Object|The content of the message, if it is not an String, it will be cast using `JSON.stringify`||
|messages.*.id|String|The id of the message in the batch, if not present it will be created as `message_` + index of the message||
|messages.*..._rest_|Object|Native properties that each `PublishBatchRequestEntry` in the `client-sns` SDK [PublishBatchCommand arguments](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-sns/Class/PublishBatchCommand/) accepts, except `Id` and `Message`, which are defined by the previous arguments||

#### Error Handling

If any messages in the batch fails, a error is thrown.

#### Return

The raw SDK [response](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-sqs/Interface/SendMessageBatchCommandOutput/).

#### Permissions needed

The AWS policy statement to use this function is:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "sns:Publish"
      ],
      "Resource": [
        "<topic arn>"
      ]
    }
  ]
}
```
