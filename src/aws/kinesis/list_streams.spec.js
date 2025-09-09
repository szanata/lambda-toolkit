const { ListStreamsCommand } = require( '@aws-sdk/client-kinesis' );
const listStreams = require( './list_streams' );

jest.mock( '@aws-sdk/client-kinesis', () => ( {
  ListStreamsCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

const commandInstance = jest.fn();

describe( 'Kinesis ListStreams Spec', () => {
  afterEach( () => {
    client.send.mockReset();
    ListStreamsCommand.mockReset();
  } );

  it( 'Should list all streams', async () => {
    const mockResponse = {
      StreamNames: [
        'stream-1',
        'stream-2',
        'stream-3'
      ],
      HasMoreStreams: false
    };
    ListStreamsCommand.mockReturnValue( commandInstance );
    client.send.mockResolvedValue( mockResponse );

    const result = await listStreams( client );

    expect( result ).toBe( mockResponse );
    expect( ListStreamsCommand ).toHaveBeenCalledWith( {
      exclusiveStartStreamName: null,
      limit: null,
      nextToken: null
    } );
    expect( client.send ).toHaveBeenCalledWith( commandInstance );
  } );

  describe( 'Pagination for limits > 100', () => {
    it( 'Should paginate when limit is 150', async () => {
      const firstBatch = {
        StreamNames: Array.from( { length: 100 }, ( _, i ) => `stream-${i + 1}` ),
        HasMoreStreams: true,
        NextToken: 'next-token-1'
      };
      const secondBatch = {
        StreamNames: Array.from( { length: 50 }, ( _, i ) => `stream-${i + 101}` ),
        HasMoreStreams: false
      };

      ListStreamsCommand.mockReturnValue( commandInstance );
      client.send
        .mockResolvedValueOnce( firstBatch )
        .mockResolvedValueOnce( secondBatch );

      const result = await listStreams( client, { limit: 150 } );

      expect( result.StreamNames ).toHaveLength( 150 );
      expect( result.StreamNames[0] ).toBe( 'stream-1' );
      expect( result.StreamNames[149] ).toBe( 'stream-150' );
      expect( result.HasMoreStreams ).toBe( false );
      expect( client.send ).toHaveBeenCalledTimes( 2 );
      expect( ListStreamsCommand ).toHaveBeenNthCalledWith( 1, { Limit: 100 } );
      expect( ListStreamsCommand ).toHaveBeenNthCalledWith( 2, { Limit: 50, NextToken: 'next-token-1' } );
    } );

    it( 'Should paginate when limit is 250 (exact multiple of 100)', async () => {
      const firstBatch = {
        StreamNames: Array.from( { length: 100 }, ( _, i ) => `stream-${i + 1}` ),
        HasMoreStreams: true,
        NextToken: 'next-token-1'
      };
      const secondBatch = {
        StreamNames: Array.from( { length: 100 }, ( _, i ) => `stream-${i + 101}` ),
        HasMoreStreams: true,
        NextToken: 'next-token-2'
      };
      const thirdBatch = {
        StreamNames: Array.from( { length: 50 }, ( _, i ) => `stream-${i + 201}` ),
        HasMoreStreams: false
      };

      ListStreamsCommand.mockReturnValue( commandInstance );
      client.send
        .mockResolvedValueOnce( firstBatch )
        .mockResolvedValueOnce( secondBatch )
        .mockResolvedValueOnce( thirdBatch );

      const result = await listStreams( client, { limit: 250 } );

      expect( result.StreamNames ).toHaveLength( 250 );
      expect( result.StreamNames[0] ).toBe( 'stream-1' );
      expect( result.StreamNames[249] ).toBe( 'stream-250' );
      expect( result.HasMoreStreams ).toBe( false );
      expect( client.send ).toHaveBeenCalledTimes( 3 );
    } );

    it( 'Should stop pagination when fewer streams returned than requested', async () => {
      const firstBatch = {
        StreamNames: Array.from( { length: 100 }, ( _, i ) => `stream-${i + 1}` ),
        HasMoreStreams: true,
        NextToken: 'next-token-1'
      };
      const secondBatch = {
        StreamNames: Array.from( { length: 30 }, ( _, i ) => `stream-${i + 101}` ),
        HasMoreStreams: true
      };

      ListStreamsCommand.mockReturnValue( commandInstance );
      client.send
        .mockResolvedValueOnce( firstBatch )
        .mockResolvedValueOnce( secondBatch );

      const result = await listStreams( client, { limit: 200 } );

      expect( result.StreamNames ).toHaveLength( 130 );
      expect( result.StreamNames[0] ).toBe( 'stream-1' );
      expect( result.StreamNames[129] ).toBe( 'stream-130' );
      expect( result.HasMoreStreams ).toBe( false );
      expect( client.send ).toHaveBeenCalledTimes( 2 );
    } );

    it( 'Should respect limit when more streams available than requested', async () => {
      const firstBatch = {
        StreamNames: Array.from( { length: 100 }, ( _, i ) => `stream-${i + 1}` ),
        HasMoreStreams: true,
        NextToken: 'next-token-1'
      };
      const secondBatch = {
        StreamNames: Array.from( { length: 100 }, ( _, i ) => `stream-${i + 101}` ),
        HasMoreStreams: true,
        NextToken: 'next-token-2'
      };

      ListStreamsCommand.mockReturnValue( commandInstance );
      client.send
        .mockResolvedValueOnce( firstBatch )
        .mockResolvedValueOnce( secondBatch );

      const result = await listStreams( client, { limit: 150 } );

      expect( result.StreamNames ).toHaveLength( 150 );
      expect( result.StreamNames[0] ).toBe( 'stream-1' );
      expect( result.StreamNames[149] ).toBe( 'stream-150' );
      expect( result.HasMoreStreams ).toBe( true );
      expect( result.NextToken ).toBe( 'next-token-2' );
      expect( client.send ).toHaveBeenCalledTimes( 2 );
    } );

    it( 'Should handle pagination with exclusiveStartStreamName', async () => {
      const firstBatch = {
        StreamNames: Array.from( { length: 100 }, ( _, i ) => `test-stream-${i + 1}` ),
        HasMoreStreams: true,
        NextToken: 'next-token-1'
      };
      const secondBatch = {
        StreamNames: Array.from( { length: 50 }, ( _, i ) => `test-stream-${i + 101}` ),
        HasMoreStreams: false
      };

      ListStreamsCommand.mockReturnValue( commandInstance );
      client.send
        .mockResolvedValueOnce( firstBatch )
        .mockResolvedValueOnce( secondBatch );

      const options = {
        limit: 150,
        exclusiveStartStreamName: 'test-stream-1'
      };

      const result = await listStreams( client, options );

      expect( result.StreamNames ).toHaveLength( 150 );
      expect( client.send ).toHaveBeenCalledTimes( 2 );
      expect( ListStreamsCommand ).toHaveBeenNthCalledWith( 1, {
        Limit: 100,
        ExclusiveStartStreamName: 'test-stream-1'
      } );
      expect( ListStreamsCommand ).toHaveBeenNthCalledWith( 2, {
        Limit: 50,
        NextToken: 'next-token-1',
        ExclusiveStartStreamName: 'test-stream-1'
      } );
    } );
  } );
} );
