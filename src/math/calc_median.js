module.exports = values => {
  //Sort bug: https://www.tutorialrepublic.com/faq/how-to-sort-an-array-of-integers-correctly-in-javascript.php
  const sorted = values.slice().sort( ( a, b ) => a - b );
  const evenArray = values.length % 2 === 0;
  const midIndex = Math.floor( values.length / 2 );
  return evenArray ? ( sorted[midIndex - 1] + sorted[midIndex] ) / 2 : sorted[midIndex];
};
