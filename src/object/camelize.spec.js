const camelize = require( './camelize' );

describe( 'Object: Camelize', () => {
  it( 'Should return a copy the object where each key was camelized', () => {
    const obj = {
      prop_tree: {
        ALL_CAPS: 1,
        deep_prop: {
          camelCase: 'bar',
          snake_case: 'foo'
        }
      },
      an_array: [ 1, { inner_array_prop: 1 }, 3 ],
      mixed_CAMEL_content: 1,
      PascalCase: 1,
      shallow_prop: 'test'
    };

    const result = camelize( obj );

    expect( result ).toEqual( {
      propTree: {
        allCaps: 1,
        deepProp: {
          camelCase: 'bar',
          snakeCase: 'foo'
        }
      },
      anArray: [ 1, { innerArrayProp: 1 }, 3 ],
      mixedCamelContent: 1,
      pascalCase: 1,
      shallowProp: 'test'
    } );
  } );

  it( 'Should keep ALL_CAPS properties if using the option', () => {
    const obj = {
      prop_tree: {
        ALL_CAPS: 1
      }
    };

    const result = camelize( obj, { keepAllCaps: true } );

    expect( result ).toEqual( {
      propTree: {
        ALL_CAPS: 1
      }
    } );
  } );

  it( 'Should not break on null object', () => {
    const result = camelize( null );
    expect( result ).toBe( null );
  } );
} );
