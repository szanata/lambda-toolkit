const calcMedian = require( './calc_median' );

module.exports = pop => {
  const center = calcMedian( pop );
  return calcMedian( pop.map( v => Math.abs( v - center ) ) );
};
