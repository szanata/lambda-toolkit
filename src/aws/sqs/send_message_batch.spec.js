const sendMessageBatch = require( './send_message_batch' );
const { SendMessageBatchCommand } = require( '@aws-sdk/client-sqs' );

jest.mock( '@aws-sdk/client-sqs', () => ( {
  SendMessageBatchCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

const queue = 'sqs://mw.com';
const commandInstance = jest.fn();

describe( 'SQS Send Message Batch Spec', () => {
  afterEach( () => {
    client.send.mockReset();
    SendMessageBatchCommand.mockReset();
  } );

  it( 'Should send an batch of messages to SQS', async () => {
    SendMessageBatchCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( { Successful: [], Failed: [] } );

    const result = await sendMessageBatch( client, 'sqs://mw.com', [ {
      MessageBody: { foo: 'bar' },
      DelaySeconds: 30
    } ] );

    expect( result ).toEqual( { Successful: [], Failed: [] } );
    expect( SendMessageBatchCommand ).toHaveBeenCalledWith( {
      QueueUrl: queue,
      Entries: [ {
        Id: 'message_0',
        MessageBody: '{"foo":"bar"}',
        DelaySeconds: 30
      } ]
    } );
  } );
} );
