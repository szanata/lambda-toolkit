const cacheStorage = require( '../core/cache_storage' );
const get = require( './get' );
const { GetParameterCommand } = require( '@aws-sdk/client-ssm' );

jest.mock( '@aws-sdk/client-ssm', () => ( {
  GetParameterCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

jest.mock( '../core/cache_storage', () => ( {
  get: jest.fn(),
  set: jest.fn()
} ) );

const name = 'key';
const value = 'value';
const cacheKey = 'SSM_key';
const commandInstance = jest.fn();

describe( 'SSM Get Spec', () => {
  beforeEach( () => {
    GetParameterCommand.mockReturnValue( commandInstance );
  } );

  afterEach( () => {
    expect( cacheStorage.get ).toHaveBeenCalledWith( cacheKey );
    client.send.mockReset();
    cacheStorage.set.mockReset();
    cacheStorage.get.mockReset();
    GetParameterCommand.mockReset();
  } );

  it( 'Should get a parameter from storage and return it, storing to cache', async () => {
    client.send.mockResolvedValue( { Parameter: { Value: value } } );

    const result = await get( client, name );

    expect( result ).toBe( value );
    expect( GetParameterCommand ).toHaveBeenCalledWith( { Name: name, WithDecryption: true } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
    expect( cacheStorage.set ).toHaveBeenCalledWith( cacheKey, value );
  } );

  it( 'Should return from cache if it is there', async () => {
    cacheStorage.get.mockReturnValue( value );

    const result = await get( client, name );

    expect( result ).toBe( value );
    expect( client.send ).not.toHaveBeenCalled();
    expect( GetParameterCommand ).not.toHaveBeenCalled();
  } );

  it( 'Should return null on parameter not found', async () => {
    class ParameterNotFound extends Error {
      constructor() {
        super( 'UnknownError' );
        this.name = 'ParameterNotFound';
      }
    }

    const error = new ParameterNotFound();
    client.send.mockRejectedValue( error );

    const result = await get( client, name );

    expect( result ).toBe( null );
    expect( GetParameterCommand ).toHaveBeenCalledWith( { Name: name, WithDecryption: true } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
    expect( cacheStorage.set ).not.toHaveBeenCalled();
  } );

  it( 'Should throw other errors', async () => {
    const error = new Error();
    client.send.mockRejectedValue( error );

    await expect( get( client, name ) ).rejects.toThrow( error );

    expect( GetParameterCommand ).toHaveBeenCalledWith( { Name: name, WithDecryption: true } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
    expect( cacheStorage.set ).not.toHaveBeenCalled();
  } );
} );
