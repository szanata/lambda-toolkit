const batchWrite = require( './batch_write' );

module.exports = async ( client, ...args ) => batchWrite( client, 'remove', ...args );
