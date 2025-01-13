const { getSignedUrl } = require( '@aws-sdk/s3-request-presigner' );
const { GetObjectCommand } = require( '@aws-sdk/client-s3' );
const index = require( './get_signed_url' );

jest.mock( '@aws-sdk/client-s3', () => ( {
  GetObjectCommand: jest.fn()
} ) );
jest.mock( '@aws-sdk/s3-request-presigner', () => ( {
  getSignedUrl: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

const bucket = 'bucket';
const key = 'key';
const expiration = 360;
const commandInstance = jest.fn();
const response = 'htts://my-signed-url';

describe( 'S3 Get Signed Url Spec', () => {
  beforeEach( () => {
    GetObjectCommand.mockReturnValue( commandInstance );
  } );

  afterEach( () => {
    client.send.mockReset();
    GetObjectCommand.mockReset();
  } );

  it( 'Should getSignedUrl a file from S3 and return its content', async () => {
    getSignedUrl.mockResolvedValue( response );

    const result = await index( client, bucket, key, expiration );

    expect( result ).toBe( response );
    expect( GetObjectCommand ).toHaveBeenCalledWith( { Key: key, Bucket: bucket } );
    expect( getSignedUrl ).toHaveBeenCalledWith( client, commandInstance, { expiresIn: expiration } );
  } );
} );
