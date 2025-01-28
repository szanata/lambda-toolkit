const parseItems = require( './parse_items' );
const responseScalar = require( './fixtures/scalar.json' );
const responseArrayWithScalar = require( './fixtures/array_with_scalar.json' );
const responseArrayWithArray = require( './fixtures/array_with_array.json' );
const responseArrayWithRow = require( './fixtures/array_with_row.json' );
const responseRowWithScalar = require( './fixtures/row_with_scalar.json' );
const responseRowWithRow = require( './fixtures/row_with_row.json' );
const responseRowWithArray = require( './fixtures/row_with_array.json' );
const responseTimeSeriesWithScalar = require( './fixtures/timeseries_with_scalar.json' );
const responseTimeSeriesWithArray = require( './fixtures/timeseries_with_array.json' );

describe( 'Parse Items Spec', () => {
  it( 'Should parse scalar values', () => {
    const result = parseItems( responseScalar );
    expect( result ).toEqual( [
      {
        boolean: true,
        double: 23.33333,
        timestamp: new Date( '2025-01-01T10:12:30.333Z' ),
        integer: 42,
        varchar: 'foo',
        bigint: '9223372036854775807',
        date: '2025-01-01',
        time: '10:33:22.000000000',
        interval_day_to_second: '0 00:00:23.000000000',
        interval_year_to_month: '1-11',
        nil: null
      }
    ] );
  } );

  describe( 'BigInt', () => {
    it( 'Should convert big int to JS Number if it lies between MIN and MAX SAFE INTEGER', () => {
      const result = parseItems( {
        ColumnInfo: [ { Name: 'bigInt', Type: { ScalarType: 'BIGINT' } } ],
        Rows: [ { Data: [ { ScalarValue: '10' } ] } ]
      } );
      expect( result ).toEqual( [ { bigInt: 10 } ] );
    } );

    it( 'Should convert big int to JS Number if it is exactly the MIN SAFE INTEGER', () => {
      const result = parseItems( {
        ColumnInfo: [ { Name: 'bigInt', Type: { ScalarType: 'BIGINT' } } ],
        Rows: [ { Data: [ { ScalarValue: '-9007199254740991' } ] } ]
      } );
      expect( result ).toEqual( [ { bigInt: -9007199254740991 } ] );
    } );

    it( 'Should convert big int to JS Number if it is exactly the MAX SAFE INTEGER', () => {
      const result = parseItems( {
        ColumnInfo: [ { Name: 'bigInt', Type: { ScalarType: 'BIGINT' } } ],
        Rows: [ { Data: [ { ScalarValue: '9007199254740991' } ] } ]
      } );
      expect( result ).toEqual( [ { bigInt: 9007199254740991 } ] );
    } );

    it( 'Should keep big int as String if it is below MIN SAFE INTEGER', () => {
      const result = parseItems( {
        ColumnInfo: [ { Name: 'bigInt', Type: { ScalarType: 'BIGINT' } } ],
        Rows: [ { Data: [ { ScalarValue: '-9007199254740992' } ] } ]
      } );
      expect( result ).toEqual( [ { bigInt: '-9007199254740992' } ] );
    } );

    it( 'Should keep big int as String if it is above MAX SAFE INTEGER', () => {
      const result = parseItems( {
        ColumnInfo: [ { Name: 'bigInt', Type: { ScalarType: 'BIGINT' } } ],
        Rows: [ { Data: [ { ScalarValue: '9007199254740992' } ] } ]
      } );
      expect( result ).toEqual( [ { bigInt: '9007199254740992' } ] );
    } );
  } );

  describe( 'Array', () => {
    it( 'Should parse array with scalar values', () => {
      const result = parseItems( responseArrayWithScalar );
      expect( result ).toEqual( [
        { myArray: [ '3180702a', 'b0a70441', 'b4e6a9cb' ] },
        { myArray: [ 'f5e0461f', 'c0b12268', '61b3f754' ] },
        { myArray: [ 'd8d752b7', '451e8d9d', '182e10ed' ] }
      ] );
    } );

    it( 'Should parse array with arrays inside', () => {
      const result = parseItems( responseArrayWithArray );
      expect( result ).toEqual( [
        { myArray: [ [ 1, 2 ], [ 3 ] ] }
      ] );
    } );

    it( 'Should parse array with rows inside', () => {
      const result = parseItems( responseArrayWithRow );
      expect( result ).toEqual( [
        { myArray: [ { field0: 'Corolla', field1: 300 }, { field0: 'Civic', field1: 314 } ] }
      ] );
    } );
  } );

  describe( 'Row', () => {
    it( 'Should parse row with scalar values', () => {
      const result = parseItems( responseRowWithScalar );
      expect( result ).toEqual( [
        { myRow: { field0: new Date( '2025-01-13T14:07:38.644Z' ), field1: 12 } },
        { myRow: { field0: new Date( '2025-01-13T14:07:55.690Z' ), field1: 23 } },
        { myRow: { field0: new Date( '2025-01-13T14:07:54.452Z' ), field1: 42 } }
      ] );
    } );

    it( 'Should parse row with rows inside', () => {
      const result = parseItems( responseRowWithRow );
      expect( result ).toEqual( [
        {
          myRow: {
            field0: {
              field0: new Date( '2025-01-13T14:07:38.644Z' ),
              field1: 14
            },
            field1: {
              field0: 'bb67ab21',
              field1: false
            }
          }
        },
        {
          myRow: {
            field0: {
              field0: new Date( '2025-01-13T14:07:56.043Z' ),
              field1: 32
            },
            field1: {
              field0: 'a873afbb',
              field1: true
            }
          }
        }
      ] );
    } );

    it( 'Should parse row with arrays inside', () => {
      const result = parseItems( responseRowWithArray );
      expect( result ).toEqual( [
        { myRow: { field0: [ 3684, 7368 ], field1: [ 'Corolla', 'Camry' ] } },
        { myRow: { field0: [ 384524, 769048 ], field1: [ 'Civic', 'Accord' ] } }
      ] );
    } );
  } );

  describe( 'Time Series', () => {
    it( 'Should parse a time series with scalar values', () => {
      const result = parseItems( responseTimeSeriesWithScalar );
      expect( result ).toEqual( [
        {
          timeSeries: [
            { time: new Date( '2025-01-10T10:00:00.000Z' ), value: 456 },
            { time: new Date( '2025-01-10T11:00:00.000Z' ), value: 231 },
            { time: new Date( '2025-01-10T12:00:00.000Z' ), value: 892 }
          ]
        }
      ] );
    } );

    it( 'Should parse a time series with arrays inside', () => {
      const result = parseItems( responseTimeSeriesWithArray );
      expect( result ).toEqual( [
        {
          label: 'Super Time Series', timeSeries: [
            { time: new Date( '2025-01-10T23:11:00.000Z' ), value: [ 10, 5 ] },
            { time: new Date( '2025-01-10T23:12:00.000Z' ), value: [ 3, 2 ] },
            { time: new Date( '2025-01-10T23:13:00.000Z' ), value: [ 3, 10 ] }
          ]
        }
      ] );
    } );
  } );
} );
