# Timestream Write

Abstraction over `@aws-sdk/client-timestream-write`.

Namespace: `aws.timestream_write.`

## Index
- [client](#client)
- [`fn` writeRecords](#fn-writerecords)

## Client

The SDK's TimeStream Write client is instantiated with the following options:
```js
{
  maxRetries: 10,
  httpOptions: { timeout: 60000, agent: new Agent( { maxSockets: 5000 } ) }
};
```

## Members

### `fn` writeRecords

Sends a query to TimeStream and return the result, parsed. Abstracts the `QueryCommand`.

Example:
```js
const { aws: { timestreamWrite } } = require( '<this-library>' );

const { items } = await timestreamWrite.writeRecords( {
  database: 'my-db',
  table: 'my-table',
  records: [
    {
      Dimensions: [
        { Name: 'color', DimensionValueType: 'VARCHAR', Value:  'red' },
      ],
      Time: String( Date.now() ),
      TimeUnit: 'MILLISECONDS',
      MeasureName: 'intensity', MeasureValue: '87', MeasureValueType: 'DOUBLE'
    }
  ]
} );
```

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|options|Object|The root object with all the arguments. See below||
|options.database|String|The name of the Timestream database to insert data to||
|options.table|String|The name of the Timestream table to insert data to||
|options.record|Array<Object>|The records to insert. Each value of the array is a records have to comply to [_Records](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-timestream-write/Interface/_Record/) interface as expected by the SDK.||
|options.ignoreRejections|Boolean|Fi set to `true`, [`RejectedRecordsException`](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-timestream-write/Class/RejectedRecordsException/) will not be throws, instead the function will return the [rejectedRecords](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-timestream-write/Interface/RejectedRecord/).|false|

#### Return

Either an object with `recordsIngested` property, which is the same as [`RecordsIngestions`](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-timestream-write/Interface/WriteRecordsCommandOutput/) from SDK, or an object with `rejectedRecords`, with the value from [`RejectRecordsException`](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-timestream-write/Class/RejectedRecordsException/) if this exception is thrown and `ignoreRejections` was set to `true`.

#### Permissions needed

The AWS policy statement to use this function is:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "timestream:DescribeEndpoints"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "timestream:WriteRecords"
      ],
      "Resource": [
        "<timestream table arn>"
      ]
    }
  ]
}
```
