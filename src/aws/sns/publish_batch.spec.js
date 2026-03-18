import { describe, it, mock, afterEach } from 'node:test';
import { deepStrictEqual } from 'node:assert';

const commandInstance = {};
const constructorMock = mock.fn( () => commandInstance );

mock.module( '@aws-sdk/client-sns', {
  namedExports: {
    PublishBatchCommand: new Proxy( class PublishBatchCommand {}, {
      construct( _, args ) {
        return constructorMock( ...args );
      }
    } )
  }
} );

const { publishBatch } = await import( './publish_batch.js' );

const client = {
  send: mock.fn()
};

const topic = 'sns://mw.com';

describe( 'SNS Publish Batch Spec', () => {
  afterEach( () => {
    mock.restoreAll();
    client.send.mock.resetCalls();
    constructorMock.mock.resetCalls();
  } );

  it( 'Should publish a batch of messages to SNS', async () => {
    constructorMock.mock.mockImplementation( () => commandInstance );
    client.send.mock.mockImplementation( () => ( { Successful: [], Failed: [] } ) );

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

    deepStrictEqual( result, { Successful: [], Failed: [] } );
    deepStrictEqual( constructorMock.mock.calls[0].arguments[0], {
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
