const calcMean = require( './calc_mean' );
const calcMedian = require( './calc_median' );
const calcMedianAbsDev = require( './calc_median_abs_dev' );
const calcStdDevPopulation = require( './calc_std_dev_population' );
const calcStdDevSample = require( './calc_std_dev_sample' );
const calcZScore = require( './calc_z_score' );
const roundGaussian = require( './round_gaussian' );
const roundStandard = require( './round_standard' );

module.exports = {
  calcMean,
  calcMedian,
  calcMedianAbsDev,
  calcStdDevPopulation,
  calcStdDevSample,
  calcZScore,
  roundGaussian,
  roundStandard
};
