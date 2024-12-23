module.exports = ( sample, mean, stdDev ) => stdDev === 0 ? NaN : ( sample - mean ) / stdDev;
