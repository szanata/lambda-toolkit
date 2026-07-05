import { Event } from './event.js';

/**
 * Before/after hook that wraps a function to be called in the request chain.
 */
export class Hook {
  constructor(options: { fn: (event: Event) => Promise<void> | void });

  /**
   * Get the hook function.
   */
  get fn(): Function;
}
