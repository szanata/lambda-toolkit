const { GetCommand } = require( '@aws-sdk/lib-dynamodb' );
const get = require( './get' );

jest.mock( '@aws-sdk/lib-dynamodb', () => ( {
  GetCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

const tableName = 'table';
const key = { id: '123' };
const item = { id: '123', value: 'foo' };

describe( 'Dynamo Get Spec', () => {
  afterEach( () => {
    client.send.mockReset();
    GetCommand.mockReset();
  } );

  describe( 'Sugar mode', () => {
    it( 'Should get an item', async () => {
      client.send.mockResolvedValue( { Item: item } );

      const result = await get( client, tableName, key );

      expect( result ).toEqual( item );
      expect( GetCommand ).toHaveBeenCalledWith( {
        TableName: tableName,
        Key: key
      } );
    } );
  } );

  describe( 'Native mode', () => {
    it( 'Should get an item', async () => {
      client.send.mockResolvedValue( { Item: item } );

      const result = await get( client, { TableName: tableName, Key: item, ConsistentRead: true } );

      expect( result ).toEqual( item );
      expect( GetCommand ).toHaveBeenCalledWith( {
        TableName: tableName,
        Key: item,
        ConsistentRead: true 
      } );
    } );
  } );
} );
