import { describe, it } from 'node:test';
import { strictEqual, deepStrictEqual, throws } from 'node:assert';
import { parseValue } from './parse_value.js';

describe( 'Parse Value Spec', () => {
  it( 'Should parse float', () => {
    strictEqual( parseValue( '1.12', 'float' ), 1.12 );
    strictEqual( parseValue( '', 'float' ), undefined );
    strictEqual( parseValue( null, 'float' ), undefined );
    strictEqual( parseValue( undefined, 'float' ), undefined );
  } );

  it( 'Should parse int', () => {
    strictEqual( parseValue( '1.12', 'int' ), 1 );
    strictEqual( parseValue( '3', 'int' ), 3 );
    strictEqual( parseValue( '', 'int' ), undefined );
    strictEqual( parseValue( null, 'int' ), undefined );
    strictEqual( parseValue( undefined, 'int' ), undefined );
  } );

  it( 'Should parse string', () => {
    strictEqual( parseValue( 'foo', 'varchar' ), 'foo' );
    strictEqual( parseValue( '', 'varchar' ), '' );
    strictEqual( parseValue( null, 'varchar' ), undefined );
    strictEqual( parseValue( undefined, 'varchar' ), undefined );
  } );

  it( 'Should parse timestamp', () => {
    strictEqual( parseValue( '2024-09-12T17:30:42.958Z', 'timestamp' ), 1726162242958 );
    strictEqual( parseValue( '2024-09-12 17:30:42', 'timestamp' ), 1726162242000 );
    strictEqual( parseValue( '2024-09-12', 'timestamp' ), 1726099200000 );
    strictEqual( parseValue( null, 'timestamp' ), undefined );
    strictEqual( parseValue( undefined, 'timestamp' ), undefined );
  } );

  it( 'Should parse json objects', () => {
    deepStrictEqual( parseValue( '[{"foo":"bar"},"bar"]', 'json' ), [ { foo: 'bar' }, 'bar' ] );
  } );

  describe( 'Arrays', () => {
    it( 'Should parse plain arrays', () => {
      deepStrictEqual( parseValue( '[1, 2, 3]', 'array' ), [ '1', '2', '3' ] );
      deepStrictEqual( parseValue( '[foo a, bar]', 'array' ), [ 'foo a', 'bar' ] );
      strictEqual( parseValue( '', 'array' ), undefined );
      strictEqual( parseValue( null, 'array' ), undefined );
      strictEqual( parseValue( undefined, 'array' ), undefined );
    } );

    it( 'Should parse an array with an value containing =', () => {
      deepStrictEqual( parseValue( '[foo=, bar]', 'array' ), [ 'foo=', 'bar' ] );
    } );

    it( 'Should parse an array with an value containing spaces =', () => {
      deepStrictEqual( parseValue( '[foo a, bar]', 'array' ), [ 'foo a', 'bar' ] );
      deepStrictEqual( parseValue( '[foo 1, bar 2]', 'array' ), [ 'foo 1', 'bar 2' ] );
    } );

    it( 'Should keep array null values', () => {
      deepStrictEqual( parseValue( '[1, null, 3]', 'array' ), [ '1', null, '3' ] );
    } );
  } );

  describe( 'Rows (Struct)', () => {
    it( 'Should parse a simple row', () => {
      deepStrictEqual( parseValue( '{foo=bar}', 'row' ), { foo: 'bar' } );
      deepStrictEqual( parseValue( '{prop1=value1, prop2=value2}', 'row' ), { prop1: 'value1', prop2: 'value2' } );
    } );

    it( 'Should parse rows with values containing spaces', () => {
      deepStrictEqual( parseValue( '{foo=an apple}', 'row' ), { foo: 'an apple' } );
    } );

    it( 'Should parse rows with values containing equals', () => {
      deepStrictEqual( parseValue( '{foo=an=apple}', 'row' ), { foo: 'an=apple' } );
    } );

    it( 'Should parse rows with values containing ]', () => {
      deepStrictEqual( parseValue( '{foo=an]apple}', 'row' ), { foo: 'an]apple' } );
    } );

    it( 'Should parse rows with values containing only numbers', () => {
      deepStrictEqual( parseValue( '{foo=00 23 00}', 'row' ), { foo: '00 23 00' } );
    } );

    it( 'Should parse rows with keys containing hyphen and underscores', () => {
      deepStrictEqual( parseValue( '{kapa_beta-gama=2}', 'row' ), { 'kapa_beta-gama': '2' } );
    } );

    it( 'Should parse rows with keys containing numbers', () => {
      deepStrictEqual( parseValue( '{2=2}', 'row' ), { 2: '2' } );
    } );

    it( 'Should parse rows with null values as undefined', () => {
      deepStrictEqual( parseValue( '{foo=null}', 'row' ), {} );
      deepStrictEqual( parseValue( '{a=b, foo=null}', 'row' ), { a: 'b' } );
    } );

    it( 'Should parse a struct inside an array', () => {
      deepStrictEqual( parseValue( '[{foo=bar}, bar]', 'array' ), [ { foo: 'bar' }, 'bar' ] );
      deepStrictEqual( parseValue( '{cars=[{maker=Toyota, model=Corolla}, {maker=Toyota, model=4Runner}]}', 'row' ), {
        cars: [
          { maker: 'Toyota', model: 'Corolla' },
          { maker: 'Toyota', model: '4Runner' }
        ]
      } );
    } );

    it( 'Should parse a struct and array mixes', () => {
      deepStrictEqual( parseValue( '{type=table, colors=[red, green], format=round, sizes=[small, medium], dimensions=[10, 22, 13]}', 'row' ), {
        type: 'table',
        colors: [ 'red', 'green' ],
        format: 'round',
        sizes: [ 'small', 'medium' ],
        dimensions: [ '10', '22', '13' ]
      } );
      deepStrictEqual( parseValue( '{colors=[red, green], format=round, sizes=[small, medium], dimensions=[10, 22, 13], type=table}', 'row' ), {
        colors: [ 'red', 'green' ],
        format: 'round',
        sizes: [ 'small', 'medium' ],
        dimensions: [ '10', '22', '13' ],
        type: 'table'
      } );
    } );

    it( 'Should parse array with structs inside', () => {
      deepStrictEqual( parseValue( '[{foo=bar}, bar]', 'array' ), [ { foo: 'bar' }, 'bar' ] );
      deepStrictEqual( parseValue( '[{foo=[bar]}, {foo=[bar]}]', 'array' ), [
        { foo: [ 'bar' ] },
        { foo: [ 'bar' ] }
      ] );
    } );

    it( 'Should parse a deep nested object with structs inside', () => {
      deepStrictEqual( parseValue( '[{level1=[{level2=[{level3=[a, b, c]}]}]}]', 'array' ), [ {
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
      throws( _ => parseValue( '{foo=ba}r}', 'row' ), Error );
    } );

    it( 'Should break when struct value has [ inside value', () => {
      throws( _ => parseValue( '{foo=an[apple}', 'row' ), Error );
    } );

    it( 'Should break when there are spaces in the key', () => {
      throws( _ => parseValue( '{fo o=bar}', 'row' ), Error );
    } );
  } );
} );
