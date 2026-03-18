import { describe, it, mock, afterEach } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';

import { randomBytes } from 'node:crypto';
import { Encoder } from '../core/encoder.js';

const commandInstance = {};
const scanConstructorMock = mock.fn( () => commandInstance );
const queryConstructorMock = mock.fn( () => commandInstance );

mock.module( '@aws-sdk/lib-dynamodb', {
  namedExports: {
    ScanCommand: new Proxy( class ScanCommand {}, {
      construct( _, args ) {
        return scanConstructorMock( ...args );
      }
    } ),
    QueryCommand: new Proxy( class QueryCommand {}, {
      construct( _, args ) {
        return queryConstructorMock( ...args );
      }
    } )
  }
} );

const { select } = await import( './select.js' );

const client = {
  send: mock.fn()
};

const makeItems = count => Array( count ).fill().map( () => ( { id: randomBytes( 4 ).toString( 'hex' ) } ) );

describe( 'Dynamo "select" (query/scan) Spec', () => {
  afterEach( () => {
    mock.restoreAll();
    client.send.mock.resetCalls();
    scanConstructorMock.mock.resetCalls();
    queryConstructorMock.mock.resetCalls();
  } );

  describe( 'Recursive', () => {
    it( 'Should recursively query the database until it cannot paginate anymore', async () => {
      const pages = [ makeItems( 5 ), makeItems( 5 ), makeItems( 3 ) ];
      const args = {
        TableName: 'foo-bar'
      };
      const paginationKey = { id: '5' };
      const paginationKey2 = { id: '10' };

      // calls 1 to 3
      client.send.mock.mockImplementationOnce( async _ => ( { Items: pages[0], Count: pages[0].length, LastEvaluatedKey: paginationKey } ), 0 );
      client.send.mock.mockImplementationOnce( async _ => ( { Items: pages[1], Count: pages[1].length, LastEvaluatedKey: paginationKey2 } ), 1 );
      client.send.mock.mockImplementationOnce( async _ => ( { Items: pages[2], Count: pages[2].length, LastEvaluatedKey: null } ), 2 );

      const result = await select( client, 'query', args, { recursive: true } );

      deepStrictEqual( result, { items: pages.flat(), count: pages.flat().length } );
      strictEqual( client.send.mock.calls.length, 3 );
      deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
      deepStrictEqual( client.send.mock.calls[1].arguments[0], commandInstance );
      deepStrictEqual( client.send.mock.calls[2].arguments[0], commandInstance );
      strictEqual( queryConstructorMock.mock.calls.length, 3 );
      deepStrictEqual( queryConstructorMock.mock.calls[0].arguments[0], args );
      deepStrictEqual( queryConstructorMock.mock.calls[1].arguments[0], { ...args, ExclusiveStartKey: paginationKey } );
      deepStrictEqual( queryConstructorMock.mock.calls[2].arguments[0], { ...args, ExclusiveStartKey: paginationKey2 } );
    } );

    it( 'Should recursively scan the database until it cannot paginate anymore', async () => {
      const pages = [ makeItems( 5 ), makeItems( 5 ), makeItems( 3 ) ];
      const args = {
        TableName: 'foo-bar'
      };
      const paginationKey = { id: '5' };
      const paginationKey2 = { id: '10' };

      // calls 1 to 3
      client.send.mock.mockImplementationOnce( async _ => ( { Items: pages[0], Count: pages[0].length, LastEvaluatedKey: paginationKey } ), 0 );
      client.send.mock.mockImplementationOnce( async _ => ( { Items: pages[1], Count: pages[1].length, LastEvaluatedKey: paginationKey2 } ), 1 );
      client.send.mock.mockImplementationOnce( async _ => ( { Items: pages[2], Count: pages[2].length, LastEvaluatedKey: null } ), 2 );

      const result = await select( client, 'scan', args, { recursive: true } );

      deepStrictEqual( result, { items: pages.flat(), count: pages.flat().length } );
      strictEqual( client.send.mock.calls.length, 3 );
      deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
      deepStrictEqual( client.send.mock.calls[1].arguments[0], commandInstance );
      deepStrictEqual( client.send.mock.calls[2].arguments[0], commandInstance );
      strictEqual( scanConstructorMock.mock.calls.length, 3 );
      deepStrictEqual( scanConstructorMock.mock.calls[0].arguments[0], args );
      deepStrictEqual( scanConstructorMock.mock.calls[1].arguments[0], { ...args, ExclusiveStartKey: paginationKey } );
      deepStrictEqual( scanConstructorMock.mock.calls[2].arguments[0], { ...args, ExclusiveStartKey: paginationKey2 } );
    } );

    it( 'Should stop the recursion if the "Limit" in args is satisfied', async () => {
      const pages = [ makeItems( 5 ), makeItems( 5 ), makeItems( 3 ) ];
      const args = {
        TableName: 'foo-bar',
        Limit: 8
      };
      const paginationKey = { id: '5' };
      const paginationKey2 = { id: '10' };

      // calls 1 to 3
      client.send.mock.mockImplementationOnce( async _ => ( { Items: pages[0], Count: pages[0].length, LastEvaluatedKey: paginationKey } ), 0 );
      client.send.mock.mockImplementationOnce( async _ => ( { Items: pages[1], Count: pages[1].length, LastEvaluatedKey: paginationKey2 } ), 1 );
      client.send.mock.mockImplementationOnce( async _ => ( { Items: pages[2], Count: pages[2].length, LastEvaluatedKey: null } ), 2 );

      const result = await select( client, 'scan', args, { recursive: true } );

      deepStrictEqual( result, { items: pages.flat().slice( 0, 8 ), count: 8 } );
      strictEqual( client.send.mock.calls.length, 2 );
      deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
      deepStrictEqual( client.send.mock.calls[1].arguments[0], commandInstance );
      strictEqual( scanConstructorMock.mock.calls.length, 2 );
      deepStrictEqual( scanConstructorMock.mock.calls[0].arguments[0], args );
      deepStrictEqual( scanConstructorMock.mock.calls[1].arguments[0], { ...args, ExclusiveStartKey: paginationKey } );
    } );

    it( 'Should trim the results to the "Limit" argument in the native args if present', async () => {
      const limit = 6;
      const pages = [ makeItems( 5 ), makeItems( 5 ) ];
      const args = {
        TableName: 'foo-bar',
        Limit: limit
      };
      const paginationKey = { id: '123' };

      // calls 1 and 2
      client.send.mock.mockImplementationOnce( async _ => ( { Items: pages[0], Count: pages[0].length, LastEvaluatedKey: paginationKey } ), 0 );
      client.send.mock.mockImplementationOnce( async _ => ( { Items: pages[1], Count: pages[1].length, LastEvaluatedKey: null } ), 1 );

      const result = await select( client, 'query', args, { recursive: true } );

      deepStrictEqual( result, { items: pages.flat().slice( 0, 6 ), count: limit } );
      strictEqual( client.send.mock.calls.length, 2 );
      deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
      deepStrictEqual( client.send.mock.calls[1].arguments[0], commandInstance );
      strictEqual( queryConstructorMock.mock.calls.length, 2 );
      deepStrictEqual( queryConstructorMock.mock.calls[0].arguments[0], args );
      deepStrictEqual( queryConstructorMock.mock.calls[1].arguments[0], { ...args, ExclusiveStartKey: paginationKey } );
    } );

    it( 'Should allow a "Count" select, query there are no items, just numbers', async () => {
      const args = {
        TableName: 'foo-bar',
        Select: 'COUNT'
      };
      const paginationKey = { id: '123' };

      // calls 1 and 2
      client.send.mock.mockImplementationOnce( async _ => ( { Items: undefined, Count: 10, LastEvaluatedKey: paginationKey } ), 0 );
      client.send.mock.mockImplementationOnce( async _ => ( { Items: undefined, Count: 10, LastEvaluatedKey: null } ), 1 );

      const result = await select( client, 'query', args, { recursive: true } );

      deepStrictEqual( result, { items: null, count: 20 } );
      strictEqual( client.send.mock.calls.length, 2 );
      deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
      deepStrictEqual( client.send.mock.calls[1].arguments[0], commandInstance );
      strictEqual( queryConstructorMock.mock.calls.length, 2 );
      deepStrictEqual( queryConstructorMock.mock.calls[0].arguments[0], args );
      deepStrictEqual( queryConstructorMock.mock.calls[1].arguments[0], { ...args, ExclusiveStartKey: paginationKey } );
    } );
  } );

  describe( 'Default', () => {
    it( 'Should return a page of results and a key to next results', async () => {
      const items = makeItems( 10 );

      const nextPaginationKey = { id: '10' };

      client.send.mock.mockImplementationOnce( async () => ( { Items: items, Count: items.length, LastEvaluatedKey: nextPaginationKey } ), 0 );

      const result = await select( client, 'query', {} );

      deepStrictEqual( result, {
        items,
        count: items.length,
        nextToken: Encoder.encode( nextPaginationKey )
      } );
    } );

    it( 'Should return a page of results using the "paginationToken" option', async () => {
      const items = makeItems( 10 );

      const paginationKey = { id: '10' };
      const nextPaginationKey = { id: '20' };

      client.send.mock.mockImplementationOnce( async _ => ( { Items: items, Count: items.length, LastEvaluatedKey: nextPaginationKey } ), 0 );

      const result = await select( client, 'query', {}, { paginationToken: Encoder.encode( paginationKey ) } );

      deepStrictEqual( result, {
        items,
        count: items.length,
        nextToken: Encoder.encode( nextPaginationKey )
      } );
    } );
  } );
} );
