# Array

Functions to work with array

Namespace: `array.`

## Index
- [`fn` joinUniqueCustom](#fn-joinuniquecustom)
- [`fn` joinUnique](#fn-joinunqiue)
- [`fn` splitBatches](#fn-splitbatches)

## Members

### `fn` joinUniqueCustom

Joins n arrays using a custom function to generate a key for each item.

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|-|Object|Named parameter root object||
|key|Function|A function that will receive each item from each array and has to return the deduplicate key||
|items|Array|Array containing each array to join||

#### Return

A single array containing each unique item from each array determined by the `key` functions.

#### Example

```js
const result = joinUniqueCustom( { key: v => v % 2 === 0, items: [ [ 1 ], [ 2 ], [ 3 ], [ 4 ] ] } );
assert.deepEqual( result, [ 1, 2 ] );
// or
const result = joinUniqueCustom( { key: v => v.id, items: [ [ { id: 1 } ], [ { id: 2 } ], [ { id: 3 } ], [ { id: 4 } ] ] } );
assert.deepEqual( result, [ 1, 2, 3, 4 ] );
```

### `fn` joinUnique

Joins n arrays deduplicating the items

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|...arrays|Array|Arrays to deduplicate, each as one parameter||

#### Return

A single array containing each unique item from each array

#### Example

```js
const result = joinUnique( [ 1, 2 ], [ 1, 3 ], [ 2, 3 ], [ 1, 2 ] );
assert.deepEqual( result, [ 1, 2, 3 ] );
```

### `fn` splitBatches

Breaks an array into many arrays of x size

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|items|Array|The array to split||
|size|Number|The target batch size||

#### Return

An array with _n_ arrays inside, each having _x_ size except the last, which is _[1,x]_

#### Example

```js
const result = splitBatches( [ 1, 2, 3, 4, 5, 6, 7, 7, 9 ], 2 );
assert.deepEqual( result, [ [ 1, 2 ], [ 3, 4 ], [ 5, 6 ], [ 7, 8 ], [ 9 ] ] );
```
