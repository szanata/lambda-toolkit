import { describe, it, mock, afterEach } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';

const commandInstance = {};
const constructorMock = mock.fn( () => commandInstance );

mock.module( '@aws-sdk/lib-dynamodb', {
  namedExports: {
    GetCommand: new Proxy( class GetCommand {}, {
      construct( _, args ) {
        return constructorMock( ...args );
      }
    } )
  }
} );

const { get } = await import( './get.js' );

const client = {
  send: mock.fn()
};

const tableName = 'table';
const key = { id: '123' };
const item = { id: '123', value: 'foo' };

describe( 'Dynamo Get Spec', () => {
  afterEach( () => {
    mock.restoreAll();
    client.send.mock.resetCalls();
    constructorMock.mock.resetCalls();
  } );

  describe( 'Sugar mode', () => {
    it( 'Should get an item', async () => {
      client.send.mock.mockImplementation( () => ( { Item: item } ) );

      const result = await get( client, tableName, key );

      deepStrictEqual( result, item );
      strictEqual( client.send.mock.calls.length, 1 );
      deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
      strictEqual( constructorMock.mock.calls.length, 1 );
      deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
        TableName: tableName,
        Key: key
      } );
    } );
  } );

  describe( 'Native mode', () => {
    it( 'Should get an item', async () => {
      client.send.mock.mockImplementation( () => ( { Item: item } ) );

      const result = await get( client, { TableName: tableName, Key: item, ConsistentRead: true } );

      deepStrictEqual( result, item );
      strictEqual( client.send.mock.calls.length, 1 );
      deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
      strictEqual( constructorMock.mock.calls.length, 1 );
      deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
        TableName: tableName,
        Key: item,
        ConsistentRead: true
      } );
    } );
  } );
} );
