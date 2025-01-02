const createClient = require( './create_client' );

const redis = {
  createClient: jest.fn()
};

const instance = {
  connect: jest.fn(),
  ping: jest.fn()
};
const address = 'foo.bar';

describe( 'Redis: Create Client Spec', () => {
  beforeEach( () => {
    redis.createClient.mockReturnValue( instance );
  } );

  afterEach( () => {
    redis.createClient.mockReset();
    instance.connect.mockReset();
    instance.ping.mockReset();
  } );

  it( 'Should create an instance using createClient from redis lib for the address, connect, cache and return it', async () => {
    global.__redisInstances = {};

    const result = await createClient( { redis, address } );

    expect( result ) .toEqual( instance );
    expect( redis.createClient ).toHaveBeenCalledWith( { url: 'rediss://foo.bar:6379', socket: { keepAlive: 15000 } } );
    expect( instance.connect ).toHaveBeenCalled();
    expect( global.__redisInstances[address] ).toEqual( instance );
  } );

  it( 'Should return the instance from cache if present and it is alive', async () => {
    global.__redisInstances = {
      [address]: instance
    };

    instance.ping.mockResolvedValue( 'PONG' );

    const result = await createClient( { redis, address } );

    expect( result ) .toEqual( instance );
    expect( redis.createClient ).not.toHaveBeenCalled();
  } );

  it( 'Should create a new instance if the one from cache is not alive anymore', async () => {
    global.__redisInstances = {
      [address]: instance
    };

    instance.ping.mockRejectedValue( new Error() );

    const result = await createClient( { redis, address } );

    expect( result ) .toEqual( instance );
    expect( redis.createClient ).toHaveBeenCalledWith( { url: 'rediss://foo.bar:6379', socket: { keepAlive: 15000 } } );
    expect( instance.connect ).toHaveBeenCalled();
    expect( global.__redisInstances[address] ).toEqual( instance );
  } );
} );
