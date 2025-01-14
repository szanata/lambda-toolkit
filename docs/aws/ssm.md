# SSM

Abstraction over `@aws-sdk/client-ssm`

## Index
- [`fn` get](#fn-get)

## Members

### `fn` publish

Get the value of an SSM Parameter. Abstracts the `GetParameterCommand`. It will return the value decrypted.

Example:
```js
const { aws: { ssm } } = require( '<this-library>' );

const value = await ssm.get( 'my-param' );
console.log( value );
```

This functions caches the value, so if the same parameter is retrieved twice, or it is retrieved in a re used environment (warm start), the value will come from cache.

```js
const { aws: { ssm } } = require( '<this-library>' );

await ssm.get( 'my-param' ); // set to cache

const now = Date.now();
await ssm.get( 'my-param' ); // retrieves from cache
assert.equal( now, 0 );
```

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|name|String|The name of the SSM Parameter to retrieve the value||

#### Return

The value of the SSM Parameter, decrypted.

#### Permissions needed

The AWS policy statement to use this function is:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ssm:GetParameter"
      ],
      "Resource": [
        "<ssm parameter arn>"
      ]
    }
  ]
}
```
