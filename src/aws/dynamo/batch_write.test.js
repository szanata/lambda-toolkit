import { describe, it, mock, afterEach } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';

const commandInstance = {};
const constructorMock = mock.fn( () => commandInstance );

mock.module( '@aws-sdk/lib-dynamodb', {
  namedExports: {
    BatchWriteCommand: new Proxy( class BatchWriteCommand {}, {
      construct( _, args ) {
        return constructorMock( ...args );
      }
    } )
  }
} );

const { batchWrite } = await import( './batch_write.js' );

const tableName = 'cars';
const client = {
  send: mock.fn()
};

describe( 'Dynamo "batch write" (put/remove) Spec', () => {
  afterEach( () => {
    mock.restoreAll();
    client.send.mock.resetCalls();
    constructorMock.mock.resetCalls();
  } );

  describe( 'Delete', () => {
    it( 'Should break into batches and send the delete commands', async () => {
      const items = Array( 30 ).fill().map( ( _, id ) => ( { id } ) );
      client.send.mock.mockImplementation( () => ( {} ) );

      const result = await batchWrite( client, 'remove', tableName, items );

      strictEqual( result, true );
      strictEqual( client.send.mock.calls.length, 2 );
      strictEqual( constructorMock.mock.calls.length, 2 );
      deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
        RequestItems: {
          [tableName]: items.slice( 0, 25 ).map( key => ( { DeleteRequest: { Key: key } } ) )
        }
      } );
      deepStrictEqual( constructorMock.mock.calls[1].arguments[0], {
        RequestItems: {
          [tableName]: items.slice( 25 ).map( key => ( { DeleteRequest: { Key: key } } ) )
        }
      } );
    } );

    it( 'Should handled unprocessed items and add them to the batches, recalculating it to 25', async () => {
      const items = Array( 48 ).fill().map( ( _, id ) => ( { id } ) );
      const rejections = [ items[0], items[1], items[24], items[25] ];

      // call 1
      client.send.mock.mockImplementationOnce( async _ => ( {
        UnprocessedItems: {
          [tableName]: [
            { DeleteRequest: { Key: rejections[0] } },
            { DeleteRequest: { Key: rejections[1] } }
          ]
        }
      } ), 0 );
      // call 2
      client.send.mock.mockImplementationOnce( async _ => ( {
        UnprocessedItems: {
          [tableName]: [
            { DeleteRequest: { Key: rejections[2] } },
            { DeleteRequest: { Key: rejections[3] } }
          ]
        }
      } ), 1 );
      // call 3
      client.send.mock.mockImplementationOnce( async _ => ( {} ), 2 );

      const result = await batchWrite( client, 'remove', tableName, items );

      strictEqual( result, true );
      strictEqual( client.send.mock.calls.length, 3 );
      strictEqual( constructorMock.mock.calls.length, 3 );
      deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
        RequestItems: {
          [tableName]: items.slice( 0, 25 ).map( key => ( { DeleteRequest: { Key: key } } ) )
        }
      } );
      deepStrictEqual( constructorMock.mock.calls[1].arguments[0], {
        RequestItems: {
          [tableName]: items.slice( 25 ).concat( rejections[0], rejections[1] ).map( key => ( { DeleteRequest: { Key: key } } ) )
        }
      } );
      deepStrictEqual( constructorMock.mock.calls[2].arguments[0], {
        RequestItems: {
          [tableName]: [ rejections[2], rejections[3] ].map( key => ( { DeleteRequest: { Key: key } } ) )
        }
      } );
    } );
  } );

  describe( 'Put', () => {
    it( 'Should break into batches and send the put commands', async () => {
      const items = Array( 30 ).fill().map( ( _, id ) => ( { id } ) );
      client.send.mock.mockImplementation( () => ( {} ) );

      const result = await batchWrite( client, 'put', tableName, items );

      strictEqual( result, true );
      strictEqual( client.send.mock.calls.length, 2 );
      strictEqual( constructorMock.mock.calls.length, 2 );
      deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
        RequestItems: {
          [tableName]: items.slice( 0, 25 ).map( item => ( { PutRequest: { Item: item } } ) )
        }
      } );
      deepStrictEqual( constructorMock.mock.calls[1].arguments[0], {
        RequestItems: {
          [tableName]: items.slice( 25 ).map( item => ( { PutRequest: { Item: item } } ) )
        }
      } );
    } );
  } );
} );
