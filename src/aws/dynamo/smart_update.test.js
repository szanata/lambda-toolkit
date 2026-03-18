import { describe, it, mock, afterEach } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';

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

const { smartUpdate } = await import( './smart_update.js' );

const client = {
  send: mock.fn()
};

const tableName = 'table';
const key = { id: '123' };

describe( 'Smart Update Spec', () => {
  afterEach( () => {
    mock.restoreAll();
    client.send.mock.resetCalls();
    constructorMock.mock.resetCalls();
  } );

  it( 'Should return null if the object does not exists in the database', async () => {
    class ConditionalCheckFailedException extends Error {
      constructor() {
        super();
        this.name = 'ConditionalCheckFailedException';
      }
    }
    const error = new ConditionalCheckFailedException();
    client.send.mock.mockImplementation( () => { throw error; } );

    const result = await smartUpdate( client, tableName, key, { foo: 'bar' } );

    strictEqual( result, null );
    strictEqual( client.send.mock.calls.length, 1 );
    deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
  } );

  it( 'Should just return null if there are no updates', async () => {
    const result = await smartUpdate( client, tableName, key, {} );

    strictEqual( result, null );
    strictEqual( client.send.mock.calls.length, 0 );
  } );

  it( 'Should process nested paths and create an update expression with no repeating attr names', async () => {
    const updateResponse = { Attributes: { id: '123' } };
    client.send.mock.mockImplementation( () => updateResponse );

    constructorMock.mock.mockImplementation( () => commandInstance );

    const result = await smartUpdate( client, tableName, key, {
      'settings.general.color': 'red',
      'settings.general.size': 'L',
      'settings.state.active': false,
      version: 1
    } );

    deepStrictEqual( result, updateResponse.Attributes );
    strictEqual( client.send.mock.calls.length, 1 );
    deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
      TableName: tableName,
      ReturnValues: 'ALL_NEW',
      Key: key,
      ConditionExpression: 'attribute_exists(#key_id)',
      UpdateExpression: 'SET #settings0.#general1.#color2 = :v0, \
#settings0.#general1.#size2 = :v1, #settings0.#state1.#active2 = :v2, #version0 = :v3',
      ExpressionAttributeNames: {
        '#key_id': 'id',
        '#settings0': 'settings',
        '#general1': 'general',
        '#color2': 'color',
        '#size2': 'size',
        '#state1': 'state',
        '#active2': 'active',
        '#version0': 'version'
      },
      ExpressionAttributeValues: {
        ':v0': 'red',
        ':v1': 'L',
        ':v2': false,
        ':v3': 1
      }
    } );
  } );

  it( 'Should process paths inside arrays and create an update expression with no repeating attr names', async () => {
    const updateResponse = { Attributes: { id: '123' } };
    client.send.mock.mockImplementation( () => updateResponse );

    const result = await smartUpdate( client, tableName, key, {
      'settings[0].general.color': 'red',
      'settings[0].general.size': 'L'
    } );

    deepStrictEqual( result, updateResponse.Attributes );
    strictEqual( client.send.mock.calls.length, 1 );
    deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
      TableName: tableName,
      ReturnValues: 'ALL_NEW',
      Key: key,
      ConditionExpression: 'attribute_exists(#key_id)',
      UpdateExpression: 'SET #settings0[0].#general1.#color2 = :v0, #settings0[0].#general1.#size2 = :v1',
      ExpressionAttributeNames: {
        '#key_id': 'id',
        '#settings0': 'settings',
        '#general1': 'general',
        '#color2': 'color',
        '#size2': 'size'
      },
      ExpressionAttributeValues: {
        ':v0': 'red',
        ':v1': 'L'
      }
    } );
  } );

  it( 'Should remove attributes from the DB if the value is undefined', async () => {
    const updateResponse = { Attributes: { id: '123' } };
    client.send.mock.mockImplementation( () => updateResponse );

    const result = await smartUpdate( client, tableName, key, { temp_flag: undefined } );

    deepStrictEqual( result, updateResponse.Attributes );
    strictEqual( client.send.mock.calls.length, 1 );
    deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
      TableName: tableName,
      ReturnValues: 'ALL_NEW',
      Key: key,
      ConditionExpression: 'attribute_exists(#key_id)',
      UpdateExpression: 'REMOVE #temp_flag0',
      ExpressionAttributeNames: {
        '#key_id': 'id',
        '#temp_flag0': 'temp_flag'
      }
    } );
  } );

  it( 'Should remove and set attributes', async () => {
    const updateResponse = { Attributes: { id: '123' } };
    client.send.mock.mockImplementation( () => updateResponse );

    const result = await smartUpdate( client, tableName, key, {
      type: 'major',
      temp_flag: undefined,
      'settings.color': 'red'
    } );

    deepStrictEqual( result, updateResponse.Attributes );
    strictEqual( client.send.mock.calls.length, 1 );
    deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
      TableName: tableName,
      ReturnValues: 'ALL_NEW',
      Key: key,
      ConditionExpression: 'attribute_exists(#key_id)',
      UpdateExpression: 'SET #type0 = :v0, #settings0.#color1 = :v2 REMOVE #temp_flag0',
      ExpressionAttributeNames: {
        '#key_id': 'id',
        '#type0': 'type',
        '#settings0': 'settings',
        '#color1': 'color',
        '#temp_flag0': 'temp_flag'
      },
      ExpressionAttributeValues: {
        ':v0': 'major',
        ':v2': 'red'
      }
    } );
  } );

  it( 'Should process updates for tables with composite keys', async () => {
    const updateResponse = { Attributes: { id: '123' } };
    client.send.mock.mockImplementation( () => updateResponse );

    constructorMock.mock.mockImplementation( () => commandInstance );

    const key = {
      hashKey: 'hash',
      rangeKey: 'range'
    };
    const result = await smartUpdate( client, tableName, key, {
      foo: 'bar'
    } );

    deepStrictEqual( result, updateResponse.Attributes );
    strictEqual( client.send.mock.calls.length, 1 );
    deepStrictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
      TableName: tableName,
      ReturnValues: 'ALL_NEW',
      Key: key,
      ConditionExpression: 'attribute_exists(#key_hashKey) AND attribute_exists(#key_rangeKey)',
      UpdateExpression: 'SET #foo0 = :v0',
      ExpressionAttributeNames: {
        '#key_hashKey': 'hashKey',
        '#key_rangeKey': 'rangeKey',
        '#foo0': 'foo'
      },
      ExpressionAttributeValues: {
        ':v0': 'bar'
      }
    } );
  } );
} );
