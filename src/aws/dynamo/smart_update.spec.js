const smartUpdate = require( './smart_update' );
const { UpdateCommand } = require( '@aws-sdk/lib-dynamodb' );

jest.mock( '@aws-sdk/lib-dynamodb', () => ( {
  UpdateCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

const tableName = 'table';
const key = { id: '123' };
const command = {};

describe( 'Smart Update Spec', () => {
  afterEach( () => {
    client.send.mockReset();
    UpdateCommand.mockReset();
  } );

  it( 'Should return null if the object does not exists in the database', async () => {
    class ConditionalCheckFailedException extends Error {
      constructor() {
        super();
        this.name = 'ConditionalCheckFailedException';
      }
    }
    const error = new ConditionalCheckFailedException();
    client.send.mockRejectedValue( error );

    const result = await smartUpdate( client, tableName, key, { foo: 'bar' } );

    expect( result ).toEqual( null );
    expect( client.send ).toHaveBeenCalled();
  } );

  it( 'Should just return null if there are no updates', async () => {
    const result = await smartUpdate( client, tableName, key, {} );

    expect( result ).toEqual( null );
    expect( client.send ).not.toHaveBeenCalled();
  } );

  it( 'Should process nested paths and create an update expression with no repeating attr names', async () => {
    const updateResponse = { Attributes: { id: '123' } };
    client.send.mockResolvedValue( updateResponse );

    UpdateCommand.mockReturnValue( command );

    const result = await smartUpdate( client, tableName, key, {
      'settings.general.color': 'red',
      'settings.general.size': 'L',
      'settings.state.active': false,
      version: 1
    } );

    expect( result ).toEqual( updateResponse.Attributes );
    expect( client.send ).toHaveBeenCalledWith( command );
    expect( UpdateCommand ).toHaveBeenCalledWith( {
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
    client.send.mockResolvedValue( updateResponse );

    const result = await smartUpdate( client, tableName, key, {
      'settings[0].general.color': 'red',
      'settings[0].general.size': 'L'
    } );

    expect( result ).toEqual( updateResponse.Attributes );
    expect( client.send ).toHaveBeenCalledWith( new UpdateCommand( {
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
    } ) );
  } );

  it( 'Should remove attributes from the DB if the value is undefined', async () => {
    const updateResponse = { Attributes: { id: '123' } };
    client.send.mockResolvedValue( updateResponse );

    const result = await smartUpdate( client, tableName, key, { temp_flag: undefined } );

    expect( result ).toEqual( updateResponse.Attributes );
    expect( client.send ).toHaveBeenCalledWith( new UpdateCommand( {
      TableName: tableName,
      ReturnValues: 'ALL_NEW',
      Key: key,
      ConditionExpression: 'attribute_exists(#key_id)',
      UpdateExpression: 'REMOVE #temp_flag0',
      ExpressionAttributeNames: {
        '#key_id': 'id',
        '#temp_flag0': 'temp_flag'
      }
    } ) );
  } );

  it( 'Should remove and set attributes', async () => {
    const updateResponse = { Attributes: { id: '123' } };
    client.send.mockResolvedValue( updateResponse );

    const result = await smartUpdate( client, tableName, key, {
      type: 'major',
      temp_flag: undefined,
      'settings.color': 'red'
    } );

    expect( result ).toEqual( updateResponse.Attributes );
    expect( client.send ).toHaveBeenCalledWith( new UpdateCommand( {
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
    } ) );
  } );

  it( 'Should process updates for tables with composite keys', async () => {
    const updateResponse = { Attributes: { id: '123' } };
    client.send.mockResolvedValue( updateResponse );

    UpdateCommand.mockReturnValue( command );

    const key = {
      hashKey: 'hash',
      rangeKey: 'range'
    };
    const result = await smartUpdate( client, tableName, key, {
      foo: 'bar'
    } );

    expect( result ).toEqual( updateResponse.Attributes );
    expect( client.send ).toHaveBeenCalledWith( command );
    expect( UpdateCommand ).toHaveBeenCalledWith( {
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
