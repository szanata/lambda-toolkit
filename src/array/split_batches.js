module.exports = ( items, size ) => items.reduce( ( arrs, item ) =>
  ( arrs[0] && arrs[0].length < size ) ?
    [ [ ...arrs[0], item ] ].concat( arrs.slice( 1 ) ) :
    [ [ item ] ].concat( arrs )
, [] ).reverse();
