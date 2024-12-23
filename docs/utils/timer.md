# `class` Timer

Creates a stopwatch-like object.

## Members

### `get` elapsed

#### Returns

`Number`: The number milliseconds elapsed since the Timer started or until it stopped.

### `get` running

#### Returns
`Boolean`: `true` if the Timers is started, `false` otherwise.

### `fn` start

Starts the timer.

#### Returns

`Timer`: self

### `fn` restart

If the Timer is stopped, starts it. Resets the elapsed time.

#### Returns

`Timer`: self

### `fn` stop

Stop the timer.

#### Returns

The milliseconds elapsed since the Timer started.

## Example
```js
const timer = new Timer().start();

const elapsedTime = timer.stop();

assert.equal( elapsedTime, timer.elapsed );
```
