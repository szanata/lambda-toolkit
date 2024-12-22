const joinUniqueCustom = require( './join_unique_custom' );

describe( 'Array: Join Unique Custom Spec', () => {
  it( 'Should join all arrays deduping by the result of a fn', () => {
    const items = [ [ { foo: '1' }, { foo: '3' } ], [ { foo: '2' }, { foo: '2' } ], [ { foo: '3' } ], [ { foo: '1' } ] ];
    const result = joinUniqueCustom( { key: v => v.foo, items } );
    expect( result ).toEqual( [ { foo: '1' }, { foo: '3' }, { foo: '2' } ] );
  } );

  it( 'Should keep the order, the duplicates are discarded', () => {
    const result = joinUniqueCustom( { key: v => v % 2 === 0, items: [ [ 1 ], [ 2 ], [ 3 ], [ 4 ] ] } );
    expect( result ).toEqual( [ 1, 2 ] );
  } );

  it( 'Should not break on empty arrays', () => {
    const result = joinUniqueCustom( { key: v => v.foo, items: [] } );
    expect( result ).toEqual( [] );
  } );
} );
