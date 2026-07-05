import { Event } from './event.js';

type HandlerFunction = (event: Event) => any;

/**
 * HTTP request handler with route and path matching.
 */
export class Handler {
  constructor(options: {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD';
    fn: HandlerFunction;
    route?: string;
    path?: string;
    routeIncludes?: string;
    routeNotIncludes?: string;
    routeMatches?: RegExp;
    pathIncludes?: string;
    pathNotIncludes?: string;
    pathMatches?: RegExp;
  });

  /**
   * Check if this handler matches the given event.
   */
  match(event: Event): boolean;

  /**
   * Get the handler function.
   */
  get fn(): Function;
}
