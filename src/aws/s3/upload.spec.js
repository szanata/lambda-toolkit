const upload = require( './upload' );
const { PutObjectCommand } = require( '@aws-sdk/client-s3' );

jest.mock( '@aws-sdk/client-s3', () => ( {
  PutObjectCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

const bucket = 'foo-bucket';
const key = 'foo/bar';
const stringContent = 'Hi Mark';
const bufferContent = Buffer.alloc( 1 );
const objectContent = { foo: 'bar' };
const contentType = 'image/jpeg';
const commandInstance = jest.fn();

describe( 'S3 Upload Spec', () => {
  it( 'Should put a string on S3', async () => {
    PutObjectCommand.mockReturnValue( commandInstance );

    await upload( client, bucket, key, stringContent, { ContentType: contentType } );

    expect( PutObjectCommand )
      .toHaveBeenCalledWith( { ContentType: contentType, Key: key, Bucket: bucket, Body: stringContent } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should put a buffer on S3', async () => {
    PutObjectCommand.mockReturnValue( commandInstance );

    await upload( client, bucket, key, bufferContent, { ContentType: contentType } );

    expect( PutObjectCommand )
      .toHaveBeenCalledWith( { ContentType: contentType, Key: key, Bucket: bucket, Body: bufferContent } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  it( 'Should put an object on S3', async () => {
    PutObjectCommand.mockReturnValue( commandInstance );

    await upload( client, bucket, key, objectContent, { ContentType: contentType } );

    expect( PutObjectCommand )
      .toHaveBeenCalledWith( { ContentType: contentType, Key: key, Bucket: bucket, Body: JSON.stringify( objectContent ) } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );
} );
