# Getting started

## Requirements

- Node.js `>=20.11`.
- An AWS Lambda runtime (or any environment with AWS credentials) for the `aws` modules.

## Install

```sh
npm install lambda-toolkit
```

The AWS SDK clients are `peerDependencies`. The Lambda Node.js runtime already ships them, so you don't need to deploy them, but you need them locally to run and test your code. Install only the ones for the services you use, as dev dependencies:

```sh
npm install --save-dev @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb @aws-sdk/client-sqs
```

When bundling for deploy, mark them as external so they are not included in your bundle. For example, with webpack:

```js
{
  externals: [ /@aws-sdk\/*/ ]
}
```

Both ESM and CJS builds are provided; Node.js picks the right one automatically.

## A first handler

An API Gateway Lambda that reads an item from DynamoDB and queues a message on SQS:

```js
import { LambdaApi, aws } from 'lambda-toolkit';

const { dynamo, sqs } = aws;
const api = new LambdaApi();

api.addHandler( {
  method: 'GET',
  route: '/orders/{id}',
  fn: async ( { params } ) => {
    const order = await dynamo.get( 'orders', { id: params.id } );
    if ( !order ) {
      return 404;
    }
    await sqs.sendMessage( process.env.AUDIT_QUEUE_URL, { action: 'read', orderId: order.id } );
    return [ 200, order ];
  }
} );

export const handler = async event => api.process( event );
```

What happens here:

- No SDK client is created by hand. `dynamo` and `sqs` create their client the first time a method is used, and reuse it on warm starts.
- `dynamo.get( table, key )` returns the item already unmarshalled to plain JS, or `undefined` if it does not exist.
- `sqs.sendMessage( queueUrl, body )` serializes objects with `JSON.stringify` and returns the `MessageId`.
- The handler's return value becomes the HTTP response: a number is a status code, `[ status, body ]` sets both, and object bodies are sent as JSON. See [HTTP Response](./lambda_api/index.md#http-response).

## Core ideas of the `aws` modules

**Lazy, cached clients.** Each module (`aws.s3`, `aws.sqs`, …) is an object of functions. The SDK client behind it is created on first use and cached globally, so warm Lambda invocations reuse it. See [Caching](./aws/index.md#caching).

**Custom configuration.** Call the module as a function to get the same methods bound to a client with your configuration. Clients with the same configuration are cached and reused:

```js
const s3EU = aws.s3( { region: 'eu-west-1' } );

await s3EU.upload( 'my-bucket', 'report.json', { ok: true } );
```

See [Configuration](./aws/index.md#configuration).

**Native client when you need it.** Every module exposes `getClient()`, which returns the cached native SDK client, for operations the library does not wrap:

```js
import { ListBucketsCommand } from '@aws-sdk/client-s3';

const { Buckets } = await aws.s3.getClient().send( new ListBucketsCommand( {} ) );
```

See [Native client](./aws/index.md#native-client).

**Native arguments.** Most functions take the essentials as plain arguments and accept the remaining SDK command arguments as a last `nativeArgs` object, so nothing the SDK supports is out of reach.

## Beyond AWS

The package also has small, dependency-free helpers:

```js
import { array, epoch, utils } from 'lambda-toolkit';

const batches = array.splitBatches( records, 25 );
const ttl = Date.now() + epoch.days( 7 );
const result = await utils.retryOnError( () => callFlakyService(), { limit: 3, delay: 10 } );
```

## Next steps

- [AWS](./aws/index.md): architecture, caching and the list of service modules.
- [Lambda API](./lambda_api/index.md): routing, hooks, error handlers and the event object.
- [Array](./array/index.md), [Epoch](./epoch/index.md), [Math](./math/index.md), [Object](./object/index.md), [String](./string/index.md), [Utils](./utils/index.md), [Redis](./redis/index.md).
