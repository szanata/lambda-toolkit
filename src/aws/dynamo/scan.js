const select = require( './select' );

module.exports = async ( client, ...args ) => select( client, 'scan', ...args );
