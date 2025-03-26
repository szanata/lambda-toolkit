# CloudWatchLogs

Abstraction over `@aws-sdk/client-cloudwatch-logs`.

Namespace: `aws.cw_logs.`

## Index
- [client](#client)
- [`fn` query](#fn-query)

## Client

The SDK's CloudWatchLogs client is instantiated with not options.

## Members

### `fn` query

Executes an CloudWatch Log Insights query and returns the result. This abstraction combines: `StartQueryCommand`, `GetQueryResultsCommand` in just one async call.

This commands starts a CloudWatch query and waits it to complete, finally returning the results.

Example:
```js
const { aws: { cwLogs } } = require( '<this-library>' );

const { items } = await cwLogs.query( {
  logGroupName: "/aws/lambda/example",
  queryLanguage: "CWLI",
  queryString: "fields @timestamp",
  endTime: 1733014800,
  startTime: 1733011200,
  limit: 100
} );
```

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|nativeArgs|Object|The native SDK [StartQueryCommand arguments](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cloudwatch-logs/command/StartQueryCommand/)||
|options|Object|Extra options||
|options.range|Object|Since the nativeArgs "startTime" and "endTime" are second based epochs, the "range" argument accepts milliseconds based epochs for convenience, thus overwriting the values from "nativeArgs"||
|options.range.from|Number|The beginning of the time range to query, overwrites "startTime"||
|options.range.to|Number|The end of the time range to query, overwrites "endTime"||

#### Return

A query result object containing the data returned by Cloudwatch, parsed.

The query result object has this structure:
|Property|Type|Description|
|-|-|-|
|items|Array\<Object\>|The log query result parsed to a simple array of plain objects|
|count|Number|The number of results|

#### Data parsing

The query results from Cloudwatch are converted to an array of plain objects, where the key comes from each returned item "field", and the value from "value". Since all returned values are string, some are converted to JS primitives.

Given this query result:
```json
[
  [
    {
      "field": "@timestamp",
      "value": "2025-03-22 00:00:01.763"
    },
    {
      "field": "accepted",
      "value": "false"
    },
    {
      "field": "size",
      "value": "12"
    },
    {
      "field": "event",
      "value": "incoming-record"
    }
  ]
]
```

The parsed results are simply:

```js
{
  items: [
    {
      "@timestamp": new Date( '2025-03-22 00:00:01.763' ),
      accepted: false,
      size: 12,
      event: 'incoming-record'
    }
  ],
  count: 1
}
```

As for the values conversion, it follows this rules:

|Cloudwatch Value|Converted Type|
|-|-|
|`"false"`, `"true"`|Boolean|
|`null`, `undefined`|undefined|
|`YYYY-MM-DD`<br/>`YYYY-MM-DDTHH:mm:ss`<br/>`YYYY-MM-DD HH:mm:ss`<br/>`YYYY-MM-DDTHH:mm:ssZ`<br/>`YYYY-MM-DD HH:mm:ssZ`<br/>`YYYY-MM-DDTHH:mm:ss.sss`<br/>`YYYY-MM-DD HH:mm:ss.sss`<br/>`YYYY-MM-DDTHH:mm:ss.sssZ`<br/>`YYYY-MM-DD HH:mm:ss.sssZ`<br/>`YYYY-MM-DDTHH:mm:ss.sss+HH:mm`<br/>`YYYY-MM-DD HH:mm:ss.sss+HH:mm`|Date|
|Numbers between __MIN_SAFE_INTEGER__ and __MAX_SAFE_INTEGER__|Number (_integer_)|
|Numbers between __MIN_SAFE_INTEGER__ and __MAX_SAFE_INTEGER__ with decimal point and up to __16__ digits|Number (_float_)|
|Any other value|String|

#### Pagination

There is no pagination. The query will return once all results in the range are found or the limit is reach.

#### Permissions needed

The AWS policy statement to use this function is:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "logs:StartQuery",
      "logs:StopQuery",
      "logs:GetQueryResults"
    ],
    "Resource": [
      "<cloudwatch log stream arn>"
    ]
  }]
}
```
