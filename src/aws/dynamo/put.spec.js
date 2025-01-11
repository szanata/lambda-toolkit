const { PutCommand } = require( '@aws-sdk/lib-dynamodb' );
const put = require( './put' );

jest.mock( '@aws-sdk/lib-dynamodb', () => ( {
  PutCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

const tableName = 'table';
const item = { id: '123', value: 'foo' };

describe( 'Put Spec', () => {
  afterEach( () => {
    client.send.mockReset();
    PutCommand.mockReset();
  } );

  describe( 'Sugar mode', () => {
    it( 'Should put an item', async () => {
      client.send.mockResolvedValue( {
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
      } );

      const result = await put( client, tableName, item );

      expect( result ).toEqual( item );
      expect( PutCommand ).toHaveBeenCalledWith( {
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

      client.send.mockResolvedValue( {
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
      } );
      const result = await put( client, { TableName: tableName, Item: item, ReturnValues: 'ALL_OLD' } );

      expect( result ).toEqual( oldDbItem );
      expect( PutCommand ).toHaveBeenCalledWith( { TableName: tableName, Item: item, ReturnValues: 'ALL_OLD' } );
    } );
  } );
} );
