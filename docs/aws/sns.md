# SNS

Abstraction over `@aws-sdk/client-sns`.

Namespace: `aws.sns.`

## Index
- [client](#client)
- [`fn` publish](#fn-publish)

## Client

The SDK's SNS client is instantiated with not options.

## Members

### `fn` publish

Publishes a message to a topic. Abstracts the `PublishCommand`.

Example:
```js
const { aws: { sns } } = require( '<this-library>' );

await sns.publish( 'my-topic', {
  title: 'Seventh Voyage of Sinbad'
} );
```

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|topicArn|String|the arn of the topic to publish the message||
|message|String,Object|The content of the message, if it is not an String, it will be cast using `JSON.stringify`||
|nativeArgs|Object|All `client-sns` SDK [PublishCommand arguments](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-sns/Class/PublishCommand/) except `TopicArn` and `Message`, which are defined by the previous arguments||

#### Return

The `MessageId` value from the SDK response.

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
