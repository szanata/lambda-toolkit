const batchWrite = require( './batch_write' );
const { BatchWriteCommand } = require( '@aws-sdk/lib-dynamodb' );

jest.mock( '@aws-sdk/lib-dynamodb', () => ( {
  BatchWriteCommand: jest.fn()
} ) );

const tableName = 'cars';
const client = {
  send: jest.fn()
};

describe( 'Dynamo "batch write" (put/remove) Spec', () => {
  afterEach( () => {
    BatchWriteCommand.mockReset();
    client.send.mockReset();
  } );

  describe( 'Delete', () => {
    it( 'Should break into batches and send the delete commands', async () => {
      const items = Array( 30 ).fill().map( ( _, id ) => ( { id } ) );
      client.send.mockResolvedValue( { } );

      const result = await batchWrite( client, 'remove', tableName, items );

      expect( result ).toEqual( true );
      expect( client.send ).toHaveBeenCalledTimes( 2 );
      expect( BatchWriteCommand ).toHaveBeenCalledTimes( 2 );
      expect( BatchWriteCommand ).toHaveBeenNthCalledWith( 1, {
        RequestItems: {
          [tableName]: items.slice( 0, 25 ).map( key => ( { DeleteRequest: { Key: key } } ) )
        }
      } );
      expect( BatchWriteCommand ).toHaveBeenNthCalledWith( 2, {
        RequestItems: {
          [tableName]: items.slice( 25 ).map( key => ( { DeleteRequest: { Key: key } } ) )
        }
      } );
    } );

    it( 'Should handled unprocessed items and add them to the batches, recalculating it to 25', async () => {
      const items = Array( 48 ).fill().map( ( _, id ) => ( { id } ) );
      const rejections = [ items[0], items[1], items[24], items[25] ];

      // call 1
      client.send.mockImplementationOnce( async _ => ( {
        UnprocessedItems: {
          [tableName]: [
            { DeleteRequest: { Key: rejections[0] } },
            { DeleteRequest: { Key: rejections[1] } }
          ]
        }
      } ) );
      // call 2
      client.send.mockImplementationOnce( async _ => ( {
        UnprocessedItems: {
          [tableName]: [
            { DeleteRequest: { Key: rejections[2] } },
            { DeleteRequest: { Key: rejections[3] } }
          ]
        }
      } ) );
      // call 3
      client.send.mockImplementationOnce( async _ => ( {} ) );

      const result = await batchWrite( client, 'remove', tableName, items );

      expect( result ).toEqual( true );
      expect( client.send ).toHaveBeenCalledTimes( 3 );
      expect( BatchWriteCommand ).toHaveBeenCalledTimes( 3 );
      expect( BatchWriteCommand ).toHaveBeenNthCalledWith( 1, {
        RequestItems: {
          [tableName]: items.slice( 0, 25 ).map( key => ( { DeleteRequest: { Key: key } } ) )
        }
      } );
      expect( BatchWriteCommand ).toHaveBeenNthCalledWith( 2, {
        RequestItems: {
          [tableName]: items.slice( 25 ).concat( rejections[0], rejections[1] ).map( key => ( { DeleteRequest: { Key: key } } ) )
        }
      } );
      expect( BatchWriteCommand ).toHaveBeenNthCalledWith( 3, {
        RequestItems: {
          [tableName]: [ rejections[2], rejections[3] ].map( key => ( { DeleteRequest: { Key: key } } ) )
        }
      } );
    } );
  } );

  describe( 'Put', () => {
    it( 'Should break into batches and send the put commands', async () => {
      const items = Array( 30 ).fill().map( ( _, id ) => ( { id } ) );
      client.send.mockResolvedValue( { } );

      const result = await batchWrite( client, 'put', tableName, items );

      expect( result ).toEqual( true );
      expect( client.send ).toHaveBeenCalledTimes( 2 );
      expect( BatchWriteCommand ).toHaveBeenCalledTimes( 2 );
      expect( BatchWriteCommand ).toHaveBeenNthCalledWith( 1, {
        RequestItems: {
          [tableName]: items.slice( 0, 25 ).map( item => ( { PutRequest: { Item: item } } ) )
        }
      } );
      expect( BatchWriteCommand ).toHaveBeenNthCalledWith( 2, {
        RequestItems: {
          [tableName]: items.slice( 25 ).map( item => ( { PutRequest: { Item: item } } ) )
        }
      } );
    } );
  } );
} );
