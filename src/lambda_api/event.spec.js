const Event = require( './event' );
const awsEventV1 = require( './fixtures/request_payload_v1.json' );
const awsEventV2 = require( './fixtures/request_payload_v2.json' );

describe( 'Event Spec', () => {
  describe( 'AWS Event Payload v1', () => {
    it( 'Should parse the event', () => {
      const event = new Event();
      event.parseFromAwsEvent( awsEventV1 );

      expect( event ).toEqual( {
        authorizer: { claims: null, scopes: null },
        headers: {
          header1: 'value1',
          header2: 'value1,value2'
        },
        method: 'GET',
        path: '/my/path/foo',
        route: '/my/path/{var}',
        params: { var: 'foo' },
        queryString: {
          parameter1: 'value1,value2',
          parameter2: 'value'
        },
        body: 'Hello from Lambda!',
        context: {}
      } );
    } );

    it( 'Should initialize params, qs and headers as empty objectives if absent', () => {
      const event = new Event();
      event.parseFromAwsEvent( { version: '1.0' } );

      expect( event ).toEqual( {
        authorizer: undefined,
        headers: {
        },
        method: undefined,
        path: undefined,
        route: undefined,
        params: {},
        queryString: {},
        body: null,
        context: {}
      } );
    } );
  } );

  describe( 'AWS Event Payload v2', () => {
    it( 'Should parse the event', () => {
      const event = new Event();
      event.parseFromAwsEvent( awsEventV2 );

      expect( event ).toEqual( {
        authorizer: {
          jwt: {
            claims: {
              claim1: 'value1',
              claim2: 'value2'
            },
            scopes: [
              'scope1',
              'scope2'
            ]
          }
        },
        headers: {
          header1: 'value1',
          header2: 'value1,value2'
        },
        method: 'POST',
        path: '/my/path/foo',
        route: '/my/path/{var}',
        params: { var: 'foo' },
        queryString: {
          parameter1: 'value1,value2',
          parameter2: 'value'
        },
        body: 'Hello from Lambda',
        context: {}
      } );
    } );

    it( 'Should initialize params, qs and headers as empty objectives if absent', () => {
      const event = new Event();
      event.parseFromAwsEvent( { requestContext: { http: {} } } );

      expect( event ).toEqual( {
        authorizer: undefined,
        headers: {
        },
        method: undefined,
        path: undefined,
        route: undefined,
        params: {},
        queryString: {},
        body: null,
        context: {}
      } );
    } );
  } );

  describe( 'Transformers', () => {
    it( 'Should build an event and convert qs, params and body to snakecase', () => {
      const body = JSON.stringify( { pageSize: 23 } );
      const queryStringParameters = { filterEvent: 'static' };
      const pathParameters = { javaScript: 'ES6' };

      const event = new Event( { transform: 'snakecase' } );
      event.parseFromAwsEventV2( { body, pathParameters, queryStringParameters, requestContext: { http: {} } } );

      expect( event.body ).toEqual( { page_size: 23 } );
      expect( event.params ).toEqual( { java_script: 'ES6' } );
      expect( event.queryString ).toEqual( { filter_event: 'static' } );
    } );

    it( 'Should build an event and convert qs, params and body to camelcase', () => {
      const body = JSON.stringify( { page_size: 23 } );
      const queryStringParameters = { filter_event: 'static' };
      const pathParameters = { java_script: 'ES6' };

      const event = new Event( { transform: 'camelcase' } );
      event.parseFromAwsEventV2( { body, pathParameters, queryStringParameters, requestContext: { http: {} } } );

      expect( event.body ).toEqual( { pageSize: 23 } );
      expect( event.params ).toEqual( { javaScript: 'ES6' } );
      expect( event.queryString ).toEqual( { filterEvent: 'static' } );
    } );

    it( 'Should not convert string body to camelcase', () => {
      const body = 'Hi there';
      const event = new Event( { transform: 'camelcase' } );
      event.parseFromAwsEventV2( { body, requestContext: { http: {} } } );

      expect( event.body ).toEqual( 'Hi there' );
    } );

    it( 'Should not convert string body to snakecase', () => {
      const body = 'Hi there';
      const event = new Event( { transform: 'snakecase' } );
      event.parseFromAwsEventV2( { body, requestContext: { http: {} } } );

      expect( event.body ).toEqual( 'Hi there' );
    } );
  } );
} );
