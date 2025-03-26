const parseValue = require( './parse_value' );

describe( 'Parse Value Spec', () => {
  it( 'Should parse null value as undefined', () => {
    expect( parseValue( null ) ).toEqual( undefined );
  } );

  it( 'Should parse undefined value as undefined', () => {
    expect( parseValue( undefined ) ).toEqual( undefined );
  } );

  describe( 'Float', () => {
    it( 'Should parse string with float number if the total number of digits is up to 16', () => {
      expect( parseValue( '0.02' ) ).toEqual( 0.02 );
      expect( parseValue( '-0.005' ) ).toEqual( -0.005 );
      expect( parseValue( '-0.0000005' ) ).toEqual( -0.0000005 );
      expect( parseValue( '-0.000000000000005' ) ).toEqual( -5e-15 );
      expect( parseValue( '-1234567890.123456' ) ).toEqual( -1234567890.123456 );
    } );

    it( 'Should not parse string with float number if the total number of digits is more than 16', () => {
      expect( parseValue( '-11.000000000000005' ) ).toEqual( '-11.000000000000005' );
      expect( parseValue( '-123456789012345.123456' ) ).toEqual( '-123456789012345.123456' );
    } );

    it( 'Should not parse string with float number if the value is bigger than the MAX_SAFE_INTEGER', () => {
      expect( parseValue( Number.MAX_SAFE_INTEGER + '.1' ) ).toEqual( Number.MAX_SAFE_INTEGER + '.1' );
    } );

    it( 'Should not parse string with float number if the value is smaller than the MIN_SAFE_INTEGER', () => {
      expect( parseValue( Number.MIN_SAFE_INTEGER + '.1' ) ).toEqual( Number.MIN_SAFE_INTEGER + '.1' );
    } );
  } );

  describe( 'Int', () => {
    it( 'Should parse string with positive integers that are smaller than the MAX_SAFE_VALUE to Number', () => {
      expect( parseValue( '42' ) ).toEqual( 42 );
      expect( parseValue( '' + Number.MAX_SAFE_INTEGER ) ).toEqual( Number.MAX_SAFE_INTEGER );
    } );

    it( 'Should not parse string with positive integers that are bigger than the MAX_SAFE_VALUE to Number', () => {
      expect( parseValue( Number.MAX_SAFE_INTEGER + 1 + '' ) ).toEqual( Number.MAX_SAFE_INTEGER + 1 + '' );
    } );

    it( 'Should parse string with negative integers that are bigger than the MIN_SAFE_VALUE to Number', () => {
      expect( parseValue( '-42' ) ).toEqual( -42 );
      expect( parseValue( '' + Number.MIN_SAFE_INTEGER ) ).toEqual( Number.MIN_SAFE_INTEGER );
    } );

    it( 'Should not parse string with negative integers that are smaller than the MIN_SAFE_VALUE to Number', () => {
      expect( parseValue( Number.MIN_SAFE_INTEGER - 1 + '' ) ).toEqual( Number.MIN_SAFE_INTEGER - 1 + '' );
    } );
  } );

  describe( 'Boolean', () => {
    it( 'Should parse "false" string to false value', () => {
      expect( parseValue( 'false' ) ).toEqual( false );
    } );

    it( 'Should parse "true" string to true value', () => {
      expect( parseValue( 'true' ) ).toEqual( true );
    } );
  } );

  describe( 'Date', () => {
    it( 'Should parse timestamp with only date', () => {
      expect( parseValue( '2025-03-26' ) ).toEqual( new Date( '2025-03-26T00:00:00.000Z' ) );
    } );

    it( 'Should parse timestamp with milliseconds to date', () => {
      expect( parseValue( '2025-03-26T11:36:14.234' ) ).toEqual( new Date( '2025-03-26T11:36:14.234Z' ) );
    } );

    it( 'Should parse timestamp with milliseconds to in UTC date', () => {
      expect( parseValue( '2025-03-26T11:36:14.234Z' ) ).toEqual( new Date( '2025-03-26T11:36:14.234Z' ) );
    } );

    it( 'Should parse timestamp using " " instead of "T" as separator', () => {
      expect( parseValue( '2025-03-26 11:36:14.234Z' ) ).toEqual( new Date( '2025-03-26T11:36:14.234Z' ) );
    } );

    it( 'Should parse timestamp without milliseconds', () => {
      expect( parseValue( '2025-03-26T11:36:14' ) ).toEqual( new Date( '2025-03-26T11:36:14.000Z' ) );
    } );

    it( 'Should parse timestamp without milliseconds in UTC', () => {
      expect( parseValue( '2025-03-26T11:36:14Z' ) ).toEqual( new Date( '2025-03-26T11:36:14.000Z' ) );
    } );

    it( 'Should parse timestamp and timezone offset', () => {
      expect( parseValue( '2025-03-26T11:36:14.000+04:00' ) ).toEqual( new Date( '2025-03-26T11:36:14.000+04:00' ) );
    } );

    it( 'Should parse timestamp and timezone offset without colon', () => {
      expect( parseValue( '2025-03-26T11:36:14.000+0400' ) ).toEqual( new Date( '2025-03-26T11:36:14.000+04:00' ) );
    } );
  } );
} );
