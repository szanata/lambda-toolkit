# Kinesis

Functions to interact with Amazon Kinesis Data Streams using the AWS SDK v3.

Namespace: `aws.kinesis`.

## Index

- [putRecord](#putrecord)
- [putRecords](#putrecords)
- [getRecords](#getrecords)
- [getShardIterator](#getsharditerator)
- [describeStream](#describestream)
- [listStreams](#liststreams)

## putRecord

Writes a single data record to a Kinesis data stream.

### Signature

```js
putRecord( client, streamName, data, partitionKey, options )
```

### Parameters

- `client` (object): AWS Kinesis client instance
- `streamName` (string): The name of the stream to write to
- `data` (string|Buffer|object): The data to write. Objects will be JSON stringified
- `partitionKey` (string): The partition key for the record
- `options` (object, optional): Additional options to pass to the AWS SDK. Defaults to `{ explicitHashKey: null, sequenceNumberForOrdering: null, streamArn: null }`

### Returns

Promise that resolves to the AWS SDK response containing `ShardId` and `SequenceNumber`.

### Example

```js
const { aws: { kinesis } } = require( '<this-library>' );

// Write a simple string
await kinesis.putRecord( client, 'my-stream', 'Hello World', 'partition-1' );

// Write an object (will be JSON stringified)
await kinesis.putRecord( client, 'my-stream', { message: 'Hello', timestamp: Date.now() }, 'partition-1' );

// Write with additional options
await kinesis.putRecord( client, 'my-stream', 'Hello World', 'partition-1', { 
  explicitHashKey: 'explicit-hash-key',
  streamArn: 'arn:aws:kinesis:us-east-1:123456789012:stream/my-stream'
} );

// Write with sequence number for ordering
await kinesis.putRecord( client, 'my-stream', 'Ordered Message', 'partition-1', {
  sequenceNumberForOrdering: '49590338271490256608559692538361571095921575989136588898'
} );
```

## putRecords

Writes multiple data records to a Kinesis data stream in a single call.

### Signature

```js
putRecords( client, streamName, records, options )
```

### Parameters

- `client` (object): AWS Kinesis client instance
- `streamName` (string): The name of the stream to write to
- `records` (array): Array of record objects with `Data` and `PartitionKey` properties
- `options` (object, optional): Additional options to pass to the AWS SDK. Defaults to `{ streamArn: null }`

### Returns

Promise that resolves to the AWS SDK response containing `FailedRecordCount` and `Records` array.

### Example

```js
const { aws: { kinesis } } = require( '<this-library>' );

const records = [
  { Data: 'Record 1', PartitionKey: 'partition-1' },
  { Data: { message: 'Record 2', id: 123 }, PartitionKey: 'partition-2' },
  { Data: 'Record 3', PartitionKey: 'partition-1' }
];

// Basic usage
await kinesis.putRecords( client, 'my-stream', records );

// With additional options
await kinesis.putRecords( client, 'my-stream', records, { 
  streamArn: 'arn:aws:kinesis:us-east-1:123456789012:stream/my-stream' 
} );
```

## getRecords

Retrieves records from a Kinesis data stream's shard.

### Signature

```js
getRecords( client, shardIterator, options )
```

### Parameters

- `client` (object): AWS Kinesis client instance
- `shardIterator` (string): The shard iterator returned by `getShardIterator`
- `options` (object, optional): Additional options to pass to the AWS SDK. Defaults to `{ limit: null, streamArn: null, recursive: false, paginationToken: null }`

### Returns

Promise that resolves to an object containing:
- `records` (array): Array of records
- `count` (number): Number of records retrieved
- `millisBehindLatest` (number): Number of milliseconds the records are behind the latest
- `nextToken` (string, optional): Encoded token for pagination (if `recursive` is false and more records available)

### Example

```js
const { aws: { kinesis } } = require( '<this-library>' );

const shardIterator = await kinesis.getShardIterator( client, 'my-stream', 'shard-000000000000', 'LATEST' );

// Basic usage
const result = await kinesis.getRecords( client, shardIterator );
console.log( result.records ); // Array of records
console.log( result.count ); // Number of records

// With recursive option to get all records
const allRecords = await kinesis.getRecords( client, shardIterator, { 
  recursive: true,
  limit: 1000 
} );

// With pagination
const paginatedResult = await kinesis.getRecords( client, shardIterator, { 
  limit: 10,
  paginationToken: 'encoded-token' 
} );
```

## getShardIterator

Gets a shard iterator for a Kinesis data stream's shard.

### Signature

```js
getShardIterator( client, streamName, shardId, shardIteratorType, options )
```

### Parameters

- `client` (object): AWS Kinesis client instance
- `streamName` (string): The name of the stream
- `shardId` (string): The ID of the shard
- `shardIteratorType` (string): The type of shard iterator ('AT_SEQUENCE_NUMBER', 'AFTER_SEQUENCE_NUMBER', 'TRIM_HORIZON', 'LATEST', 'AT_TIMESTAMP')
- `options` (object, optional): Additional options to pass to the AWS SDK. Defaults to `{ startingSequenceNumber: null, timestamp: null, streamArn: null }`

### Returns

Promise that resolves to the AWS SDK response containing `ShardIterator`.

### Example

```js
const { aws: { kinesis } } = require( '<this-library>' );

// Get iterator for latest records
const iterator = await kinesis.getShardIterator( client, 'my-stream', 'shard-000000000000', 'LATEST' );

// Get iterator from a specific timestamp
const timestampIterator = await kinesis.getShardIterator( client, 'my-stream', 'shard-000000000000', 'AT_TIMESTAMP', {
  timestamp: new Date( '2023-01-01T00:00:00Z' ),
  streamArn: 'arn:aws:kinesis:us-east-1:123456789012:stream/my-stream'
} );

// Get iterator from a specific sequence number
const sequenceIterator = await kinesis.getShardIterator( client, 'my-stream', 'shard-000000000000', 'AT_SEQUENCE_NUMBER', {
  startingSequenceNumber: '49590338271490256608559692538361571095921575989136588898'
} );
```

## describeStream

Describes the specified Kinesis data stream.

### Signature

```js
describeStream( client, streamName, options )
```

### Parameters

- `client` (object): AWS Kinesis client instance
- `streamName` (string): The name of the stream to describe
- `options` (object, optional): Additional options to pass to the AWS SDK. Defaults to `{ limit: null, streamArn: null, exclusiveStartShardId: null }`

### Returns

Promise that resolves to the AWS SDK response containing stream details including `StreamDescription`.

### Example

```js
const { aws: { kinesis } } = require( '<this-library>' );

// Basic usage
const streamInfo = await kinesis.describeStream( client, 'my-stream' );
console.log( streamInfo.StreamDescription.StreamStatus );
console.log( streamInfo.StreamDescription.Shards );

// With additional options
const streamInfoWithOptions = await kinesis.describeStream( client, 'my-stream', {
  limit: 10,
  streamArn: 'arn:aws:kinesis:us-east-1:123456789012:stream/my-stream'
} );
```

## listStreams

Lists the Kinesis data streams.

### Signature

```js
listStreams( client, options )
```

### Parameters

- `client` (object): AWS Kinesis client instance
- `options` (object, optional): Additional options to pass to the AWS SDK. Defaults to `{ exclusiveStartStreamName: null, limit: null, nextToken: null }`

### Returns

Promise that resolves to an object containing:
- `StreamNames` (array): Array of stream names
- `HasMoreStreams` (boolean): Whether there are more streams available
- `NextToken` (string, optional): Token for pagination if more streams are available

### Example

```js
const { aws: { kinesis } } = require( '<this-library>' );

// Basic usage
const streams = await kinesis.listStreams( client );
console.log( streams.StreamNames ); // Array of stream names

// List streams with a limit
const limitedStreams = await kinesis.listStreams( client, { limit: 50 } );

// List streams with pagination
const paginatedStreams = await kinesis.listStreams( client, { 
  limit: 100,
  nextToken: 'encoded-token' 
} );

// List streams with a prefix filter
const filteredStreams = await kinesis.listStreams( client, { 
  exclusiveStartStreamName: 'my-prefix',
  limit: 25
} );
```
