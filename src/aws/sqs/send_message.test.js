import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';

const commandInstance = {};
const constructorMock = mock.fn( () => commandInstance );

mock.module( '@aws-sdk/client-sqs', {
  namedExports: {
    SendMessageCommand: new Proxy( class SendMessageCommand {}, {
      construct( _, args ) {
        return constructorMock( ...args );
      }
    } )
  }
} );

const { sendMessage } = await import( './send_message.js' );

const client = {
  send: mock.fn()
};

const queue = 'sqs://mw.com';
const messageId = '123';

describe( 'SQS Send Message Spec', () => {
  beforeEach( () => {
    client.send.mock.mockImplementation( () => ( { MessageId: messageId } ) );
    constructorMock.mock.mockImplementation( () => commandInstance );
  } );

  afterEach( () => {
    mock.restoreAll();
    client.send.mock.resetCalls();
    constructorMock.mock.resetCalls();
  } );

  it( 'Should send a message to SQS an return its id', async () => {
    const message = 'foo-bar';

    const result = await sendMessage( client, queue, message );

    strictEqual( result, messageId );
    strictEqual( client.send.mock.calls.length, 1 );
    strictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
      QueueUrl: queue,
      MessageBody: message
    } );
  } );

  it( 'Should accept more native arguments', async () => {
    const message = 'foo-bar';

    const result = await sendMessage( client, queue, message, {
      DelaySeconds: 30,
      MessageGroupId: '123',
      MessageDeduplicationId: 'unique'
    } );

    strictEqual( result, messageId );
    strictEqual( client.send.mock.calls.length, 1 );
    strictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
      QueueUrl: queue,
      MessageBody: message,
      DelaySeconds: 30,
      MessageGroupId: '123',
      MessageDeduplicationId: 'unique'
    } );
  } );

  it( 'Should serialize to string if the body is an object', async () => {
    const message = { foo: 'bar' };

    const result = await sendMessage( client, queue, message );

    strictEqual( result, messageId );
    strictEqual( client.send.mock.calls.length, 1 );
    strictEqual( client.send.mock.calls[0].arguments[0], commandInstance );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
      QueueUrl: queue,
      MessageBody: '{"foo":"bar"}'
    } );
  } );
} );
