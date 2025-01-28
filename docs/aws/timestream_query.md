# Timestream Query

Abstraction over `@aws-sdk/client-timestream-query`.

Namespace: `aws.timestream_query.`

## Index
- [client](#client)
- [`fn` query](#fn-query)

## Client

The SDK's TimeStream Query client is instantiated with the following options:
```js
{
  maxRetries: 10,
  httpOptions: { timeout: 60000, agent: new Agent( { maxSockets: 5000 } ) }
};
```

## Members

### `fn` query

Sends a query to TimeStream and return the result, parsed. Abstracts the `QueryCommand`.

Example:
```js
const { aws: { timestreamQuery } } = require( '<this-library>' );

const { items } = await timestreamQuery.query( 'SELECT* FROM "table"', { paginationToken: 'sdh398-0sadsdk-sdjsd1' } );
```

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|queryString|String|The name of the SSM Parameter to retrieve the value||
|options|Object|Additional options for the query. See below||
|options.recursive|Boolean|When the query needs pagination, if this option is `true` the function will paginate itself until the last page and return all results, otherwise it will return the first page only  and the pagination token|false|
|options.paginationToken|String|The value of the token to resume a previous query. Uses the `NextToken` option from the [`QueryCommandOptions`](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-timestream-query/Interface/QueryCommandInput/)|null|
|options.maxRows|Number|The maximum number of rows to return. Uses the `MaxRows` option from the [`QueryCommandOptions`](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-timestream-query/Interface/QueryCommandInput/)|null|
|options.rawResponse|Boolean|If `true`, returns the raw response [object](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-timestream-query/Interface/QueryCommandOutput/). Only work when `recursive` is `false`. Useful for debug purposes|false|

#### Paginate
If the query needs pagination a token is returned with the response and it can be used to resume the operation, retrieving the next page:

```js
const { items: pageOneItems, nextToken: nextToken1 } = await timestreamQuery.query( 'SELECT* FROM "table"' );
const { items: pageTwoItems, nextToken: nextToken2 } = await timestreamQuery.query( 'SELECT* FROM "table"', { paginationToken: nextToken1 } );
const { items: pageThreeItems } = await timestreamQuery.query( 'SELECT* FROM "table"', { paginationToken: nextToken2 } );
// etc
```

Keep in mind the exact same query has to be provided as argument, otherwise it is a new operation and the token is ignored.

#### Recursion
If pagination is necessary but you want the function to recursively handle it, use the option `recursive` to do so:
```js
const { items } = await timestreamQuery.query( 'SELECT* FROM "table"', { recursive: true } );
```

The function will internally repeat the operation as many times as necessary until there is no more result pages to retrieve. It will then combine all results into a single array of items and return it. __Note that this can potentially lead to a timeout error if the recursion takes too long or to an "out of memory" error if there are simple too many records.__

#### Return

An object containing the data:

|Property|Type|Description|
|-|-|-|
|items|Array\<Object\>|The query result rows, parsed from the TimeStream format to plain JS|
|count|Number|the number of results.|
|nextToken|String|If the query still have more result pages, this will have the token to continue it|
|queryStatus|Object|The status of the query, its a copy of [`QueryStatus`](https://docs.aws.amazon.com/timestream/latest/developerguide/API_query_QueryStatus.html) from the response, just camelized|

About the rows parsing, this is how the raw data is converted:

|Time Stream Type|JS Types|Time Stream Value|JS Value|
|-|-|-|-|
|_*Scala Types*_|
|BOOLEAN|Boolean|`"true"`|`true`|
|DOUBLE|Number|`"2.232434"`|`2.232434`|
|TIMESTAMP|Date|`"2025-01-01 10:12:30.333000000"`|`new Date( '2025-01-01T10:12:30.333Z )`|
|INTEGER|Number|`"10"`|`10`|
|UNKNOWN|null|`<anything>`|`null`|
|VARCHAR|String|`"string"`|`"string"`|
|BIGINT|String|`"9223372036854775807"`|`"9223372036854775807"`|
|DATE|String|`"2025-01-01"`|`"2025-01-01"`|
|TIME|String|`"10:33:22.000000000"`|`"10:33:22.000000000"`|
|INTERVAL_DAY_TO_SECOND|`"0 00:00:23.000000000"`|`"0 00:00:23.000000000"`|
|INTERVAL_YEAR_TO_MONTH|`"1-11"`|`"1-11"`|
|_*Null Value*_|
|* w/ `NullValue = true`|null|`undefined`|`null`|
|_*Other Types*_|
|ARRAY|Array|`ARRAY[10,10]`|`[ 10, 10 ]`|
|ROW|Object|`ROW(10,'bar')`|`{ field0: 10, field1: 'bar' }`|
|TIME_SERIES|Array<Object>|`TIMESERIES(ARRAY[ROW(2025-01-01 10:00:00.000000000,10),ROW(2025-01-01 11:00:00.000000000),12]`|`[ { time: new Date( '2025-01-01T10:00' ), value: 10 }, { time: new Date( '2025-01-01T11:00', value: 12 } ]`|

#### Permissions needed

The AWS policy statement to use this function is:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "timestream:CancelQuery",
        "timestream:SelectValues",
        "timestream:DescribeEndpoints"
      ],
      "Resource": [
        "*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "timestream:DescribeTable",
        "timestream:ListMeasures",
        "timestream:Select"
      ],
      "Resource": [
        "<timestream table arn>"
      ]
    }
  ]
}
```
