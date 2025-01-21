# Object

Functions to work with objects.

Namespace: `object.`

## Index
- [`fn` camelize](#fn-camelize)
- [`fn` filterProps](#fn-filterProps)
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

#### Example

```js
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
const input = { id: 1, color: 'red', shape: 'square' };
const result = filterProps( input, ['color', 'shape' ] );
assert.deepEqual( result, { id: 1 } );
```

### `fn` snakeLize

Transform each key in a object to "snake_case". It will convert nested keys, even inside arrays.

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|obj|Object|The object to convert||
|options|Object|An option object with options|{}|
|options.keepAllCaps|Boolean|The flag to keep or convert all caps keys|false|

#### Return

A new object cloned from the input.

#### Example

```js
const result = snakelize( { input_color: 'red' } );
assert.deepEqual( result, { inputColor: 'red'} );
```
