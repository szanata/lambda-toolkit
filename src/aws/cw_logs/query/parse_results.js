const parseItem = require( './parse_item' );

module.exports = results => results.map( item => parseItem( item ) );
