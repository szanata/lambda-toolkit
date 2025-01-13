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
const content = 'Hi Mark';
const contentType = 'image/jpeg';
const commandInstance = jest.fn();

describe( 'S3 Upload Spec', () => {
  it( 'Should pout a file to S3', async () => {
    PutObjectCommand.mockReturnValue( commandInstance );

    await upload( client, bucket, key, content, { ContentType: contentType } );

    expect( PutObjectCommand ).toHaveBeenCalledWith( { ContentType: contentType, Key: key, Bucket: bucket, Body: content } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );
} );
