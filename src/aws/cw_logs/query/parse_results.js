import { parseItem } from './parse_item.js';

export const parseResults = results => results.map( item => parseItem( item ) );
