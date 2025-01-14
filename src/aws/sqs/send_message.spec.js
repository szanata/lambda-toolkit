const sendMessage = require( './send_message' );
const { SendMessageCommand } = require( '@aws-sdk/client-sqs' );

jest.mock( '@aws-sdk/client-sqs', () => ( {
  SendMessageCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

const queue = 'sqs://mw.com';
const commandInstance = jest.fn();
const messageId = '123';

describe( 'SQS Send Message Spec', () => {
  afterEach( () => {
    client.send.mockReset();
    SendMessageCommand.mockReset();
  } );

  it( 'Should send a message to SQS an return its id', async () => {
    client.send.mockResolvedValue( { MessageId: messageId } );
    SendMessageCommand.mockReturnValue( commandInstance );
    const message = 'foo-bar';

    const result = await sendMessage( client, queue, message );

    expect( result ).toEqual( messageId );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
    expect( SendMessageCommand ).toHaveBeenCalledWith( {
      QueueUrl: queue,
      MessageBody: message
    } );
  } );

  it( 'Should accept more native arguments', async () => {
    client.send.mockResolvedValue( { MessageId: messageId } );
    SendMessageCommand.mockReturnValue( commandInstance );
    const message = 'foo-bar';

    const result = await sendMessage( client, queue, message, {
      DelaySeconds: 30,
      MessageGroupId: '123',
      MessageDeduplicationId: 'unique'
    } );

    expect( result ).toEqual( messageId );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
    expect( SendMessageCommand ).toHaveBeenCalledWith( {
      QueueUrl: queue,
      MessageBody: message,
      DelaySeconds: 30,
      MessageGroupId: '123',
      MessageDeduplicationId: 'unique'
    } );
  } );

  it( 'Should serialize to string if the body is an object', async () => {
    client.send.mockResolvedValue( { MessageId: messageId } );
    SendMessageCommand.mockReturnValue( commandInstance );
    const message = { foo: 'bar' };

    const result = await sendMessage( client, queue, message );

    expect( result ).toEqual( messageId );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
    expect( SendMessageCommand ).toHaveBeenCalledWith( {
      QueueUrl: queue,
      MessageBody: '{"foo":"bar"}'
    } );
  } );
} );
