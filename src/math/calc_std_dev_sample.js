const calcMean = require( './calc_mean' );

module.exports = values => {
  if ( values.length < 2 ) { return NaN; }

  const mean = calcMean( values );
  const squareDiffs = values.map( value => Math.pow( value - mean, 2 ) );
  const avgSquareDiff = squareDiffs.reduce( ( sum, v ) => sum + v, 0 ) / ( values.length - 1 );
  return Math.sqrt( avgSquareDiff );
};
