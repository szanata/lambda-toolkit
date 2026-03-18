import { describe, it, mock, afterEach } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';

const commandInstance = {};
const constructorMock = mock.fn( () => commandInstance );

mock.module( '@aws-sdk/lib-dynamodb', {
  namedExports: {
    PutCommand: new Proxy( class PutCommand {}, {
      construct( _, args ) {
        return constructorMock( ...args );
      }
    } )
  }
} );

const { put } = await import( './put.js' );

const client = {
  send: mock.fn()
};

const tableName = 'table';
const item = { id: '123', value: 'foo' };

describe( 'Dynamo Put Spec', () => {
  afterEach( () => {
    mock.restoreAll();
    client.send.mock.resetCalls();
    constructorMock.mock.resetCalls();
  } );

  describe( 'Sugar mode', () => {
    it( 'Should put an item', async () => {
      client.send.mock.mockImplementation( () => ( {
        $metadata: {
          httpStatusCode: 200,
          requestId: 'xxx',
          extendedRequestId: undefined,
          cfId: undefined,
          attempts: 1,
          totalRetryDelay: 0
        },
        Attributes: undefined,
        ConsumedCapacity: undefined,
        ItemCollectionMetrics: undefined
      } ) );

      const result = await put( client, tableName, item );

      deepStrictEqual( result, item );
      strictEqual( client.send.mock.calls.length, 1 );
      deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
      strictEqual( constructorMock.mock.calls.length, 1 );
      deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
        TableName: tableName,
        Item: item,
        ReturnValues: 'NONE',
        ReturnConsumedCapacity: 'NONE'
      } );
    } );
  } );

  describe( 'Native mode', () => {
    it( 'Should put an item', async () => {
      const oldDbItem = { id: '123', value: 'old' };

      client.send.mock.mockImplementation( () => ( {
        $metadata: {
          httpStatusCode: 200,
          requestId: 'xxx',
          extendedRequestId: undefined,
          cfId: undefined,
          attempts: 1,
          totalRetryDelay: 0
        },
        Attributes: oldDbItem,
        ConsumedCapacity: undefined,
        ItemCollectionMetrics: undefined
      } ) );

      const result = await put( client, { TableName: tableName, Item: item, ReturnValues: 'ALL_OLD' } );

      deepStrictEqual( result, oldDbItem );
      strictEqual( client.send.mock.calls.length, 1 );
      deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
      strictEqual( constructorMock.mock.calls.length, 1 );
      deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
        TableName: tableName,
        Item: item,
        ReturnValues: 'ALL_OLD'
      } );
    } );
  } );
} );
