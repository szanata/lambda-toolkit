# SQS

Abstraction over `@aws-sdk/client-sqs`.

Namespace: `aws.sqs.`

## Index
- [client](#client)
- [`fn` deleteMessage](#fn-deletemessage)
- [`fn` sendMessage](#fn-sendmessage)
- [`fn` sendMessageBatch](#fn-sendmessagebatch)

## Client

The SDK's SQS client is instantiated with no options by default. To configure it, call the module as a _factory_ passing the client configuration (see [configuration](./index.md#configuration)):
```js
// CJS
const { aws: { sqs } } = require( 'lambda-toolkit' );

// ESM
import { aws } from 'lambda-toolkit';
const { sqs } = aws;

const client = sqs( { region: 'eu-west-1' } );
```

## Members

### `fn` deleteMessage

Deletes a given message from a queue. Abstracts the `DeleteMessageCommand`.

Example:
```js
// CJS
const { aws: { sqs } } = require( 'lambda-toolkit' );

// ESM
import { aws } from 'lambda-toolkit';
const { sqs } = aws;

await sqs.deleteMessage( 'my-queue', 'receipt-handle' );
```

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|queue|String|The name of the SQS queue to delete the message from||
|receiptHandle|String|The code provided by SQS when a message is received||

#### Return

The raw SDK [response](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/sqs/command/DeleteMessageCommand/).

#### Permissions needed

The AWS policy statement to use this function is:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "sqs:DeleteMessage"
      ],
      "Resource": [
        "<queue arn>"
      ]
    }
  ]
}
```

### `fn` sendMessage

Sends a message to a queue. Abstracts the `SendMessageCommand`.

Example:
```js
// CJS
const { aws: { sqs } } = require( 'lambda-toolkit' );

// ESM
import { aws } from 'lambda-toolkit';
const { sqs } = aws;

await sqs.sendMessage( 'my-queue', {
  title: 'Warlords of Atlantis'
} );
```

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|queue|String|The name of the SQS queue to send the message to||
|message|String,Object|The content of the message, if it is not a String, it will be cast using `JSON.stringify`||
|nativeArgs|Object|All `client-sqs` SDK [SendMessageCommand arguments](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/sqs/command/SendMessageCommand/) except `QueueUrl` and `MessageBody`, which are defined by the previous arguments||

#### Sanitization

The messages will be sanitized to remove invalid characters like `#x9` from the message. For reference check the [documentation](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_SendMessage.html) or this [StackOverflow](https://stackoverflow.com/questions/58809098/remove-invalid-characters-from-message-sent-to-aws-amazon-sqs) thread.

#### Return

The `MessageId` attribute from the SDK [response](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/sqs/command/SendMessageCommand/).

#### Permissions needed

The AWS policy statement to use this function is:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "sqs:SendMessage"
      ],
      "Resource": [
        "<queue arn>"
      ]
    }
  ]
}
```

### `fn` sendMessageBatch

Sends a batch of messages to a queue. Abstracts the `SendMessageBatchCommand`.

Example:
```js
// CJS
const { aws: { sqs } } = require( 'lambda-toolkit' );

// ESM
import { aws } from 'lambda-toolkit';
const { sqs } = aws;

await sqs.sendMessageBatch( 'my-queue', [
  {
    body: {
      title: 'The Land That time Forgot'
    }
  }, {
    body: {
      title: 'At The Earth\'s Core'
    }
  }
] );
```

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|queue|String|The name of the SQS queue to send the messages to||
|messages|Array<Object>|Array of messages to send, see each property below. The maximum allowed length is 10.||
|messages.*.body|String,Object|The content of the message, if it is not a String, it will be cast using `JSON.stringify`||
|messages.*.id|String|The id of the message in the batch, if not present it will be created as `message_` + index of the message||
|messages.*.nativeArgs|Object|Native properties that each `SendMessageBatchRequestEntry` in the `client-sqs` SDK [SendMessageBatchCommand arguments](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/sqs/command/SendMessageBatchCommand/) accepts, except `Id` and `MessageBody`, which are defined by the previous arguments||

#### Error Handling

If any message in the batch fails, an error is thrown.

#### Return

The raw SDK [response](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/sqs/command/SendMessageBatchCommand/).

#### Permissions needed

The AWS policy statement to use this function is:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "sqs:SendMessage"
      ],
      "Resource": [
        "<queue arn>"
      ]
    }
  ]
}
```
