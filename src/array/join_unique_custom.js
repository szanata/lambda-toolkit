module.exports = ( { key, items } ) => [
  ...items.filter( Array.isArray ).flat().reduce( ( map, v ) => {
    const k = key( v );
    if ( !map.has( k ) ) {
      map.set( k, v );
    }
    return map;
  }, new Map() ).values()
];
