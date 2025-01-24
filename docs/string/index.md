# String

Functions to work with strings.

Namespace: `string`.

## Index
- [`fn` camelize](#fn-camelize)
- [`fn` capitalizeWords](#fn-capitalizewords)
- [`fn` snakelize](#fn-snakelize)

## Members

### `fn` camelize

Transform a string to "camelCase". It will convert each sequence bound by spaces as a different string and convert individually.

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|text|String|The string to convert||
|options|Object|An option object with options|{}|
|options.keepAllCaps|Boolean|The flag to keep or convert all caps|false|

#### Return

A new string which the value is the converted input.

#### Transformation Chart
|Input|Output|Description|
|---|---|---|
|from_snake_case|fromSnakeCase|"snake_case" is converted|
|PascalCase|pascalCase|"PascalCase" is converted|
|ALL_CAPS|allCaps|"ALL_CAPS" is converted|
|ALL_CAPS|ALL_CAPS|"ALL_CAPS" are kept if using "keepAllCaps" property|
|from_snake_case_AndPascalCase|fromSnakeCaseAndPascalCase|Mixed cases are converted|
|from_snake_case AndPascalCase|fromSnakeCase andPascalCase|Spaces are delimiters|
|ABBlood|abBlood|Last uppercase in a sequence followed by lower case is handled as delimiter|

#### Example

```js
const result = camelize( 'foo_bar' );
assert.deepEqual( result, 'fooBar' );
```

### `fn` capitalizeWords

Given a string capitalize each word bound by space delimiters

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|text|String|The string to convert||
|options|Object|An option object with options|{}|
|options.keepAllCaps|Boolean|The flag to keep or convert all caps|false|

#### Return

A new string which the value is the converted input.

#### Example

```js
const result = capitalizeWords( 'snake_case bar' );
assert.deepEqual( result, 'Snake_case Bar' );
```

### `fn` snakelize

Transform a string to "snake_case". It will convert each sequence bound by spaces as a different string and convert individually.

#### Arguments

|Name|Type|Description|Default|
|---|---|---|---|
|text|String|The string to convert||
|options|Object|An option object with options|{}|
|options.keepAllCaps|Boolean|The flag to keep or convert all caps|false|

#### Return

A new string which the value is the converted input.

#### Transformation Chart
|Input|Output|Description|
|---|---|---|
|fromCamelCase|from_camel_case|"snake_case" is converted|
|PascalCase|pascal_case|"pascal_case" is converted|
|ALL_CAPS|all_caps|"ALL_CAPS" is converted|
|ALL_CAPS|ALL_CAPS|"ALL_CAPS" are kept if using "keepAllCaps" option|
|fromCamelCase-and-kebab-case|from_camel_case_and_kebab_case|Mixed cases are converted|
|fromCamelCase and-kebab-case|from_camel_case and_kebab_case|Spaces are delimiters|

#### Example

```js
const result = snakelize( 'fooBar' );
assert.deepEqual( result, 'foo_bar' );
```
