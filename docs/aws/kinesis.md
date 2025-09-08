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
putRecord( streamName, data, partitionKey, nativeArgs )
```

### Parameters

- `streamName` (string): The name of the stream to write to
- `data` (string|Buffer|object): The data to write. Objects will be JSON stringified
- `partitionKey` (string): The partition key for the record
- `nativeArgs` (object, optional): Additional arguments to pass to the AWS SDK

### Returns

Promise that resolves to the AWS SDK response containing `ShardId` and `SequenceNumber`.

### Example

```js
const { aws: { kinesis } } = require( '<this-library>' );

// Write a simple string
await kinesis.putRecord( 'my-stream', 'Hello World', 'partition-1' );

// Write an object (will be JSON stringified)
await kinesis.putRecord( 'my-stream', { message: 'Hello', timestamp: Date.now() }, 'partition-1' );

// Write with additional options
await kinesis.putRecord( 'my-stream', 'Hello World', 'partition-1', { 
  ExplicitHashKey: 'explicit-hash-key' 
} );
```

## putRecords

Writes multiple data records to a Kinesis data stream in a single call.

### Signature

```js
putRecords( streamName, records, nativeArgs )
```

### Parameters

- `streamName` (string): The name of the stream to write to
- `records` (array): Array of record objects with `Data` and `PartitionKey` properties
- `nativeArgs` (object, optional): Additional arguments to pass to the AWS SDK

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

await kinesis.putRecords( 'my-stream', records );
```

## getRecords

Retrieves records from a Kinesis data stream's shard.

### Signature

```js
getRecords( shardIterator, nativeArgs )
```

### Parameters

- `shardIterator` (string): The shard iterator returned by `getShardIterator`
- `nativeArgs` (object, optional): Additional arguments to pass to the AWS SDK

### Returns

Promise that resolves to the AWS SDK response containing `Records`, `NextShardIterator`, and `MillisBehindLatest`.

### Example

```js
const { aws: { kinesis } } = require( '<this-library>' );

const shardIterator = await kinesis.getShardIterator( 'my-stream', 'shard-000000000000', 'LATEST' );
const records = await kinesis.getRecords( shardIterator );

console.log( records.Records ); // Array of records
console.log( records.NextShardIterator ); // Iterator for next read
```

## getShardIterator

Gets a shard iterator for a Kinesis data stream's shard.

### Signature

```js
getShardIterator( streamName, shardId, shardIteratorType, nativeArgs )
```

### Parameters

- `streamName` (string): The name of the stream
- `shardId` (string): The ID of the shard
- `shardIteratorType` (string): The type of shard iterator ('AT_SEQUENCE_NUMBER', 'AFTER_SEQUENCE_NUMBER', 'TRIM_HORIZON', 'LATEST', 'AT_TIMESTAMP')
- `nativeArgs` (object, optional): Additional arguments to pass to the AWS SDK

### Returns

Promise that resolves to the AWS SDK response containing `ShardIterator`.

### Example

```js
const { aws: { kinesis } } = require( '<this-library>' );

// Get iterator for latest records
const iterator = await kinesis.getShardIterator( 'my-stream', 'shard-000000000000', 'LATEST' );

// Get iterator from a specific timestamp
const timestampIterator = await kinesis.getShardIterator( 'my-stream', 'shard-000000000000', 'AT_TIMESTAMP', {
  Timestamp: new Date( '2023-01-01T00:00:00Z' )
} );
```

## describeStream

Describes the specified Kinesis data stream.

### Signature

```js
describeStream( streamName, nativeArgs )
```

### Parameters

- `streamName` (string): The name of the stream to describe
- `nativeArgs` (object, optional): Additional arguments to pass to the AWS SDK

### Returns

Promise that resolves to the AWS SDK response containing stream details including `StreamDescription`.

### Example

```js
const { aws: { kinesis } } = require( '<this-library>' );

const streamInfo = await kinesis.describeStream( 'my-stream' );
console.log( streamInfo.StreamDescription.StreamStatus );
console.log( streamInfo.StreamDescription.Shards );
```

## listStreams

Lists the Kinesis data streams.

### Signature

```js
listStreams( nativeArgs )
```

### Parameters

- `nativeArgs` (object, optional): Additional arguments to pass to the AWS SDK

### Returns

Promise that resolves to the AWS SDK response containing `StreamNames` and `HasMoreStreams`.

### Example

```js
const { aws: { kinesis } } = require( '<this-library>' );

const streams = await kinesis.listStreams();
console.log( streams.StreamNames ); // Array of stream names

// List streams with a prefix
const filteredStreams = await kinesis.listStreams( { StreamNameCondition: { ComparisonOperator: 'BEGINS_WITH', ComparisonValue: 'my-' } } );
```
