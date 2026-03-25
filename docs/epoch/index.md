# Epoch

Functions to help working with time.

Namespace: `epoch`.

## Index
- [`fn` days](#fn-days)
- [`fn` hours](#fn-hours)
- [`fn` minutes](#fn-minutes)
- [`fn` months](#fn-months)
- [`fn` msToS](#fn-msToS)
- [`fn` round](#fn-round)
- [`fn` seconds](#fn-seconds)

## Members

### `fn` days

Convert _n_ from days to milliseconds.

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|n|Number|Number of days||

#### Return

Returns _n_ days in milliseconds.

#### Example

```js
// CJS
const { epoch: { days } } = require( 'lambda-toolkit' );

// ESM
import { epoch } from 'lambda-toolkit';
const { days } = epoch;

const result = days( 2 );
assert.deepEqual( result, 172_800_000 );
```

### `fn` hours

Convert _n_ from hours to milliseconds.

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|n|Number|Number of hours||

#### Return

Returns _n_ hours in milliseconds.

#### Example

```js
// CJS
const { epoch: { hours } } = require( 'lambda-toolkit' );

// ESM
import { epoch } from 'lambda-toolkit';
const { hours } = epoch;

const result = hours( 2 );
assert.deepEqual( result, 7_200_000 );
```

### `fn` minutes

Convert _n_ from minutes to milliseconds.

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|n|Number|Number of minutes||

#### Return

Returns _n_ minutes in milliseconds.

#### Example

```js
// CJS
const { epoch: { minutes } } = require( 'lambda-toolkit' );

// ESM
import { epoch } from 'lambda-toolkit';
const { minutes } = epoch;

const result = minutes( 2 );
assert.deepEqual( result, 120_000 );
```

### `fn` months

Convert _n_ from months to milliseconds. Month is 30 days long.

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|n|Number|Number of months||

#### Return

Returns _n_ months in milliseconds.

#### Example

```js
// CJS
const { epoch: { months } } = require( 'lambda-toolkit' );

// ESM
import { epoch } from 'lambda-toolkit';
const { months } = epoch;

const result = months( 2 );
assert.deepEqual( result, 5_256_000_000 );
```

### `fn` msToS

Convert _n_ from milliseconds to seconds.

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|n|Number|Number of milliseconds to convert||

#### Return

Returns _n_ milliseconds in seconds.

#### Example

```js
// CJS
const { epoch: { msToS } } = require( 'lambda-toolkit' );

// ESM
import { epoch } from 'lambda-toolkit';
const { msToS } = epoch;

const result = mstoS( 1000 );
assert.deepEqual( result, 1 );
```

### `fn` round

Round a number using another number as reference instead of number of places. Eg. 11 by 2 is 10.
The underlying formula is _`n - ( n mod t)`_.

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|n|Number|Number to round||
|t|Number|Rounding value||

#### Return

Returns the rounded number.

#### Example

```js
// CJS
const { epoch: { round } } = require( 'lambda-toolkit' );

// ESM
import { epoch } from 'lambda-toolkit';
const { round } = epoch;

const result = round( 89, 25 );
assert.deepEqual( result, 75 );
```

### `fn` seconds

Convert _n_ from seconds to milliseconds.

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|n|Number|Number of seconds||

#### Return

Returns _n_ seconds in milliseconds.

#### Example

```js
// CJS
const { epoch: { seconds } } = require( 'lambda-toolkit' );

// ESM
import { epoch } from 'lambda-toolkit';
const { seconds } = epoch;

const result = seconds( 2 );
assert.deepEqual( result, 2_000 );
