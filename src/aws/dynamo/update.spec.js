const { UpdateCommand } = require( '@aws-sdk/lib-dynamodb' );
const update = require( './update' );

jest.mock( '@aws-sdk/lib-dynamodb', () => ( {
  UpdateCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
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
    client.send.mockReset();
    UpdateCommand.mockReset();
  } );

  it( 'Should return the update element (ALL_NEW) if the config is not overwrite', async () => {
    const updatedItem = {
      id: '123',
      foo: 'bar'
    };
    client.send.mockResolvedValue( { Attributes: updatedItem } );
    const result = await update( client, args );

    expect( result ).toEqual( updatedItem );
    expect( UpdateCommand ).toHaveBeenCalledWith( Object.assign( { ReturnValues: 'ALL_NEW' }, args ) );
  } );

  it( 'Should return nothing if there are no attributes in the response', async () => {
    client.send.mockResolvedValue( {} );
    const noReturnArgs = Object.assign( { ReturnValues: 'NONE' }, args );
    const result = await update( client, noReturnArgs );

    expect( result ).toEqual( undefined );
    expect( UpdateCommand ).toHaveBeenCalledWith( noReturnArgs );
  } );

  it( 'Should throw errros', async () => {
    class ConditionalCheckFailedException extends Error {
      constructor() {
        super();
        this.name = 'ConditionalCheckFailedException';
      }
    }
    const error = new ConditionalCheckFailedException();
    client.send.mockRejectedValue( error );

    await expect( update( client, args ) ).rejects.toThrow( error );

    expect( client.send ).toHaveBeenCalled();
  } );
} );
