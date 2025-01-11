const parsedResults = require( './parse_results' );
const queryResult = require( '../fixtures/query_result.json' );

describe( 'Parse Results Spec', () => {
  it( 'Should parse each column and serialize the result', () => {
    const result = parsedResults( queryResult.ResultSet );
    expect( result ).toEqual( [ {
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
