# Athena

Abstraction over `@aws-sdk/client-athena`

## Index
- [`fn` query](#fn-query)

## Client

The SDK's Athena client is instantiated with not options.

## Members

### `fn` query

Executes an Athena query and returns the result. This abstraction combines: `StartQueryExecutionCommand`, `GetQueryExecutionCommand`, `GetQueryResultsCommand` in just one async call.

This commands starts the Athena query, waits it to complete and return the results. The query native arg `ClientRequestToken` is created automatically, but this can be overwritten by the arguments..

Example:
```js
const { aws: { athena } } = require( '<this-library>' );

const { items } = await athena.query( {
  QueryString: `
SELECT * FROM "db"."table"
SORT BY date ASC;`,
  QueryExecutionContext: { Catalog: 'AwsDataCatalog', Database: 'Database' },
  WorkGroup: 'Workgroup'
}, { recursive: true } );
```

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|nativeArgs|Object|The native SDK [StartQueryCommand arguments](#https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/athena/command/StartQueryExecutionCommand/)||
|options|Object|Extra options||
|options.recursive|Boolean|Whether to recursive query all results or to return a paginationToken after each page|false|
|options.paginationToken|String|The pagination token received in the previous call to resume the query (only used when recursive = false)|null|
|options.maxResults|Number|The maximum number of results per page (only when using pagination token)|null|

#### Return

A query result object containing the data returned by the database, parsed.

The query result object has this structure:
|Property|Type|Description|
|-|-|-|
|items|Array\<Object\>|The database query result parsed to a simple array of plain objects where the key is the column name|
|nextToken|String|The next pagination token if query is not recursive|

#### Data parsing

The query results from athena are converted to an array of plain objects, where the key is the column name and the value is the database value, but the value is also parsed using the column type, since athena only stores string.

Given this query result:
```json
{
  "UpdateCount": 0,
  "ResultSet": {
    "ColumnInfos": [],
    "ResultRows": [],
    "ResultSetMetadata": {
      "ColumnInfo": [
        {
          "CaseSensitive": true,
          "CatalogName": "hive",
          "Label": "maker",
          "Name": "maker",
          "Nullable": "UNKNOWN",
          "Precision": 2147483647,
          "Scale": 0,
          "SchemaName": "",
          "TableName": "",
          "Type": "varchar"
        },
        {
          "CaseSensitive": true,
          "CatalogName": "hive",
          "Label": "model",
          "Name": "model",
          "Nullable": "UNKNOWN",
          "Precision": 2147483647,
          "Scale": 0,
          "SchemaName": "",
          "TableName": "",
          "Type": "varchar"
        }
      ]
    },
    "Rows": [
      {
        "Data": [
          {
            "VarCharValue": "maker"
          },
          {
            "VarCharValue": "model"
          }
        ]
      },
      {
        "Data": [
          {
            "VarCharValue": "Toyota"
          },
          {
            "VarCharValue": "Corolla"
          }
        ]
      }
    ]
  }
}
```

The parsed results are simply:

```json
{
  "items": [
    {
      "maker": "Toyota",
      "model": "Corolla"
    }
  ]
}
```

As for the values themselves, they are converted according to the table below:

Converting null values:
|Athena Value|Converted Value|Notes|
|-|-|-|
|null|undefined||
|undefined|undefined||
|''|undefined|Only if Athena Type is different from 'varchar'|

Converting type:

|Athena Type|JS Type|Notes|
|-|-|-|
|boolean|boolean||
|float|number (float)|`parseFloat`|
|decimal|number (float)|`parseFloat`|
|double|number (float)|`parseFloat`|
|tinyint|number (integer)|`parseInt`|
|smallint|number (integer)|`parseInt`|
|int|number (integer)|`parseInt`|
|bigint|number (integer)|`parseInt`|
|timestamp|number (Date epoch)|`new Date().getTime()`|
|array|Array|arrays will have their inner values parsed either as other arrays, objects or strings|
|row|Object|objects will have their inner values parsed either as other objects, arrays or strings|
|json|Object||

#### Pagination

This functions works in two ways, recursive or paginated.

Paginated, which is the default, will return as soon as the Athena query returns the first page of results, it will also return the `nextToken`, which can be used to continued the query for the next page by calling it again with the same arguments plus the option `paginationToken` with the value of the `nextToken`.

Finally, this function can work recursively, using the `recursive=true` option. This will internally paginate the query results by itself and only return to the user when all data from all pages are gathered.

#### Permissions needed

The AWS policy statement to use this function is:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "athena:GetWorkGroup",
      "athena:StartQueryExecution",
      "athena:StopQueryExecution",
      "athena:GetQueryExecution",
      "athena:GetQueryResults"
    ],
    "Resource": [
      "<workgroup arn>"
    ]
  },
  {
    "Effect": "Allow",
    "Action": "glue:GetTable",
    "Resource": [
      "<glue catalog arn>",
      "<glue database arn>",
      "<glue database's table arn>"
    ]
  },
  {
    "Effect": "Allow",
    "Action": [
      "s3:AbortMultipartUpload",
      "s3:GetBucketLocation",
      "s3:GetObject",
      "s3:ListBucket",
      "s3:ListBucketMultipartUploads",
      "s3:ListMultipartUploadParts",
      "s3:PutObject"
    ],
    "Resource": [
      "<data storage bucket arn>",
      "<data storage bucket arn>/*"
    ]
  }]
}
```
