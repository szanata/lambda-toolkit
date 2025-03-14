# LambdaApi

An abstraction to simplify creating APIs using AWS Lambdas that are invoked by AWS ApiGateway events.

The abstraction is intended to make it easy to have the same lambda handling different requests matching them by verb, route, path.

It also standardize the responses and allow to set headers and transformations.

## Usage

LambdaApi handles AWS ApiGateway event payloads the same way a framework like ExpressJs handles HTTP requests. It allows individual handlers to be set, each one responsible for handling a verb and optionally matching a path our route. It is order based, so if many handlers would match the same request, the first one takes precedence.

LambdaApi is a JS `class` (prototype) and has to be instantiated before use, then its handlers can be added. Finally, at the Lambda Function handler the event payload has to be processed using `.process()` method and its result must be used as the return of the whole function, since it contains the expected HTTP response. A simplistic use case would be this:

```js
const { LambdaApi } = require( '<this-library>' )

const api = new LambdaApi();

api.addHandler( { method: 'GET', route: '/list', fn: () => 200 } );

// lambda handler
module.exports.index = async awsEvent => api.process( awsEvent );
```

## Headers

All HTTP response payload generated by `.process()` will have these headers:
```bash
Cache-Control=no-store
Access-Control-Allow-Origin=*
```

Additional headers can be set either in the constructor or in each individual handler, they are all added to the final result.

There is a precedence order `Handler > Constructor > Default`

So if the same header is added at the handler, constructor and default, the final value is the one from the handler.

## Error handling

The LambdaAPI does not throws error. If any error happens within any handler, it will return `500 Internal Server Error` by default. This can be customized by [`.addErrorHandler()`](#adderrorhandler). The exception is when an event does not match any handler, in that case `405 Method Not Allowed` is returned, this is not customizable.

## HEAD request

Requests using HTTP verb `HEAD` are handled different, they don't try to match handlers, they will always return `204 <empty>`.

## Constructor

The LambdaAPI takes a few arguments at the constructor, all optional, refer to the Arguments section below.

#### Arguments
|Name|Type|Description|Default|
|-|-|-|-|
|{}|Object|Named parameter root object||
|headers|Object|An object containing HTTP headers (key=value) to attach to the final response, they have precedence over default headers|{}|
|transformRequest|String,Boolean|A [transformation function](#transform-functions) that will convert the query string, parameters and body of the request|false|
|transformResponse|String,Boolean|A [transformation function](#transform-functions) that will convert the response body|false|

##### Transform Functions
Valid transformation functions for the constructor are
|Name|Description|
|-|-|
|camelcase|converts object keys camelCase|
|snakecase|converts object keys snake_case|

## Features

These are the instance methods:

- [addHandler](#addhandler)
- [addErrorHandler](#adderrorhandler)
- [addBeforeHook](#addbeforehook)
- [addAfterHook](#addafterhook)
- [process](#process)

### addHandler

This method allow to add an API request handler to the `LambdaApi` instance. The handler is a function that will be executed if the request satisfy its conditions, causing, this function contains the actual code to process the request. Each handler will be responsible for an HTTP, but they can also have other conditions to allow more control over which requests it is responsible for. There are two types of conditions "exclusive" and "combinative" conditions.

For exclusive conditions there are `route` and `path`. If present, they will respectively be compared against the route or path of the request, allowing different handlers to be responsible for different route/paths with the same verb. Eg: `GET /users` and `GET /users/{id}`, if they don't match the request will not be picked by this handler. Use only one of them and do not use other conditions, as they will be ignored.

As for the combinative conditions, there are several. They work in tandem as each one that is present has to evaluate to `true` after comparing to the request path/route in order for this handler to be selected.

If many handlers match the same request only the first, in order of definition, will be used.

#### Arguments
|Name|Type|Description|Required|
|-|-|-|-|
|{}|Object|Named parameter root object|Yes|
|method|String|The HTTP method which this handler will match|Yes|
|fn|Function|The handler function that will be invoked when this route matches, can be either asynchronous or synchronous. It receives the [Event](#event)|Yes|
|⬇️*Exclusive conditions, use only one*⬇️|
|route|string|Only matches this exactly route. If present, ignores all other conditions||
|path|string|Only matches this exactly path. If present ignores all other conditions||
|⬇️*Combinative conditions, can be used together*⬇️|
|routeIncludes|string|The route has to include this string||
|routeNotIncludes|string|The route must not include this string||
|routeMatches|RegExp|The route has to match this RegExp||
|pathIncludes|string|The path has to include this string||
|pathNotIncludes|string|The path must not include this string||
|pathMatches|RegExp|The path has to match this RegExp||

**Notes**
The difference between `route` and `path`. Route is the raw API route where parameters were not yet placed onto their placeholders, path is the actual HTTP request route.
- An example of route: `/list/<id>`;
- An example of path: `/list/123`;

#### HTTP Response

The return of handler's "fn" function. This will be used to compose the HTTP response of the API. There are several ways the return can be composed, varying from strings to arrays:

##### Single Values
|Function return|Conditions|Status Code|Body|Mime Type|Description|
|-|-|-|-|-|-|
|undefined|-|204|_\<empty>_|_\<none>_|If the function's return is void, the API will return success without a body|
|string|length = 0|204|_\<empty>_|_\<none>_|If the function's returns an empty string, the API will return success without a body|
|string|length > 0|204|value|`text/plain`|If the function's returns a string, the API will return success and use the string as the body|
|number|valid status code|value|_\<empty>_|_\<none>_|If the function's returns a number and it is a valid status code, the API will return it as the status code without a body|

##### Arrays
If the function returns an array it has to contain up to three values in this schema: `[ statusCode, body*, headers*, isBase64Encoded* ]`:
|Position|Type|Required|Used As|Description|
|-|-|-|-|-|
|0|number|Yes|status code|The response HTTP status code|
|1|any|-|body|The response body|
|2|object|-|headers|Any additional headers to append to the response|
|3|boolean|-|isBase64Encoded flag|Whether the `body` is encoded as a `base64` string or not|

If the body is present it is handled as such:
|Condition|Mime Type|Value|
|-|-|-|
|empty string, `null`, `undefined`|_\<none>_|_\<empty>_|
|primitive|`text/plain`|`String(value)`|
|object|`application/json`|`JSON.stringify(value)`|

For the headers, they are appended to the other headers. As this has the most precedence, they will overwrite any other header with the same name.

##### Objects
If the function returns an object it has to contain up to three properties in this schema: `{ statusCode, body*, headers*, isBase64Encoded* }`:
|Property|Type|Required|Description|
|-|-|-|-|
|statusCode|number|Yes|The response HTTP status code|
|body|any|-|The response body|
|headers|object|-|Any additional headers to append to the response|
|isBase64Encoded|boolean|-|Whether the `body` is encoded as a `base64` string or not|

If the body is present it is handled the same way as it is for [Arrays](#arrays) responses, same for headers.

### addErrorHandler

Use this function to map a specific HTTP status code response to a particular error type. Eg:

```js
const api = new LambdaApi();

class NotFoundError extends Error {};

api.addHandler( { method: 'GET', route: '/get/{id}', fn: async ( event ) => {
  const record = await findRecord( event.params.id );
  if ( !record ) {
    throw new NotFoundError();
  }
  return [ 200, record ];
} } );
api.addErrorHandler( { errorType: NotFoundError, code: 404, message: 'Sorry, record not found' } );

// lambda handler
module.exports.index = async awsEvent => api.process( awsEvent );
```

In that scenario, every time any handler throws `NotFoundError`, a response with status code 404 and body `'Sorry, record not found'` will be returned.

#### Matching

To define which handler is used, the declared handlers are compared using the `instanceof` operator. This will entice that an handler for `Error` would match any other error that extends `Error`, like `TypeError`:

```js
class NotFoundError extends Error {};

api.addErrorHandler( { errorType: Error, code: 404, message: 'Sorry, record not found' } );
```

In the scenario above, if `NotFoundError` was thrown, the error handler would catch it, because its `class` inherits from Error.

#### Order

As with other handlers, the error handler only process the first error handler it matches.

```js
api.addErrorHandler( { errorType: NotFoundError, code: 404, message: 'Sorry, record not found' } );
api.addErrorHandler( { errorType: Error, code: 500, message: 'Ops' } );
```

So in the example above, if `NotFoundError` was thrown, the first handler would catch it and return 404. The second handler would be ignored.

#### Arguments
|Name|Type|Description|Required|
|-|-|-|-|
|{}|Object|Named parameter root object|Yes|
|errorType|Function|The constructor of the throw error. Note that `Error` will match any error|Yes|
|code|Number|The status code to return to the user|Yes|
|message|String|An optional message to be the body of the response, if not present fallbacks to error.message||

## addBeforeHook

This method allow the addition of a hook, which is callback function that will be run before the actual handler. __It only runs if the a handler is matched__.
Many "before" hooks can be added, and they will be invoked in order.

Hooks are useful to append data to the event's context or execute code that is common across all handler.

Hooks can pass data to the handler by assigning it to the `event.context` property of the event. Any value or type can be assigned.

They don't need to return anything and if they do, it is ignored.

Example:
```js
const api = new LambdaApi();

api.addBeforeHook( { fn: async ( event ) => {
  event.context.user = await processAuth( event.authorizer );
} } );

api.addHandler( { method: 'GET', route: '/get/{id}', fn: async ( event ) => {
  const record = await findRecord( event.params.id, event.context.user ); // user was added by the hook
  return [ 200, record ];
} } );

module.exports.index = async awsEvent => api.process( awsEvent );
```

#### Arguments
|Name|Type|Description|Required|
|-|-|-|-|
|{}|Object|Named parameter root object|Yes|
|fn|Function|The hook function, can be either asynchronous or synchronous. It receives the [Event](#event).|Yes|

## addAfterHook

The "after" hooks are similar to "before" hooks, however they are executed after the handler function. Also similarly, you can add many of them and they are executed in order.

#### Arguments
|Name|Type|Description|Required|
|-|-|-|-|
|{}|Object|Named parameter root object|Yes|
|fn|Function|The hook function, can be either asynchronous or synchronous. It receives the [Event](#event).|Yes|

## process

The "process" is the main function of the class. It will receive the raw AWS APIGateway Event Payload as it was received by the AWS Lambda, process the whole flow and return a properly formatted HTTP response for the lambda to return to the APIGateway.

Response example:

```js
{
  "statusCode": Number,
  "body": "<string>",
  "headers": {
    // any headers defined
  }
}
```

The response format is referenced [here](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#http-api-develop-integrations-lambda.response).

## Event

The Event is an abstraction of the APIGateway Event payload that lambda receives. It simplifies the payload and remove unnecessary fields. It also normalized between payload v1 and v2. Payload format and v1, v2 documentations is [here](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html#http-api-develop-integrations-lambda.proxy-format).

All properties in the object are __read-only__ excepts `context`. The `context` is, by default, and empty object (`{}`) and it can be modified or re-assigned to hold any value. It is used when the "before" hooks want to send data to the handler or other hooks, or the handler wants to append data for the "after" hooks.

### Attributes
|Property|Description|Field on payload V1|Field on payload v2|Tye|
|-|-|-|-|-|
|authorizer|The Gateway authorizer context|`requestContext.authorizer`(1)|`requestContext.authorizer`(1)|Object|
|body|The HTTP request body|`body`(2)|`body`(2)|Object or String|
|context|The special writable property to share data between hooks and handler|-|-|Object|
|headers|The HTTP request headers|`headers` + `multiValueHeaders`(3)|`headers`|Object|
|method|The HTTP request verb|`httpMethod`|`requestContext.http.method`|String|
|params|The HTTP request URL params|`pathParameters`|`pathParameters`|Object|
|path|The HTTP request path|`path`|`requestContext.http.path`|String|
|queryString|The HTTP URL query string|`queryStringParameters` + `multiValueQueryStringParameters`(3)|`queryStringParameters`|Object|
|route|The route from its spec that the API Gateway matched this request|`resource`|`routeKey`(4)|String|
|isBase64Encoded|Whether the `body` is encoded as a `base64` string or not|`isBase64Encoded`|`isBase64Encoded`|Boolean|

1. the authorized content is not parsed so it will differs between API Gateway Payload v1 and v2.
2. The `body` is automatically parsed to Object if it is a valid JSON.
3. The `headers` are a combination between `headers` and `multiValueHeaders`. When there are `multiValueHeaders`, their value will be stringified with `,` as separator. The same is true for `queryString`, which combines `queryStringParameters` and `multiValueQueryStringParameters`.
4. The `routeKey` actual value is `<VERB> <route>`, the final value is just the `route` part. The `<VERB> ` prefix is replaced.

#### Example
```js
{
  authorizer: {
    // raw authorizer context
  },
  headers: {
    Accept: "application/json",
    "Accept-Encoding": "gzip br"
  },
  method: 'PUT',
  path: '/user/id',
  route: '/user/{id}',
  params: {
    id: '123'
  },
  queryString: {
    singleValue: 'car'
    multiValue: 'car,bicycle,motorcycle'
  },
  body: {
    name: 'Johnny X'
  },
  context: {}
}
```
