# AWS

These are functions to make it simpler and convenient to interact with some AWS services using the SDK v3.

They abstract instantiations  and re-usage of clients, usage and data parsing for some operations. Keep in minds only a handful of operations are covered here.

## Index

- [Basics](#basics)
- [Architecture](#architecture)
- [Instantiation](#instantiation)
- [Configuration](#configuration)
- [Caching](#caching)
- [Native client](#native-client)
- [Modules List](#modules-list)

## Basics
First, lets look how to an operation with the SDK v3 itself, lets use dynamo.

```js
const { DynamoDBClient } = require( '@aws-sdk/client-dynamodb' );
const { DynamoDBDocumentClient, GetCommand } = require( '@aws-sdk/lib-dynamodb' );

const client = new DynamoDBClient( {} );
const docClient = DynamoDBDocumentClient.from( client );

const command = new GetCommand( {
  TableName: 'example-table',
  Key: {
    Id: '123'
  }
} );

const response = await docClient.send( command );

console.log( response.Item ); // is the actual row
```

Now, the same operation using this library:

```js
const { aws { dynamo } } = require( '<this-library>' );

const item = await dynamo.find( 'example-table' , { id: '123' } );

console.log( item ); // the actual row
```

As you can see the operation was greatly simplified, without any instantiations and with query syntax sugar.

All the functions were designed with easy of use first. Overall the method name matches the name of the native SDK operation, but not always, like in the example above `getItem` is `find` in the library. See individual modules for documentation.

## Architecture

The `aws` module exports different objects each representing one distinct AWS service, like `s3`, `sns`, `dynamo`. Each of these has methods representing different commands. See individual modules for documentation.

### Instantiation

Given:

```js
const { aws: { s3 } } = require( '<this-library>' );

const response = await s3.download( 'example-bucket', 'foo/bar.json' );
```

You notice that there is no explicit `new` operator involved, but it indeed used an SDK client instance. This is because instantiation itself only happened when an actual method of the object `s3` was used.

### Configuration

Since there is no explicit instantiation, what parameters are used to create each client? It varies per module, but mostly they use the default parameters, and the credentials from the env variables (as they would in the AWS Lambda), but sometimes there will be cases where custom configurations are necessary. There is a feature for that: each module object is also a _factory_ function, which takes the native arguments used to initialize the SDK clients:

```js
const { aws: { sqs } } = require( '<this-library>' );

const client = sqs( { endpoint: 'custom-endpoint' } );

await client.sendMessage( queueName, message );
```

In the example above the call to `sqs()` as a function returned a client, this client is not the native client, it is the same as the `sqs` object, with the same methods, just it was instantiated a that precised line with those precise parameters.

These custom clients are not the same as the default object. They are a new instance, explicit created, so:

```js
const { aws: { sqs } } = require( '<this-library>' );

const client1 = sqs( { endpoint: 'my-custom-endpoint-1' } );

assert.notDeepEqual( sqs, client );
```

```js
And many can be created as well:

const { aws: { sqs } } = require( '<this-library>' );

const client1 = sqs( { endpoint: 'my-custom-endpoint-1' } );
const client2 = sqs( { endpoint: 'my-custom-endpoint-2' } );


assert.notDeepEqual( client1, client2 );
```

But, just calling the _factory_ function does not guarantee a new instance, if the arguments used are the exact same as the default client uses (which in most cases are none), the same client is returned (see [caching](#caching)):

```js
const { aws: { sqs } } = require( '<this-library>' );

const client = sqs();

assert.deepEqual( sqs, client );
```

### Caching

After calling one method of the object, causing the client it initialization, further calls will re-use the same client, so to not initialize the client again:

```js
const { aws: { sqs } } = require( '<this-library>' );

await sqs.sendMessage( queueName, message ); // causes the underlying initialization
await sqs.sendMessage( queueName, message ); // uses from cache
```

But how about lambdas warm starts? In summary during a warm start the lambda re-uses its container and will reuse global defined variables and instances. So, to take advantage of that all clients are cached globally at the moment of its initialization, so if the lambda is invoked with a reused environment, the clients are already available: 

Example on a lambda __COLD__ start
```js
const { aws: { sqs } } = require( '<this-library>' );

await sqs.sendMessage( queueName, message ); // causes initialization
await sqs.sendMessage( queueName, message ); // from cache
```

Example on a lambda __HOT__ start
```js
const { aws: { sqs } } = require( '<this-library>' );

await sqs.sendMessage( queueName, message ); // from cache
await sqs.sendMessage( queueName, message ); // from cache
```

And how about custom [configurations](#configuration), how them affect cache? The cache key of the client is not only the client name, but also the configs used to create it, so if a client is initialized using the _factory_ feature with different arguments it will occupy a different cache position then the other client:

```js
const { aws: { sqs } } = require( '<this-library>' );

const client = sqs( { endpoint: 'my-custom-endpoint' } ); // saves sqs({endpoint:'my-custom-endpoint'}) to the cache
await sqs.sendMessage( queueName, message ); // sqs sqs(default) to the cache

client.sendMessage( queueName, message ); // re-uses sqs({endpoint:'my-custom-endpoint'}) from cache
await sqs.sendMessage( queueName, message ); // re-uses sqs(default) from cache
```

And the same goes for __WARM__ starts:

```js
const { aws: { sqs } } = require( '<this-library>' );

const client = sqs( { endpoint: 'my-custom-endpoint' } ); // re-uses sqs({endpoint:'my-custom-endpoint'}) from cache
await sqs.sendMessage( queueName, message ); // re-uses sqs(default) from cache
```

The entire used configuration is part of the key, so different configs result in different cache positions:

```js
const { aws: { sqs } } = require( '<this-library>' );

const client1 = sqs( { endpoint: 'my-custom-endpoint-1' } ); // saves sqs({endpoint:'my-custom-endpoint-1'}) to the cache
const client2 = sqs( { endpoint: 'my-custom-endpoint-2' } ); // saves sqs({endpoint:'my-custom-endpoint-1'}) to the cache
```

### Native client
Of course this library is not a one size fits all, and some times you need to use the native SDK. This library has a convenient way to expose you the native AWS client without you actually needing to instantiate it and also benefiting from the [cache](#caching):

```js
const { s3 } = require( '<this-library>' );
const { GetObjectCommand } = require( '@aws-sdk/client-s3' );

const command = new GetObjectCommand( {
  Bucket: 'example-bucket',
  Key: 'foo/bar'
} );

const response = await s3.getClient.send( command );
```

In this example `getClient` returns a native `S3Client` instance.

This is true for all modules, except `dynamo`, which has an special behavior:

```js
const { dynamo } = require( '<this-library>' );
const { GetCommand } = require( '@aws-sdk/lib-dynamodb' );

// now the native bits work
const command = new GetCommand( {
  TableName: 'example-table',
  Key: {
    Id: '123'
  }
} );

const response = await dynamo.getClient.send( command );
```

In this example `getClient` returns a `DynamoDBDocumentClient` instance, but it also instantiated the underlying `DynamoDBClient`.

This because the `DynamoDBDocumentClient` makes much more convenient to work with data operations and this abstraction was conceived for just that. So the `.getClient` will always return it. However as it seem you send any command from `@aws-sdk/client-dynamodb` to it, not only those from `@aws-sdk/lib-dynamodb`, as both extends the default [AWS client with the same configs](#https://github.com/aws/aws-sdk-js-v3/blob/cdd7ff75f23aad2225de7f423aa9238bf0e0fa3c/lib/lib-dynamodb/src/DynamoDBDocumentClient.ts#L82).

## Modules List

- [Athena (athena.*)](./athena.md)
- [DynamoDB (dynamo.*)](./dynamo.md)
- [Lambda (lambda.*)](./lambda.md)
- [S3 (s3.*)](./s3.md)
- [SESv2 (ses.*)](./ses.md)
- [SNS (sns.*)](./sns.md)
- [SQS (sqs.*)](./sqs.md)
- [SSM (ssm.*)](./ssm.md)
- [TimestreamQuery (timestreamQuery.*)](./timestream_query.md)
- [TimestreamWrite (timestreamWrite.*)](./timestream_write.md)
