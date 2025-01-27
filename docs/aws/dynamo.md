# Dynamo

Abstraction over `@aws-sdk/client-dynamodb` and `@aws-sdk/lib/dynamodb`.

Namespace: `aws.dynamo.`

## Index
- [client](#client)
- [`fn` get](#fn-get)
- [`fn` putBatch](#fn-putbatch)
- [`fn` put](#fn-put)
- [`fn` query](#fn-query)
- [`fn` removeBatch](#fn-removebatch)
- [`fn` remove](#fn-remove)
- [`fn` scan](#fn-scan)
- [`fn` smartUpdate](#fn-smartupdate)
- [`fn` transact-write](#fn-transactwrite)
- [`fn` update](#fn-update)

## Client

This module uses two clients, `DynamoDBClient` and `DynamoDBDocumentClient`. The former is instantiated with no options. The second is initialized with the following [configuration](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_lib_dynamodb.html#dynamodbdocumentclientresolvedconfig-1):

- `marshallOptions.convertEmptyValues = true`, which will convert empty strings, blobs and sets to null;
- `marshallOptions.removeUndefinedValues = true`, Remove undefined values while marshalling.
- `marshallOptions.convertClassInstanceToMap = true` Convert object to "map" attribute.
- `unmarshallOption.wrapNumbers = false` Return numbers as native JavaScript numbers.

Keep in mind that `.getClient` method that is exposed here, as well in all other modules, will return a `DynamoDBDocumentClient` instance.

Since all commands are dispatched to `DynamoDBDocumentClient`, all data returned is already parsed to JS native types. See this the table at [this document](./dynamo_types_conversion.md) for reference.

## Members

### `fn` get

This function is an abstraction for DynamoDB's `getItem` action, using `GetCommand`. It will retrieve a single row from the database by its key, either with a convenient syntax sugar, or with the native arguments.

```js
const { aws: { dynamo } } = require( '<this-library>' );

const item = await dynamo.get( table, { pk: '123' } );
```

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|_If first argument is object_|
|nativeArgs|Object|The `lib-dynamodb` SDK [GetCommand arguments](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/Class/GetCommand/)||
|_If first argument is string_|
|tableName|String|The name of the table||
|key|Object|An object containing the key (or keys) properties of the record to retrieve||

#### Return

The dynamodb row or null if it was not found.

#### Permission

The AWS policy statement to use this function is:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "dynamodb:GetItem"
    ],
    "Resource": [
      "<dynamodb table arn>"
    ]
  }]
}
```

### `fn` putBatch

This function is an abstraction for DynamoDB's `batchWrite` action, using `BatchWriteCommand`. It will upsert many records at once.

```js
const { aws: { dynamo } } = require( '<this-library>' );

// syntax sugar
const items = [
  { id: '1', name: 'Charles Band' },
  { id: '2', name: 'Roger Corman' },
  { id: '3', name: 'Menahem Golan' }
]
await dynamo.putBatch( table, items );
```

It is possible to pass any number of items to upsert, the function will manage the limits and do many operations if necessary, the function will also retry failed items if possible until all items are upserted.

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|tableName|String|The table to perform the upsert||
|records|Array\<Object\>|The records to upsert on the table||

#### Return

No return.

#### Permission

The AWS policy statement to use this function is:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "dynamodb:BatchWriteItem"
    ],
    "Resource": [
      "<dynamodb table arn>"
    ]
  }]
}
```

### `fn` put

This function is an abstraction for DynamoDB's `putItem` action, using `PutCommand`. It will upsert a record to the database, either with a convenient syntax sugar, or with the native arguments. If using the syntax sugar, the options `ReturnValues`, `ReturnConsumedCapacity` are both set to `'NONE'`.

```js
const { aws: { dynamo } } = require( '<this-library>' );

// syntax sugar
await dynamo.put( table, { id: '123', name: 'Roger' } );

// native args
await dynamo.put( {
  TableName: 'my-table',
  ConditionExpression: 'attribute_not_exists(id)',
  Item: { id: '123', name: 'Roger' }
} );
```

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|_If first argument is object_|
|nativeArgs|Object|The `lib-dynamodb` SDK [PutCommand arguments](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/Class/PutCommand/)||
|_If first argument is string_|
|tableName|String|The name of the table||
|record|Object|The record to upsert on the table||

#### Return

It returns the inserted item.

#### Permission

The AWS policy statement to use this function is:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "dynamodb:UpdateItem"
    ],
    "Resource": [
      "<dynamodb table arn>"
    ]
  }]
}
```

### `fn` query

Query is identical to scan, the only difference is that it uses `QueryCommand`. See documentation (below)[#Scan].

### `fn` removeBatch

This function is an abstraction for DynamoDB's `batchWrite` action, using `BatchWriteCommand`. It will remove many records at once.

```js
const { aws: { dynamo } } = require( '<this-library>' );

// syntax sugar
const keys = [
  { id: '1' },
  { id: '2' },
  { id: '3' }
]
await dynamo.removeBatch( table, keys );
```

It is possible to pass any number of items to remove, the function will manage the limits and do many operations if necessary, the function will also retry failed items if possible until all items are removed.

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|tableName|String|The table to perform the removal||
|keys|Array\<Object\>|Array of rows keys to remove||

#### Return

No return.

#### Permission

The AWS policy statement to use this function is:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "dynamodb:BatchWriteItem"
    ],
    "Resource": [
      "<dynamodb table arn>"
    ]
  }]
}
```

### `fn` remove

This function is an abstraction for DynamoDB's `remove` action, using `RemoveCommand`. It will remove a single record.

```js
const { aws: { dynamo } } = require( '<this-library>' );

const removedItem = await dynamo.remove( table, { id: '123' } );
```

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|tableName|String|The name of the table||
|key|Object|An object containing the key (or keys) properties of the record to retrieve||

#### Return

It returns the removed item.

#### Permission

The AWS policy statement to use this function is:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "dynamodb:RemoveItem"
    ],
    "Resource": [
      "<dynamodb table arn>"
    ]
  }]
}
```

### `fn` scan

This function is an abstraction for DynamoDB's `scan` action, using `ScanCommand`. It will fetch rows from the table.

```js
const { aws: { dynamo } } = require( '<this-library>' );

const { items, count } = await dynamo.scan( {
  TableName: tableName,
  FilterExpression: '#att = :v',
  ExpressionAttributeNames: { '#att': 'color' },
  ExpressionAttributeValues: { ':v': 'red' }
}, { recursive: true } );
```

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|nativeArgs|Object|The `lib-dynamodb` SDK [ScanCommand arguments](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/Class/ScanCommand/)||
|options|Object|An object containing extra options||
|options.recursive|Boolean|If true the operation will retrieve all results, otherwise just the first page|false|
|options.paginationToken|String|If recursive is false this can provide the token to resume the operation from the previous page. Keep in mind that native arguments `ExplicitStartKey` will be overwritten by this value if provided.||

#### Return

An object containing the data:

|Property|Type|Description|
|-|-|-|
|items|Array\<Object\>|The rows. Can be null if `Select: 'COUNT'` option on the `nativeArgs` was set|
|count|Number|the number of results.|
|nextToken|String|If `recursive=false` and the operation next pagination, this will have the token to continue it.|

#### Features

#### Paginate
If a table has many items and each page has to be return separately, use the pagination strategy:

```js
let paginationToken;
do {
  const { items, nextToken } = await dynamo.scan( { TableName: 'my-table' }, { paginationToken } );
  await sendResults( items );
  paginationToken = nextToken;
} while( paginationToken );
```

#### Recursion
If the table has many item but a single return is desired, this can be achieved using the `recursive` option:
```js
const { items } = await dynamo.scan( { TableName: 'my-table' }, { recursive: true } );
```

The function will internally repeat the operation as many times as necessary until there is no more result pages to retrieve.

#### Recursion + Limit

If using `recursive=true` and `Limit` property of the `nativeArgs`, the operation will be repeat if there is another page and the sum of results so far is less than the `Limit`. This is especially useful when using `FilterExpression` which counts data before applying the filter, which would cause a scan or query operation with a limit of 100 possible returning no data, even though there is data ahead in the table, because it already passed thru 100 rows:

```js
const { items } = await dynamo.scan( {
  TableName: tableName,
  FilterExpression: '#att = :v',
  ExpressionAttributeNames: { '#att': 'color' },
  ExpressionAttributeValues: { ':v': 'red' },
  Limit: 10
}, { recursive: true } );
```

In the above operation, it will scan the whole table until it finds at least 10 records that match the filter. __Keep in mind it will possible return up to `(Limit * 2)` record.__

#### Permission

The AWS policy statement to use this function is:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "dynamodb:Scan" // or :Query
    ],
    "Resource": [
      "<dynamodb table arn>"
    ]
  }]
}
```

### `fn` smartUpdate

This function is an abstraction for DynamoDB's `updateItem` action, using `UpdateCommand`. It will update an record by it has a friendly syntax to make it simple to do common update features.

```js
const { aws: { dynamo } } = require( '<this-library>' );

await dynamo.smartUpdate( tableName, { id: '123' }, { foo: 'bar' } );
```

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|tableName|String|The table to perform the update||
|key|Object|An object containing the key (or keys) properties of the record to retrieve||
|updates|Object|The updates to make at record in a key value format, where key is the property to update||

#### Features

##### Updating nesting properties

In order to update nested property use the dot syntax.

Given a record:
```js
{
  id: '123',
  actor: {
    name: 'Mark'
  }
}
```

In order to update the name use:

```js
await dynamo.smartUpdate( tableName, { id: '123' }, { 'actor.name': 'Johnny' } );
```

##### Updating array positions

In order to update a specific position of an array use the dot syntax with the array notation `[]`.

Given a record:
```js
{
  id: '123',
  actors: [
    {
      name: 'Mark'
    },
    {
      name: 'Dani'
    }
  ]
}
```

In order to update the name of the second actor use:

```js
await dynamo.smartUpdate( tableName, { id: '123' }, { 'actor[1].name': 'Johnny' } );
```

_Array indexes start at 0._

##### Removing properties

In order to remove properties from the record (DynamoDB `REMOVE` operator), one can set the value to explicit `undefined`.

Given a record:
```js
{
  id: '123'
  model: 'Corolla',
  maker: 'Toyota',
  color: 'red'
}
```

In order to remove the property `color`, use:

```js
await dynamo.smartUpdate( tableName, { id: '123' }, { color: undefined } );
```

Any of those features can be combined together as well.

#### Return

The `Attributes` of the updated item.

#### Permission

The AWS policy statement to use this function is:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "dynamodb:UpdateItem"
    ],
    "Resource": [
      "<dynamodb table arn>"
    ]
  }]
}
```

### `fn` transact-write

This function is an abstraction for DynamoDB's `transactWrite` action, using `TransactWriteCommand`. It will send write commands within a transaction.

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|items|Object|The `TransactItems` argument of `lib-dynamodb` SDK [TransactWriteCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/TypeAlias/TransactWriteCommandInput/)||

#### Return

The raw response from the database.

#### Permission

Depends on the operations used.

### `fn` update

This function is an abstraction for DynamoDB's `updateItem` action, using `UpdateCommand`. It will dispatch the update statement. By default it sets the `ReturnValues` to `ALL_NEW`, but this can be overwritten by the arguments.

```js
const { aws: { dynamo } } = require( '<this-library>' );

await dynamo.update( {
  TableName: 'my-table',
  Key: { id: '123' },
  ReturnValues: 'ALL_OLD',
  UpdateExpression: 'set #foo = :bar',
  ConditionExpression: 'attribute_exists(#id)',
  ExpressionAttributeNames: { '#id': 'id', '#foo': 'foo' },
  ExpressionAttributeValues: { ':bar': 'bar' }
} );
```

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|nativeArgs|Object|The `lib-dynamodb` SDK [UpdateCommand arguments](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-lib-dynamodb/Class/UpdateCommand/)||

#### Return

The `Attributes` property of the SDK results.

#### Permission

The AWS policy statement to use this function is:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "dynamodb:UpdateItem"
    ],
    "Resource": [
      "<dynamodb table arn>"
    ]
  }]
}
```
