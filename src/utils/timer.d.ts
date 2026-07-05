/**
 * Creates a stopwatch-like object.
 * 
 * @example
 * ```ts
 * import { utils } from 'lambda-toolkit';
 * const { Timer } = utils;
 * 
 * const timer = new Timer().start();
 * const elapsedTime = timer.stop();
 * ```
 */
export class Timer {
  /**
   * The number of milliseconds elapsed since the Timer started or until it stopped.
   */
  get elapsed(): number;
  
  /**
   * Whether the Timer is running.
   */
  get running(): boolean;
  
  /**
   * Starts the timer.
   * @returns self
   */
  start(): this;
  
  /**
   * If the Timer is stopped, starts it. Resets the elapsed time.
   * @returns self
   */
  restart(): this;
  
  /**
   * Stops the timer.
   * @returns The milliseconds elapsed since the Timer started
   */
  stop(): number;
}
