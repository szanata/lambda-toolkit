module.exports = ( n, d = 2 ) => {
  if ( !isFinite( n ) || typeof n !== 'number' ) { return NaN; }

  const m = Math.pow( 10, d );
  const num = +( n * m ).toFixed( 8 ); // Avoid rounding errors
  const i = Math.floor( num );
  const f = num - i;
  const e = 1e-8; // Allow for rounding errors in f
  const r = ( f > 0.5 - e && f < 0.5 + e ) ? // eslint-disable-line no-nested-ternary
    ( ( i % 2 === 0 ) ? i : i + 1 ) : Math.round( num );
  return r / m;
};
