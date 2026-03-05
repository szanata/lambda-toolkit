# Object

Functions to work with objects.

Namespace: `object`.

## Index
- [`fn` camelize](#fn-camelize)
- [`fn` filterProps](#fn-filterProps)
- [`fn` removeEmptyArrays](#fn-removeEmptyArrays)
- [`fn` snakelize](#fn-snakelize)

## Members

### `fn` camelize

Transform each key in a object to "camelCase". It will convert nested keys, even inside arrays.

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|obj|Object|The object to convert||
|options|Object|An option object with options|{}|
|options.keepAllCaps|Boolean|The flag to keep or convert all caps keys|false|

#### Return

A new object cloned from the input.

For more information, check [these examples](../string/index.md#transformation-chart).

#### Example

```js
// CJS
const { object: { camelize } } = require( 'lambda-toolkit' );

// ESM
import { object } from 'lambda-toolkit';
const { camelize } = object;

const result = camelize( { inputColor: 'red' } );
assert.deepEqual( result, { input_color: 'red'} );
```

### `fn` filterProps

Creates an object from another object omitting given keys.

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|obj|Object|The object to filter||
|list|Array<String>|The array of properties to omit||

#### Return

A new object cloned from the input.

#### Example

```js
// CJS
const { object: { filterProps } } = require( 'lambda-toolkit' );

// ESM
import { object } from 'lambda-toolkit';
const { filterProps } = object;

const input = { id: 1, color: 'red', shape: 'square' };
const result = filterProps( input, ['color', 'shape' ] );
assert.deepEqual( result, { id: 1 } );
```

### `fn` removeEmptyArrays

Remove empty array fields from an object.

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|obj|Object|The object to remove empty arrays||

#### Return

A new object cloned from the input.

#### Example

```js
// CJS
const { object: { removeEmptyArrays } } = require( 'lambda-toolkit' );

// ESM
import { object } from 'lambda-toolkit';
const { removeEmptyArrays } = object;

const input = { id: 1, values: [ '1' ], options: [], config: { items: [] } };
const result = removeEmptyArrays( input );
assert.deepEqual( result, { id: 1, values: [ '1' ], config: { items: [] } } );
```

### `fn` snakelize

Transform each key in a object to "snake_case". It will convert nested keys, even inside arrays.

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|obj|Object|The object to convert||
|options|Object|An option object with options|{}|
|options.keepAllCaps|Boolean|The flag to keep or convert all caps keys|false|

#### Return

A new object cloned from the input.

For more information, check [these examples](../string/index.md#transformation-chart-1).

#### Example

```js
// CJS
const { object: { snakelize } } = require( 'lambda-toolkit' );

// ESM
import { object } from 'lambda-toolkit';
const { snakelize } = object;

const result = snakelize( { input_color: 'red' } );
assert.deepEqual( result, { inputColor: 'red'} );
```
