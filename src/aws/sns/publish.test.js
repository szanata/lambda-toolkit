import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';

const commandInstance = {};
const constructorMock = mock.fn( () => commandInstance );

mock.module( '@aws-sdk/client-sns', {
  namedExports: {
    PublishCommand: new Proxy( class PublishCommand {}, {
      construct( _, args ) {
        return constructorMock( ...args );
      }
    } )
  }
} );

const { publish } = await import( './publish.js' );

const client = {
  send: mock.fn()
};

const topic = 'sns';
const messageId = '123';

describe( 'SNS Publish Spec', () => {
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

    const result = await publish( client, topic, message );

    strictEqual( result, messageId );
    strictEqual( client.send.mock.calls.length, 1 );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
      TopicArn: topic,
      Message: message
    } );
  } );

  it( 'Should accept more native arguments', async () => {
    const message = 'foo-bar';

    const result = await publish( client, topic, message, {
      DelaySeconds: 30
    } );

    strictEqual( result, messageId );
    strictEqual( client.send.mock.calls.length, 1 );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
      TopicArn: topic,
      Message: message,
      DelaySeconds: 30
    } );
  } );

  it( 'Should serialize to string if the body is an object', async () => {
    const message = { foo: 'bar' };

    const result = await publish( client, topic, message );

    strictEqual( result, messageId );
    strictEqual( client.send.mock.calls.length, 1 );
    strictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
      TopicArn: topic,
      Message: '{"foo":"bar"}'
    } );
  } );
} );
