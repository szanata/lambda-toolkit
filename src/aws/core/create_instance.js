/**
 * This is base object each AWS abstraction will provide
 */
module.exports = ( providerFn, methods ) => {
  // This creates the "instance",
  // so calling the method as a function returns a copy of its client instantiated with the given args
  // every method called from it will use this instance
  const factory = args => {
    const client = providerFn( args );
    // return self, so it is possible use the native client
    methods.getClient = () => client;
    return Object.entries( methods ).reduce( ( o, [ k, v ] ) => Object.assign( o, { [k]: v.bind( null, client ) } ), { } );
  };

  // This is the singleton part;
  // First add the static method to the factory;
  Object.entries( methods ).forEach( ( [ key, value ] ) => factory[key] = value );

  // Then add the special method "getClient", so it is possible use the native client
  factory.getClient = client => client;

  // Finally makes the proxy which will allow each singleton method to use the client provider of the AWS service+
  return new Proxy( factory, {
    get( target, key ) {
      const t = target[key];
      return ( typeof t === 'function' ) ? t.bind( null, providerFn() ) : t;
    }
  } );
};
