# String

Mathematical operations implemented in JS

Namespace: `math.`

## Index
- [`fn` calcMean](#fn-calcmean)
- [`fn` calcMedian](#fn-calcmedian)
- [`fn` calcMedianAbsDev](#fn-calcmedianabsdev)
- [`fn` calcStdDevPopulation](#fn-calcstddevpopulation)
- [`fn` calcStdDevSample](#fn-calcstddevsample)
- [`fn` calcZScore](#fn-calczscore)
- [`fn` roundStandard](#fn-roundstandard)
- [`fn` roundGaussian](#fn-roundgaussian)

## Members

### `fn` calcMean

Given a sequence of numbers, calculate the mean of them. Reference [https://en.wikipedia.org/wiki/Mean#Arithmetic_mean_(AM)](here).

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|numbers|Array<Number>|The numbers to calculate the mean||

#### Return

The mean value between the numbers

#### Example

```js
const result = calcMean( [ 1, 2, 3, 4] );
assert.equal( result, 2.5 );
```

### `fn` calcMedian

Given a sequence of numbers, calculate the median of them. Reference [https://en.wikipedia.org/wiki/Median](here).

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|numbers|Array<Number>|The numbers to calculate the median||

#### Return

The median value between the numbers

#### Example

```js
const result = calcMedian( [ 1, 2, 3, 4, 5] );
assert.equal( result, 3 );
```

### `fn` calcMedianAbsDev

Given a sequence of numbers, calculate the MAD between them. Reference [https://en.wikipedia.org/wiki/Median_absolute_deviation](here).

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|numbers|Array<Number>|The numbers to calculate the MAD||

#### Return

The MAD value between the numbers

#### Example

```js
const result = calcMedianAbsDev( [ 1, 2, 3, 4, 5] );
assert.equal( result, 1 );
```

### `fn` calcStdDevPopulation

Given a sequence of numbers, calculate the population standard deviation between them. Reference [https://en.wikipedia.org/wiki/Standard_deviation#Uncorrected_sample_standard_deviation](here).

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|numbers|Array<Number>|The numbers to calculate the Population STD DEV||

#### Return

The standard deviation value between the numbers

#### Example

```js
const result = calcStdDevPopulation( [ 1, 2, 3, 4, 5, 6, 7] );
assert.equal( result, 2 );
```

### `fn` calcStdDevSample

Given a sequence of numbers, calculate the sample standard deviation between them. Reference [https://en.wikipedia.org/wiki/Standard_deviation#Corrected_sample_standard_deviation](here).

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|numbers|Array<Number>|The numbers to calculate the Sample STD DEV||

#### Return

The standard deviation value between the numbers

#### Example

```js
const result = calcStdDevSample( [ 1, 2, 3 ] );
assert.equal( result, 1 );

```
### `fn` calcZScore

Given a sample, the mean and the standard deviation, calculate the z score (standard score) for the sample. Reference [https://en.wikipedia.org/wiki/Standard_score](here).

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|sample|Number|The sample value to calculate the Z Score||
|mean|Number|The mean of given values||
|stdDev|Number|The standard deviation of given values||

#### Return

The Z Score of the sample number.

#### Example

```js
const result = calcZScore( 3, 2, 2.5 );
assert.equal( result, 0.4 );
```

### `fn` roundStandard

Given a numbers, round using a given precision. Reference [https://en.wikipedia.org/wiki/Rounding#Rounding_to_a_specified_multiple](here) and [https://en.wikipedia.org/wiki/Rounding#Rounding_to_the_nearest_integer](here²).

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|number|Number|The number to round||
|precision|Number|The precision to round to|2|

#### Return

The rounded number.

#### Example

```js
const result = roundStandard( 2.5543 );
assert.equal( result, 2.55 );

```
### `fn` roundGaussian

Given a number, round it using the Gaussian (Banking) method. Reference [https://en.wikipedia.org/wiki/Rounding#Rounding_half_away_from_zero](here).

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|number|Number|The number to round||
|precision|Number|The precision to round to|2|


#### Return

The Z Score of the sample number.

#### Example

```js
assert.equal( roundGaussian( 1.3150 ), 1.32 );
assert.equal( roundGaussian( 1.3250 ), 1.32 );
```
