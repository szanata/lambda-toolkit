const { CopyObjectCommand } = require( '@aws-sdk/client-s3' );
const copy = require( './copy' );

jest.mock( '@aws-sdk/client-s3', () => ( {
  CopyObjectCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

const commandInstance = jest.fn();
const bucket = 'foo-bucket';
const key = 'foo-key.txt';
const source = 'bar-bucket/bar-key.txt';
const response = { Ok: true };

describe( 'S3 copy spec', () => {
  beforeEach( () => {
    CopyObjectCommand.mockReturnValue( commandInstance );
  } );

  afterEach( () => {
    client.send.mockReset();
    CopyObjectCommand.mockReset();
  } );

  it( 'Should copy a file from two s3 places', async () => {
    client.send.mockResolvedValue( response );

    const result = await copy( client, bucket, key, source, {
      ACL: 'Private'
    } );

    expect( result ).toBe( response );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
    expect( CopyObjectCommand ).toHaveBeenCalledWith( {
      ACL: 'Private',
      Bucket: bucket,
      CopySource: source,
      Key: key
    } );
  } );
} );
