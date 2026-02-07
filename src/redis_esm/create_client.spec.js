import { createClient } from './create_client.js';
import { describe, it, mock, beforeEach, afterEach } from 'node:test';
import { deepStrictEqual, strictEqual } from 'node:assert';

const redis = {
  createClient: mock.fn()
};

const instance = {
  connect: mock.fn(),
  ping: mock.fn()
};

const address = 'foo.bar';

describe( 'Redis: Create Client Spec', () => {
  beforeEach( () => {
    redis.createClient.mock.mockImplementation( () => instance );
  } );

  afterEach( () => {
    mock.reset();
    redis.createClient.mock.resetCalls();
    instance.connect.mock.resetCalls();
    instance.ping.mock.resetCalls();
  } );

  it( 'Should create an instance using createClient from redis lib for the address, connect, cache and return it', async () => {
    global.__redisInstances = {};

    const result = await createClient( { redis, address } );

    deepStrictEqual( result, instance );
    strictEqual( redis.createClient.mock.calls.length, 1 );
    deepStrictEqual( redis.createClient.mock.calls[0].arguments[0], { url: 'rediss://foo.bar:6379', socket: { keepAlive: 15000 } } );
    strictEqual( instance.connect.mock.calls.length, 1 );
    deepStrictEqual( global.__redisInstances[address], instance );
  } );

  it( 'Should return the instance from cache if present and it is alive', async () => {
    global.__redisInstances = {
      [address]: instance
    };

    instance.ping.mock.mockImplementation( () => 'PONG' );

    const result = await createClient( { redis, address } );

    deepStrictEqual( result, instance );
    strictEqual( redis.createClient.mock.calls.length, 0 );
  } );

  it( 'Should create a new instance if the one from cache is not alive anymore', async () => {
    global.__redisInstances = {
      [address]: instance
    };

    instance.ping.mock.mockImplementation( () => { throw new Error(); } );

    const result = await createClient( { redis, address } );

    deepStrictEqual( result, instance );
    strictEqual( redis.createClient.mock.calls.length, 1 );
    deepStrictEqual( redis.createClient.mock.calls[0].arguments[0], { url: 'rediss://foo.bar:6379', socket: { keepAlive: 15000 } } );
    strictEqual( instance.connect.mock.calls.length, 1 );
    deepStrictEqual( global.__redisInstances[address], instance );
  } );
} );
