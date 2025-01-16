# SES

Abstraction over `@aws-sdk/client-sesv2`

## Namespace
`.ses`

## Index
- [client](#client)
- [`fn` deleteSuppressedDestination](#fn-deletesuppresseddestination)
- [`fn` sendEmail](#fn-sendemail)

## Client

The SDK's SESv2 client is instantiated with not options.

## Members

### `fn` deleteSuppressedDestination

Removes and address from the account suppression list. Abstracts the `DeleteSuppressedDestination`.

Example:
```js
const { aws: { ses } } = require( '<this-library>' );

await ses.deleteSuppressedDestination( 'user@not-a-domain' );
```

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|address|String|The email address to remove from the suppression list||

#### Return

The raw SDK [response](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-sesv2/Interface/DeleteSuppressedDestinationCommandOutput/).

#### Permissions needed

The AWS policy statement to use this function is:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:DeleteSuppressedDestination"
      ],
      "Resource": [
        "*"
      ]
    }
  ]
}
```

### `fn` sendEmail

Send an email using `SendEmailCommand`.

```js
const { aws: { ses } } = require( '<this-library>' );

await s3.sendEmail( {
  to: [
    'email1@not-a-domain',
    'email2@not-a-domain'
  ],
  from: 'noreply@not-a-domain',
  html: '<h1>Bar</h1>',
  subject: 'Foo'
} );
```

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|object|Object|The first argument is an object with the options below||
|object.to|Array<String>|Array of destination addresses||
|object.from|String|The sender address||
|object.html|String|The HTML code of the email||
|object.subject|String|The subject line of the email address||
|nativeArgs|Object|All `client-sesv2` SDK [SendEmailCommand arguments](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-sesv2/Class/SendEmailCommand/) except `Destination`, `Content` and `FromEmailAddress`, which are defined by the previous arguments||

#### Return

The raw SDK [response](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-sesv2/Interface/SendEmailCommandOutput/).

#### Permissions needed

The AWS policy statement to use this function is:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail"
      ],
      "Resource": [
        "<identity arn>"
      ]
    }
  ]
}
```
