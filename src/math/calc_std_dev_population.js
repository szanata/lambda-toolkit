import { calcMean } from './calc_mean.js';

export const calcStdDevPopulation = values => {
  const mean = calcMean( values );
  const squareDiffs = values.map( value => Math.pow( value - mean, 2 ) );
  const avgSquareDiff = calcMean( squareDiffs );
  return Math.sqrt( avgSquareDiff );
};
