import { describe, it, mock, afterEach } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';

const commandInstance = {};
const constructorMock = mock.fn( () => commandInstance );

mock.module( '@aws-sdk/lib-dynamodb', {
  namedExports: {
    DeleteCommand: new Proxy( class DeleteCommand {}, {
      construct( _, args ) {
        return constructorMock( ...args );
      }
    } )
  }
} );

const { remove } = await import( './remove.js' );

const client = {
  send: mock.fn()
};

const tableName = 'table';
const key = { id: '123' };
const item = { id: '123', value: 'foo' };

describe( 'Dynamo Remove Spec', () => {
  afterEach( () => {
    mock.restoreAll();
    client.send.mock.resetCalls();
    constructorMock.mock.resetCalls();
  } );

  describe( 'Sugar mode', () => {
    it( 'Should remove an item', async () => {
      client.send.mock.mockImplementation( () => ( { Attributes: item } ) );

      const result = await remove( client, tableName, key );

      deepStrictEqual( result, item );
      strictEqual( client.send.mock.calls.length, 1 );
      deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
      strictEqual( constructorMock.mock.calls.length, 1 );
      deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
        ReturnValues: 'ALL_OLD',
        TableName: tableName,
        Key: key
      } );
    } );
  } );

  describe( 'Native mode', () => {
    it( 'Should remove an item', async () => {
      client.send.mock.mockImplementation( () => ( { Attributes: item } ) );

      const result = await remove( client, { TableName: tableName, Key: key } );

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
} );
