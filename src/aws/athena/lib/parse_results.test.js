import queryResult from '../fixtures/query_result.json' with { type: 'json' };
import { describe, it } from 'node:test';
import { deepStrictEqual } from 'node:assert';
import { parseResults } from './parse_results.js';

describe( 'Parse Results Spec', () => {
  it( 'Should parse each column and serialize the result', () => {
    const result = parseResults( queryResult.ResultSet );
    deepStrictEqual( result, [ {
      available: true,
      colors: [
        'red',
        'blue'
      ],
      date: 1666128698800,
      extras: {
        optionals: [
          'moonroof',
          'leather seats'
        ],
        wheels: [
          18,
          19,
          20
        ]
      },
      maker: 'Toyota',
      model: 'Corolla',
      technical_info: {
        engines: [
          'M20A-FKS 3',
          '2ZR-FXE 5'
        ]
      },
      year: 2024
    } ] );
  } );

  it( 'Should keep the first row when it is not a header row (pages after the first)', () => {
    const resultSet = {
      ResultSetMetadata: { ColumnInfo: [ { Name: 'n', Type: 'int' } ] },
      Rows: [ { Data: [ { VarCharValue: '3' } ] }, { Data: [ { VarCharValue: '4' } ] } ]
    };

    deepStrictEqual( parseResults( resultSet, { hasHeaderRow: false } ), [ { n: 3 }, { n: 4 } ] );
    deepStrictEqual( parseResults( resultSet ), [ { n: 4 } ] );
  } );
} );
