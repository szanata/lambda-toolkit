# Atlas: JS to DDB values conversion

This guide shows how different JS data types are converted to DynamoDB data types using the DynamodbDocumentClient.

## Dynamodb Types
- S – String
- N – Number
- B – Binary
- BOOL – Boolean
- NULL – Null
- M – Map
- L – List
- SS – String Set
- NS – Number Set
- BS – Binary Set

## JS Types
- strings (primitive)
- numbers (primitive)
- Buffers
- booleans (primitive)
- null
- Objects
- Maps
- Arrays
- Sets
- Class instance Objects

## Conversion Sheet
The following sheet shows the original JS data type and value (pre writing to ddb), the marshalled data type and value (how the data stored it) and the un-marshalled data type (after getting the value back from ddb). Also if it throws error, how to prevent it and some observations

| Value | JS before | DynamoDB | JS after | Error | Config | Obs |
|---|---|---|---|---|---|---|
| Array | `[ 1, 'a', true ]` | `{"L":[{"N":"1"},{"S":"a"},{"BOOL":true}]}` | `[1,'a',true ]` ||||
| Array: empty | `[]` | `{"L":[]}` | `[]` ||||
| Buffer | `Buffer.from( 'a' )` | `{"B":"YQ=="}` | `Uint8Array(1) [97]` |||Convert `Unit8Array` with `Buffer.from`|
| Buffer: empty | `Buffer.from( '' )` | `{"NULL":true}` | `null` ||||
| Object: Class instance | `new Dog( 'Rex' )`[*](#dog-class-definition)|`{"M":{"name":{"S":"Rex"}}}`|`{ name: 'Rex' }`|[🚨5](#5)|[🔧c1](#c1) <`true`>|Becomes plain object|
| Object: Empty | `{}` | `{"M": {}}`| `{}`||||
| Object: NaN | `NaN` |||[🚨1](#1)|||
| Object: Native Date | `new Date()`|`{"M":{}`|`{}`||[🔧c1](#c1) <`true`>|Serialize with `JSON.stringify()`|
| Object: Native RegExp | `/^foo$/`|`{"M":{}`|`{}`||[🔧c1](#c1) <`true`>|Serialize with `JSON.stringify()`|
| Object: Notation | `{ foo: 'bar' }` | `{"M":{"foo":{"S":"bar"}}}`| `{ foo: 'bar'}` ||||
| Object: Map | `new Map( [ [ 0, 1 ], [ 'b', 'c'] ] )` | `{"M":{"0":{"N": "1"},"b":{"S": "c"}}}`| `{ '0': 1, b: 'c' }` |||Becomes plain object|
| Object: Symbol | `Symbol( 1 )` |||[🚨6](#6)|||
| Primitive: String | `'foo'` | `{"S":"test"}` | `'foo'` ||||
| Primitive: String empty | `''` | `{"S":""}` | `''` ||[🔧c2](#c2) <`false>`||
| Primitive: String empty | `''` | `{"NULL":true}` | `null` ||[🔧c2](#c2) <`true`>||
| Primitive: number | `42` | `{"N":"42"}` | `42` ||||
| Primitive: boolean: true | `true` | `{"BOOL":true}` | `true` ||||
| Primitive: boolean: false | `false` | `{"BOOL":false}` | `false` ||||
| Primitive: null | `null` | `{"NULL":true}` | `null` ||||
| Primitive: undefined | `undefined` |||[🚨3](#3)|[🔧c3](#c3) <`true`>||
| Set: Numbers | `new Set( [ 1, 2, 3 ] )` | `{"NS":["3","2","1"]}` | `Set(3) { 1, 2, 3 } )` ||||
| Set: Strings | `new Set( [ 'a', 'b', 'c'] )` | `{"SS":["a","b","c"]}` | `Set(3) { 'a', 'b', 'c' }` ||||
| Set: Buffer | `new Set( [ Buffer.from('a') ] )` | `{"BS":["YQ=="]}`| `Set(1) { Uint8Array(1) [97] }` ||| Convert `Unit8Array` with `Buffer.from` |
| Set: Other Types | `new Set( [ true, false ] )` |||[🚨2](#2)|||
| Set: Empty | `new Set()` | `{"NULL":true}` | `null` |[🚨3](#3)|[🔧c3](#c3) <`true`>||
| Set: Mixed Types | `new Set( [ 1, 'a'] )` |||[🚨4](#4)||The first value dictates the type|

### Errors table
| Code | Error |
|---|---|
| <span id="1">1</span> | _"Special numeric value NaN is not allowed"_ |
| <span id="2">2</span> | _"Only Number Set (NS), Binary Set (BS) or String Set (SS) are allowed."_ |
| <span id="3">3</span> | _"Pass options.removeUndefinedValues=true to remove undefined values from map/array/set."_ |
| <span id="4">4</span> | _"The parameter cannot be converted to a numeric value: b"_ |
| <span id="5">5</span> | _"Unsupported type passed: [object Object]. Pass options.convertClassInstanceToMap=true to marshall typeof object as map attribute."_ |
| <span id="6">6</span> | _"Cannot convert a Symbol value to a string"_ |

### Dog class definition
```js
// Dog class definitiion
class Dog {
  constructor ( name ) {
    this.name = name;
  }
}
```

### Config table
| Property | Values | Description |
|---|---|---|
| <span id="c1">`convertClassInstanceToMap`</span>|`true` or `false`|JS classes will be serialized or will throw errors. Excluding plan objects and Maps, those always serialize|
| <span id="c2">`convertEmptyValues`</span>|`true` or `false`|Leave empty strings `''` or convert to null|
| <span id="c3">`removeUndefinedValues`</span>|`true` or `false`|Removes undefined values|

## Refs
- https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html
- https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_lib_dynamodb.html#dynamodbdocumentclientresolvedconfig-1
