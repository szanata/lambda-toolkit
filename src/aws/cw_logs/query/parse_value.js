const parseInteger = value => {
  const number = parseInt( value, 10 );
  return number <= Number.MAX_SAFE_INTEGER && number >= Number.MIN_SAFE_INTEGER ? number : value;
};

const parseFloatingPoint = value => {
  if ( value.replace( /[^\d]/g, '' ).length > 16 ) {
    return value;
  }
  const number = parseFloat( value, 10 );
  return number <= Number.MAX_SAFE_INTEGER && number >= Number.MIN_SAFE_INTEGER ? number : value;
};

/* eslint-disable consistent-return */
module.exports = value => {
  if ( [ null, undefined ].includes( value ) ) {
    return undefined;
  }

  if ( /^\d{4}-\d\d-\d\d((T| )\d\d:\d\d:\d\d(.\d{3})?(Z|\+\d\d:?\d\d)?)?$/.test( value ) ) {
    return new Date( value );
  }

  // integer
  if ( /^-?\d+$/.test( value ) ) {
    return parseInteger( value );
  }

  // float
  if ( /^-?(\d+\.|\.\d+|\d+\.\d+)$/.test( value ) ) {
    return parseFloatingPoint( value );
  }

  // boolean
  if ( /^true$/.test( value ) ) {
    return true;
  }

  if ( /^false$/.test( value ) ) {
    return false;
  }

  return value;
};
