const parseValue = require( './parse_value' );

describe( 'Parse Value Spec', () => {
  it( 'Should parse float', () => {
    expect( parseValue( '1.12', 'float' ) ).toBe( 1.12 );
    expect( parseValue( '', 'float' ) ).toBe( undefined );
    expect( parseValue( null, 'float' ) ).toBe( undefined );
    expect( parseValue( undefined, 'float' ) ).toBe( undefined );
  } );

  it( 'Should parse int', () => {
    expect( parseValue( '1.12', 'int' ) ).toBe( 1 );
    expect( parseValue( '3', 'int' ) ).toBe( 3 );
    expect( parseValue( '', 'int' ) ).toBe( undefined );
    expect( parseValue( null, 'int' ) ).toBe( undefined );
    expect( parseValue( undefined, 'int' ) ).toBe( undefined );
  } );

  it( 'Should parse string', () => {
    expect( parseValue( 'foo', 'varchar' ) ).toEqual( 'foo' );
    expect( parseValue( '', 'varchar' ) ).toEqual( '' );
    expect( parseValue( null, 'varchar' ) ).toBe( undefined );
    expect( parseValue( undefined, 'varchar' ) ).toBe( undefined );
  } );

  it( 'Should parse timestamp', () => {
    expect( parseValue( '2024-09-12T17:30:42.958Z', 'timestamp' ) ).toBe( 1726162242958 );
    expect( parseValue( '2024-09-12 17:30:42', 'timestamp' ) ).toBe( 1726162242000 );
    expect( parseValue( '2024-09-12', 'timestamp' ) ).toBe( 1726099200000 );
    expect( parseValue( null, 'timestamp' ) ).toBe( undefined );
    expect( parseValue( undefined, 'timestamp' ) ).toBe( undefined );
  } );

  it( 'Should parse json objects', () => {
    expect( parseValue( '[{"foo":"bar"},"bar"]', 'json' ) ).toEqual( [ { foo: 'bar' }, 'bar' ] );
  } );

  describe( 'Arrays', () => {
    it( 'Should parse plain arrays', () => {
      expect( parseValue( '[1, 2, 3]', 'array' ) ).toEqual( [ '1', '2', '3' ] );
      expect( parseValue( '[foo a, bar]', 'array' ) ).toEqual( [ 'foo a', 'bar' ] );
      expect( parseValue( '', 'array' ) ).toBe( undefined );
      expect( parseValue( null, 'array' ) ).toBe( undefined );
      expect( parseValue( undefined, 'array' ) ).toBe( undefined );
    } );

    it( 'Should parse an array with an value containing =', () => {
      expect( parseValue( '[foo=, bar]', 'array' ) ).toEqual( [ 'foo=', 'bar' ] );
    } );

    it( 'Should parse an array with an value containing spaces =', () => {
      expect( parseValue( '[foo a, bar]', 'array' ) ).toEqual( [ 'foo a', 'bar' ] );
      expect( parseValue( '[foo 1, bar 2]', 'array' ) ).toEqual( [ 'foo 1', 'bar 2' ] );
    } );

    it( 'Should keep array null values', () => {
      expect( parseValue( '[1, null, 3]', 'array' ) ).toEqual( [ '1', null, '3' ] );
    } );
  } );

  describe( 'Rows (Struct)', () => {
    it( 'Should parse a simple row', () => {
      expect( parseValue( '{foo=bar}', 'row' ) ).toEqual( { foo: 'bar' } );
      expect( parseValue( '{prop1=value1, prop2=value2}', 'row' ) ).toEqual( { prop1: 'value1', prop2: 'value2' } );
    } );

    it( 'Should parse rows with values containing spaces', () => {
      expect( parseValue( '{foo=an apple}', 'row' ) ).toEqual( { foo: 'an apple' } );
    } );

    it( 'Should parse rows with values containing equals', () => {
      expect( parseValue( '{foo=an=apple}', 'row' ) ).toEqual( { foo: 'an=apple' } );
    } );

    it( 'Should parse rows with values containing ]', () => {
      expect( parseValue( '{foo=an]apple}', 'row' ) ).toEqual( { foo: 'an]apple' } );
    } );

    it( 'Should parse rows with values containing only numbers', () => {
      expect( parseValue( '{foo=00 23 00}', 'row' ) ).toEqual( { foo: '00 23 00' } );
    } );

    it( 'Should parse rows with keys containing hyphen and underscores', () => {
      expect( parseValue( '{kapa_beta-gama=2}', 'row' ) ).toEqual( { 'kapa_beta-gama': '2' } );
    } );

    it( 'Should parse rows with keys containing numbers', () => {
      expect( parseValue( '{2=2}', 'row' ) ).toEqual( { 2: '2' } );
    } );

    it( 'Should parse rows with null values as undefined', () => {
      expect( parseValue( '{foo=null}', 'row' ) ).toEqual( {} );
      expect( parseValue( '{a=b, foo=null}', 'row' ) ).toEqual( { a: 'b' } );
    } );

    it( 'Should parse a struct inside an array', () => {
      expect( parseValue( '[{foo=bar}, bar]', 'array' ) ).toEqual( [ { foo: 'bar' }, 'bar' ] );
      expect( parseValue( '{cars=[{maker=Toyota, model=Corolla}, {maker=Toyota, model=4Runner}]}', 'row' ) ).toEqual( {
        cars: [
          { maker: 'Toyota', model: 'Corolla' },
          { maker: 'Toyota', model: '4Runner' }
        ]
      } );
    } );

    it( 'Should parse a struct and array mixes', () => {
      expect( parseValue( '{type=table, colors=[red, green], format=round, sizes=[small, medium], dimensions=[10, 22, 13]}', 'row' ) ).toEqual( {
        type: 'table',
        colors: [ 'red', 'green' ],
        format: 'round',
        sizes: [ 'small', 'medium' ],
        dimensions: [ '10', '22', '13' ]
      } );
      expect( parseValue( '{colors=[red, green], format=round, sizes=[small, medium], dimensions=[10, 22, 13], type=table}', 'row' ) ).toEqual( {
        colors: [ 'red', 'green' ],
        format: 'round',
        sizes: [ 'small', 'medium' ],
        dimensions: [ '10', '22', '13' ],
        type: 'table'
      } );
    } );

    it( 'Should parse array with structs inside', () => {
      expect( parseValue( '[{foo=bar}, bar]', 'array' ) ).toEqual( [ { foo: 'bar' }, 'bar' ] );
      expect( parseValue( '[{foo=[bar]}, {foo=[bar]}]', 'array' ) ).toEqual( [
        { foo: [ 'bar' ] },
        { foo: [ 'bar' ] }
      ] );
    } );

    it( 'Should parse a deep nested object with structs inside', () => {
      expect( parseValue( '[{level1=[{level2=[{level3=[a, b, c]}]}]}]', 'array' ) ).toEqual( [ {
        level1: [ {
          level2: [ {
            level3: [ 'a', 'b', 'c' ]
          } ]
        } ]
      } ] );
    } );
  } );

  describe( 'Unconvertible Structs', () => {
    it( 'Should break when struct value has } inside value', () => {
      expect( _ => parseValue( '{foo=ba}r}', 'row' ) ).toThrow();
    } );

    it( 'Should break when struct value has [ inside value', () => {
      expect( _ => parseValue( '{foo=an[apple}', 'row' ) ).toThrow();
    } );

    it( 'Should break when there are spaces in the key', () => {
      expect( _ => parseValue( '{fo o=bar}', 'row' ) ).toThrow();
    } );
  } );
} );
