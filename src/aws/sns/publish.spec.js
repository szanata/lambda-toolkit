const publish = require( './publish' );
const { PublishCommand } = require( '@aws-sdk/client-sns' );

jest.mock( '@aws-sdk/client-sns', () => ( {
  PublishCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

const topic = 'sns';
const commandInstance = jest.fn();
const messageId = '123';

describe( 'SNS Publish Spec', () => {
  afterEach( () => {
    client.send.mockReset();
    PublishCommand.mockReset();
  } );

  it( 'Should send a message to SQS an return its id', async () => {
    client.send.mockResolvedValue( { MessageId: messageId } );
    PublishCommand.mockReturnValue( commandInstance );
    const message = 'foo-bar';

    const result = await publish( client, topic, message );

    expect( result ).toEqual( messageId );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
    expect( PublishCommand ).toHaveBeenCalledWith( {
      TopicArn: topic,
      Message: message
    } );
  } );

  it( 'Should accept more native arguments', async () => {
    client.send.mockResolvedValue( { MessageId: messageId } );
    PublishCommand.mockReturnValue( commandInstance );
    const message = 'foo-bar';

    const result = await publish( client, topic, message, {
      DelaySeconds: 30
    } );

    expect( result ).toEqual( messageId );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
    expect( PublishCommand ).toHaveBeenCalledWith( {
      TopicArn: topic,
      Message: message,
      DelaySeconds: 30
    } );
  } );

  it( 'Should serialize to string if the body is an object', async () => {
    client.send.mockResolvedValue( { MessageId: messageId } );
    PublishCommand.mockReturnValue( commandInstance );
    const message = { foo: 'bar' };

    const result = await publish( client, topic, message );

    expect( result ).toEqual( messageId );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
    expect( PublishCommand ).toHaveBeenCalledWith( {
      TopicArn: topic,
      Message: '{"foo":"bar"}'
    } );
  } );
} );
