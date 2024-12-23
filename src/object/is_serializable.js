module.exports = obj =>
  typeof obj === 'object' &&
  obj !== null &&
  !( obj instanceof String ) &&
  !( obj instanceof Number ) &&
  !( obj instanceof Boolean ) &&
  !( obj instanceof Date );
