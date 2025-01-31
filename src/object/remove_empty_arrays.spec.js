const removeEmptyArrays = require( './remove_empty_arrays' );

describe( 'Object: Remove Empty Arrays', () => {
  it( 'Should return false for a Date', () => {
    const result = removeEmptyArrays( {
      a: [],
      b: 2,
      c: [ 1, 2, 3 ],
      d: undefined,
      e: null,
      f: { g: [], h: [ 1 ] },
      i: { j: [] }
    } );
    expect( result ).toEqual( {
      b: 2,
      c: [ 1, 2, 3 ],
      d: undefined,
      e: null,
      f: { g: [], h: [ 1 ] },
      i: { j: [] }
    } );
  } );
} );
