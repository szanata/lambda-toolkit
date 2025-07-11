const publishBatch = require( './publish_batch' );
const { PublishBatchCommand } = require( '@aws-sdk/client-sns' );

jest.mock( '@aws-sdk/client-sns', () => ( {
  PublishBatchCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

const topic = 'sns://mw.com';
const commandInstance = jest.fn();

describe( 'SNS Publish Batch Spec', () => {
  afterEach( () => {
    client.send.mockReset();
    PublishBatchCommand.mockReset();
  } );

  it( 'Should publish a batch of messages to SNS', async () => {
    PublishBatchCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( { Successful: [], Failed: [] } );

    const result = await publishBatch( client, topic, [
      {
        body: {
          foo: 'bar'
        },
        nativeArgs: {
          MessageDeduplicationId: '123',
          MessageGroupId: '456'
        }
      },
      {
        id: 'id123',
        body: 'foo'
      }
    ] );

    expect( result ).toEqual( { Successful: [], Failed: [] } );
    expect( PublishBatchCommand ).toHaveBeenCalledWith( {
      TopicArn: topic,
      PublishBatchRequestEntries: [
        {
          Id: 'message_0',
          Message: '{"foo":"bar"}',
          MessageDeduplicationId: '123',
          MessageGroupId: '456'
        },
        {
          Id: 'id123',
          Message: 'foo'
        }
      ]
    } );
  } );
} );
