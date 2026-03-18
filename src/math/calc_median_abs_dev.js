import { calcMedian } from './calc_median.js';

export const calcMedianAbsDev = pop => {
  const center = calcMedian( pop );
  return calcMedian( pop.map( v => Math.abs( v - center ) ) );
};
