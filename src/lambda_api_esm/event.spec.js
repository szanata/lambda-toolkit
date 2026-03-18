import { Event } from './event.js';
import awsEventV1 from './fixtures/request_payload_v1.json' with { type: 'json' };
import awsEventV2 from './fixtures/request_payload_v2.json' with { type: 'json' };
import { describe, it } from 'node:test';
import { deepStrictEqual } from 'node:assert';

describe( 'Event Spec', () => {
  describe( 'AWS Event Payload v1', () => {
    it( 'Should parse the event', () => {
      const event = new Event();
      event.parseFromAwsEvent( awsEventV1 );

      deepStrictEqual( { ...event }, {
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
        rawBody: 'Hello from Lambda!',
        context: {},
        isBase64Encoded: false
      } );
    } );

    it( 'Should initialize params, qs and headers as empty objects and encoding as false if absent', () => {
      const event = new Event();
      event.parseFromAwsEvent( { version: '1.0' } );

      deepStrictEqual( { ...event }, {
        authorizer: undefined,
        headers: {
        },
        method: undefined,
        path: undefined,
        route: undefined,
        params: {},
        queryString: {},
        body: null,
        rawBody: null,
        context: {},
        isBase64Encoded: false
      } );
    } );
  } );

  describe( 'AWS Event Payload v2', () => {
    it( 'Should parse the event', () => {
      const event = new Event();
      event.parseFromAwsEvent( awsEventV2 );

      deepStrictEqual( { ...event }, {
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
        rawBody: 'Hello from Lambda',
        context: {},
        isBase64Encoded: false
      } );
    } );

    it( 'Should initialize params, qs and headers as empty objects and encoding as false if absent', () => {
      const event = new Event();
      event.parseFromAwsEvent( { requestContext: { http: {} } } );

      deepStrictEqual( { ...event }, {
        authorizer: undefined,
        headers: {},
        method: undefined,
        path: undefined,
        route: undefined,
        params: {},
        queryString: {},
        body: null,
        rawBody: null,
        context: {},
        isBase64Encoded: false
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

      deepStrictEqual( event.body, { page_size: 23 } );
      deepStrictEqual( event.params, { java_script: 'ES6' } );
      deepStrictEqual( event.queryString, { filter_event: 'static' } );
    } );

    it( 'Should build an event and convert qs, params and body to camelcase', () => {
      const body = JSON.stringify( { page_size: 23 } );
      const queryStringParameters = { filter_event: 'static' };
      const pathParameters = { java_script: 'ES6' };

      const event = new Event( { transform: 'camelcase' } );
      event.parseFromAwsEventV2( { body, pathParameters, queryStringParameters, requestContext: { http: {} } } );

      deepStrictEqual( event.body, { pageSize: 23 } );
      deepStrictEqual( event.params, { javaScript: 'ES6' } );
      deepStrictEqual( event.queryString, { filterEvent: 'static' } );
    } );

    it( 'Should not convert string body to camelcase', () => {
      const body = 'Hi there';
      const event = new Event( { transform: 'camelcase' } );
      event.parseFromAwsEventV2( { body, requestContext: { http: {} } } );

      deepStrictEqual( event.body, 'Hi there' );
    } );

    it( 'Should not convert string body to snakecase', () => {
      const body = 'Hi there';
      const event = new Event( { transform: 'snakecase' } );
      event.parseFromAwsEventV2( { body, requestContext: { http: {} } } );

      deepStrictEqual( event.body, 'Hi there' );
    } );
  } );
} );
