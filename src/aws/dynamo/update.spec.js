import { describe, it, mock, afterEach } from 'node:test';
import { strictEqual, deepStrictEqual, rejects } from 'node:assert';

const commandInstance = {};
const constructorMock = mock.fn( () => commandInstance );

mock.module( '@aws-sdk/lib-dynamodb', {
  namedExports: {
    UpdateCommand: new Proxy( class UpdateCommand {}, {
      construct( _, args ) {
        return constructorMock( ...args );
      }
    } )
  }
} );

const { update } = await import( './update.js' );

const client = {
  send: mock.fn()
};

const tableName = 'table';
const args = {
  TableName: tableName,
  UpdateExpression: 'SET #foo = :bar',
  ExpressionAttributeNames: {
    '#foo': 'foo'
  },
  ExpressionAttributeValues: {
    ':bar': 'bar'
  }
};

describe( 'Update Spec', () => {
  afterEach( () => {
    mock.restoreAll();
    client.send.mock.resetCalls();
    constructorMock.mock.resetCalls();
  } );

  it( 'Should return the update element (ALL_NEW) if the config is not overwrite', async () => {
    const updatedItem = {
      id: '123',
      foo: 'bar'
    };
    client.send.mock.mockImplementation( () => ( { Attributes: updatedItem } ) );
    const result = await update( client, args );

    deepStrictEqual( result, updatedItem );
    strictEqual( client.send.mock.calls.length, 1 );
    deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], Object.assign( { ReturnValues: 'ALL_NEW' }, args ) );
  } );

  it( 'Should return nothing if there are no attributes in the response', async () => {
    client.send.mock.mockImplementation( () => ( {} ) );
    const noReturnArgs = Object.assign( { ReturnValues: 'NONE' }, args );
    const result = await update( client, noReturnArgs );

    strictEqual( result, undefined );
    strictEqual( client.send.mock.calls.length, 1 );
    deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], noReturnArgs );
  } );

  it( 'Should throw errros', async () => {
    class ConditionalCheckFailedException extends Error {
      constructor() {
        super();
        this.name = 'ConditionalCheckFailedException';
      }
    }
    const error = new ConditionalCheckFailedException();
    client.send.mock.mockImplementation( () => { throw error; } );

    await rejects( update( client, args ), error );

    strictEqual( client.send.mock.calls.length, 1 );
    deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
  } );
} );
