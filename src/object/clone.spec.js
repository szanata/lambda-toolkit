const clone = require( './clone' );

describe( 'Clone Spec', () => {
  it( 'Should deep clone a object with just primitives or plain objects inside', () => {
    const obj1 = {
      name: 'obj1',
      sub: { type: 'original' }
    };

    const obj2 = clone( obj1 );
    obj2.name = 'obj2';
    obj2.sub.type = 'copy';

    expect( obj1.name ).toBe( 'obj1' );
    expect( obj1.sub.type ).toBe( 'original' );

    expect( obj2.name ).toBe( 'obj2' );
    expect( obj2.sub.type ).toBe( 'copy' );
  } );
} );
