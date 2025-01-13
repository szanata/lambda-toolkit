const { HeadObjectCommand } = require( '@aws-sdk/client-s3' );
const head = require( './head' );

jest.mock( '@aws-sdk/client-s3', () => ( {
  HeadObjectCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

const bucket = 'bucket';
const key = 'key';
const commandInstance = jest.fn();
const response = {
  ContentType: 'application/json'
};

describe( 'S3 Head Spec', () => {
  beforeEach( () => {
    HeadObjectCommand.mockReturnValue( commandInstance );
  } );

  afterEach( () => {
    client.send.mockReset();
    HeadObjectCommand.mockReset();
  } );

  it( 'Should head a file from S3 and return its content', async () => {
    client.send.mockResolvedValue( response );

    const result = await head( client, bucket, key );

    expect( result ).toBe( response );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
    expect( HeadObjectCommand ).toHaveBeenCalledWith( { Key: key, Bucket: bucket } );
  } );
} );
