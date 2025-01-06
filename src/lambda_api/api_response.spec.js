const ApiResponse = require( './api_response' );

describe( 'Lambda API: Api Response Spec', () => {
  it( 'Should set the response code and return it serialized', () => {
    const response = new ApiResponse();
    response.setContent( 200 );
    expect( response.toJSON() ).toEqual( {
      statusCode: 200,
      body: '',
      headers: {
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
        'Content-Length': 0
      }
    } );
  } );

  it( 'Should set the response and return it serialized when the payload is a text', () => {
    const response = new ApiResponse();
    response.setContent( 200, 'Foo' );
    expect( response.toJSON() ).toEqual( {
      statusCode: 200,
      body: 'Foo',
      headers: {
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Length': 3
      }
    } );
  } );

  it( 'Should set the response and return it serialized when the payload is a JSON', () => {
    const response = new ApiResponse();
    response.setContent( 200, { color: 'red' } );

    expect( response.toJSON() ).toEqual( {
      statusCode: 200,
      body: '{"color":"red"}',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': 15
      }
    } );
  } );

  it( 'Should transform the response to snake_case if that option was set when creating the instance', () => {
    const response = new ApiResponse( { transform: 'snakecase' } );
    response.setContent( 200, { colorFamily: 'red' } );

    expect( response.toJSON() ).toEqual( {
      statusCode: 200,
      body: '{"color_family":"red"}',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': 22
      }
    } );
  } );

  it( 'Should transform the response to camelCase if that option was set when creating the instance', () => {
    const response = new ApiResponse( { transform: 'camelcase' } );
    response.setContent( 200, { color_family: 'red' } );

    expect( response.toJSON() ).toEqual( {
      statusCode: 200,
      body: '{"colorFamily":"red"}',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': 21
      }
    } );
  } );

  it( 'Should append extra headers at the response if those were set during the initialization', () => {
    const response = new ApiResponse( { headers: { 'X-Foo': 'bar' } } );
    response.setContent( 200, { colorFamily: 'red' } );

    expect( response.toJSON() ).toEqual( {
      statusCode: 200,
      body: '{"colorFamily":"red"}',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': 21,
        'X-Foo': 'bar'
      }
    } );
  } );

  it( 'Should append extra headers set during content setting', () => {
    const response = new ApiResponse();
    response.setContent( 200, { colorFamily: 'red' }, { 'X-Foo': 'bar' } );

    expect( response.toJSON() ).toEqual( {
      statusCode: 200,
      body: '{"colorFamily":"red"}',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': 21,
        'X-Foo': 'bar'
      }
    } );
  } );
} );
