const { GetObjectCommand } = require( '@aws-sdk/client-s3' );
const download = require( './download' );

jest.mock( '@aws-sdk/client-s3', () => ( {
  GetObjectCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

const commandInstance = jest.fn();
const bucket = 'foo-bucket';
const key = 'foo/bar';

describe( 'S3 Download Spec', () => {
  beforeEach( () => {
    GetObjectCommand.mockReturnValue( commandInstance );
  } );

  afterEach( () => {
    client.send.mockReset();
    GetObjectCommand.mockReset();
  } );

  it( 'Should download a file from S3 and return its content', async () => {
    const content = 'Hi there';
    const httpIncommingMessageMock = {
      toArray: async () => [ Buffer.from( content ) ]
    };

    client.send.mockResolvedValue( { Body: httpIncommingMessageMock } );

    const result = await download( client, bucket, key, {
      ResponseContentEncoding: 'utf-8'
    } );

    expect( result ).toBe( content );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
    expect( GetObjectCommand ).toHaveBeenCalledWith( {
      ResponseContentEncoding: 'utf-8',
      Key: key,
      Bucket: bucket
    } );
  } );
} );
