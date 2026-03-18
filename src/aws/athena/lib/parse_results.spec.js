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
} );
