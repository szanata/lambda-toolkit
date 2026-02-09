import { describe, it, mock, afterEach } from 'node:test';
import { deepStrictEqual } from 'node:assert';

const commandInstance = {};
const constructorMock = mock.fn( () => commandInstance );

mock.module( '@aws-sdk/client-sqs', {
  namedExports: {
    SendMessageBatchCommand: new Proxy( class SendMessageBatchCommand {}, {
      construct( _, args ) {
        return constructorMock( ...args );
      }
    } )
  }
} );

const { sendMessageBatch } = await import( './send_message_batch.js' );

const client = {
  send: mock.fn()
};

const queue = 'sqs://mw.com';

describe( 'SQS Send Message Batch Spec', () => {
  afterEach( () => {
    mock.restoreAll();
    client.send.mock.what();
    constructorMock.mock.mockReset();
  } );

  it( 'Should send an batch of messages to SQS', async () => {
    constructorMock.mock.mockImplementation( () => commandInstance );
    client.send.mock.mockImplementation( () => ( { Successful: [], Failed: [] } ) );

    const result = await sendMessageBatch( client, 'sqs://mw.com', [ {
      body: {
        foo: 'bar'
      },
      nativeArgs: {
        DelaySeconds: 30,
        MessageDeduplicationId: '123'
      }
    } ] );

    deepStrictEqual( result, { Successful: [], Failed: [] } );
    deepStrictEqual( constructorMock.mock.calls.length, 1 );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
      QueueUrl: queue,
      Entries: [ {
        Id: 'message_0',
        MessageBody: '{"foo":"bar"}',
        MessageDeduplicationId: '123',
        DelaySeconds: 30
      } ]
    } );
  } );
} );
