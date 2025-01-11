# Lambda

Abstraction over `@aws-sdk/client-lambda`

## Index
- [`fn` invoke](#fn-invoke)

## Client

The SDK Lambda client is instantiated with not options.

## Members

### `fn` invoke

Invoked an AWS Lambda function. This abstracts the `InvokeCommand`.

Example:
```js
const { aws: { lambda } } = require( '<this-library>' );

const responsePayload = await athena.invoke( functionName, payload, 'RequestResponse' );
```

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|functionName|String|The name of the AWS Lambda function to invoke||
|payload|Object|The payload to invoke the function with|`{}`|
|invocationType|String|The type of invocation. Either "Event" or "RequestResponse"|`"RequestResponse"`|

#### Return

If the invocation type was "Event", return `true`.

But, if the invocation type was "RequestResponse", return the the response payload of the lambda, parse to JSON.

### Error handling

Any errors that the invoked function throws are normalized to a the error type `LambdaError`, which extends `Error` and has the following properties:

|Property|Description|
|---|---|
|statusCode|The HTTP status code of the the lambda invocation.|
|lambdaErrorType|The type of the error threw by the invocated function.|
|lambdaErrorMessage|The message from the error threw by the invocated function.|

#### Permissions needed

The AWS policy statement to use this function is:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["lambda:InvokeFunction"],
    "Resource": ["<lambda arn>" ]
  }]
}
```
