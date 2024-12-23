const snakelize = require( './snakelize' );

describe( 'Object: Snakelize', () => {
  it( 'Should return a copy the object where each key was snakelize', () => {
    const obj = {
      propTree: {
        ALL_CAPS: 1,
        deepProp: {
          snake_case: 'bar',
          camelCase: 'foo'
        }
      },
      anArray: [ 1, { innerArrayProp: 1 }, 3 ],
      prop3WithNumber: 1,
      mixedCAMELContent: 1,
      PascalCase: 1,
      shallowProp: 'test'
    };

    const result = snakelize( obj );

    expect( result ).toEqual( {
      prop_tree: {
        all_caps: 1,
        deep_prop: {
          snake_case: 'bar',
          camel_case: 'foo'
        }
      },
      an_array: [ 1, { inner_array_prop: 1 }, 3 ],
      prop3_with_number: 1,
      mixed_camel_content: 1,
      pascal_case: 1,
      shallow_prop: 'test'
    } );
  } );

  it( 'Should keep ALL_CAPS properties if using the option', () => {
    const obj = {
      propTree: {
        ALL_CAPS: 1
      }
    };

    const result = snakelize( obj, { keepAllCaps: true } );

    expect( result ).toEqual( {
      prop_tree: {
        ALL_CAPS: 1
      }
    } );
  } );

  it( 'Should not break on null object', () => {
    const result = snakelize( null );
    expect( result ).toBe( null );
  } );
} );
