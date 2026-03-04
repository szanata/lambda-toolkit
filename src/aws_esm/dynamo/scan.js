import { select } from './select.js';

export const scan = async ( client, ...args ) => select( client, 'scan', ...args );
