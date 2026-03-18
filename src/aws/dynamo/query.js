import { select } from './select.js';

export const query = async ( client, ...args ) => select( client, 'query', ...args );
