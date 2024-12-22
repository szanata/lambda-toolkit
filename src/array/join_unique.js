module.exports = ( ...args ) => [ ...new Set( args.filter( Array.isArray ).flat() ) ];
