import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

import { parseValue } from './parse_value.js';

describe( 'Parse Value Spec', () => {
  it( 'Should parse null value as undefined', () => {
    strictEqual( parseValue( null ), undefined );
  } );

  it( 'Should parse undefined value as undefined', () => {
    strictEqual( parseValue( undefined ), undefined );
  } );

  describe( 'Float', () => {
    it( 'Should parse string with float number if the total number of digits is up to 16', () => {
      strictEqual( parseValue( '0.02' ), 0.02 );
      strictEqual( parseValue( '-0.005' ), -0.005 );
      strictEqual( parseValue( '-0.0000005' ), -0.0000005 );
      strictEqual( parseValue( '-0.000000000000005' ), -5e-15 );
      strictEqual( parseValue( '-1234567890.123456' ), -1234567890.123456 );
    } );

    it( 'Should not parse string with float number if the total number of digits is more than 16', () => {
      strictEqual( parseValue( '-11.000000000000005' ), '-11.000000000000005' );
      strictEqual( parseValue( '-123456789012345.123456' ), '-123456789012345.123456' );
    } );

    it( 'Should not parse string with float number if the value is bigger than the MAX_SAFE_INTEGER', () => {
      strictEqual( parseValue( Number.MAX_SAFE_INTEGER + '.1' ), Number.MAX_SAFE_INTEGER + '.1' );
    } );

    it( 'Should not parse string with float number if the value is smaller than the MIN_SAFE_INTEGER', () => {
      strictEqual( parseValue( Number.MIN_SAFE_INTEGER + '.1' ), Number.MIN_SAFE_INTEGER + '.1' );
    } );
  } );

  describe( 'Int', () => {
    it( 'Should parse string with positive integers that are smaller than the MAX_SAFE_VALUE to Number', () => {
      strictEqual( parseValue( '42' ), 42 );
      strictEqual( parseValue( '' + Number.MAX_SAFE_INTEGER ), Number.MAX_SAFE_INTEGER );
    } );

    it( 'Should not parse string with positive integers that are bigger than the MAX_SAFE_VALUE to Number', () => {
      strictEqual( parseValue( Number.MAX_SAFE_INTEGER + 1 + '' ), Number.MAX_SAFE_INTEGER + 1 + '' );
    } );

    it( 'Should parse string with negative integers that are bigger than the MIN_SAFE_VALUE to Number', () => {
      strictEqual( parseValue( '-42' ), -42 );
      strictEqual( parseValue( '' + Number.MIN_SAFE_INTEGER ), Number.MIN_SAFE_INTEGER );
    } );

    it( 'Should not parse string with negative integers that are smaller than the MIN_SAFE_VALUE to Number', () => {
      strictEqual( parseValue( Number.MIN_SAFE_INTEGER - 1 + '' ), Number.MIN_SAFE_INTEGER - 1 + '' );
    } );
  } );

  describe( 'Boolean', () => {
    it( 'Should parse "false" string to false value', () => {
      strictEqual( parseValue( 'false' ), false );
    } );

    it( 'Should parse "true" string to true value', () => {
      strictEqual( parseValue( 'true' ), true );
    } );
  } );

  describe( 'Date', () => {
    it( 'Should parse timestamp with only date', () => {
      strictEqual( parseValue( '2025-03-26' ).getTime(), new Date( '2025-03-26T00:00:00.000Z' ).getTime() );
    } );

    it( 'Should parse timestamp with milliseconds to date', () => {
      strictEqual( parseValue( '2025-03-26T11:36:14.234' ).getTime(), new Date( '2025-03-26T11:36:14.234Z' ).getTime() );
    } );

    it( 'Should parse timestamp with milliseconds to in UTC date', () => {
      strictEqual( parseValue( '2025-03-26T11:36:14.234Z' ).getTime(), new Date( '2025-03-26T11:36:14.234Z' ).getTime() );
    } );

    it( 'Should parse timestamp using " " instead of "T" as separator', () => {
      strictEqual( parseValue( '2025-03-26 11:36:14.234Z' ).getTime(), new Date( '2025-03-26T11:36:14.234Z' ).getTime() );
    } );

    it( 'Should parse timestamp without milliseconds', () => {
      strictEqual( parseValue( '2025-03-26T11:36:14' ).getTime(), new Date( '2025-03-26T11:36:14.000Z' ).getTime() );
    } );

    it( 'Should parse timestamp without milliseconds in UTC', () => {
      strictEqual( parseValue( '2025-03-26T11:36:14Z' ).getTime(), new Date( '2025-03-26T11:36:14.000Z' ).getTime() );
    } );

    it( 'Should parse timestamp and timezone offset', () => {
      strictEqual( parseValue( '2025-03-26T11:36:14.000+04:00' ).getTime(), new Date( '2025-03-26T11:36:14.000+04:00' ).getTime() );
    } );

    it( 'Should parse timestamp and timezone offset without colon', () => {
      strictEqual( parseValue( '2025-03-26T11:36:14.000+0400' ).getTime(), new Date( '2025-03-26T11:36:14.000+04:00' ).getTime() );
    } );
  } );
} );
