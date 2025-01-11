const select = require( './select' );
const { randomBytes } = require( 'crypto' );
const { ScanCommand, QueryCommand } = require( '@aws-sdk/lib-dynamodb' );
const { encode } = require( '../core/encoder' );

jest.mock( '@aws-sdk/lib-dynamodb', () => ( {
  ScanCommand: jest.fn(),
  QueryCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

const makeItems = count => Array( count ).fill().map( () => ( { id: randomBytes( 4 ).toString( 'hex' ) } ) );

describe( 'Dynamo "select" (query/scan) Spec', () => {
  afterEach( () => {
    client.send.mockReset();
    ScanCommand.mockReset();
    QueryCommand.mockReset();
  } );

  describe( 'Recursive', () => {
    it( 'Should recursivelly query the database until it cannot paginate anymore', async () => {
      const pages = [ makeItems( 5 ), makeItems( 5 ), makeItems( 3 ) ];
      const args = {
        TableName: 'foo-bar'
      };
      const paginationKey = { id: '5' };
      const paginationKey2 = { id: '10' };

      // calls 1 to 3
      client.send.mockImplementationOnce( async _ => ( { Items: pages[0], Count: pages[0].length, LastEvaluatedKey: paginationKey } ) );
      client.send.mockImplementationOnce( async _ => ( { Items: pages[1], Count: pages[1].length, LastEvaluatedKey: paginationKey2 } ) );
      client.send.mockImplementationOnce( async _ => ( { Items: pages[2], Count: pages[2].length, LastEvaluatedKey: null } ) );

      const result = await select( client, 'query', args, { recursive: true } );

      expect( result ).toEqual( { items: pages.flat(), count: pages.flat().length } );
      expect( QueryCommand ).toHaveBeenCalledTimes( 3 );
      expect( QueryCommand ).toHaveBeenNthCalledWith( 1, args );
      expect( QueryCommand ).toHaveBeenNthCalledWith( 2, { ...args, ExclusiveStartKey: paginationKey } );
      expect( QueryCommand ).toHaveBeenNthCalledWith( 3, { ...args, ExclusiveStartKey: paginationKey2 } );
    } );

    it( 'Should recursivelly scan the database until it cannot paginate anymore', async () => {
      const pages = [ makeItems( 5 ), makeItems( 5 ), makeItems( 3 ) ];
      const args = {
        TableName: 'foo-bar'
      };
      const paginationKey = { id: '5' };
      const paginationKey2 = { id: '10' };

      // calls 1 to 3
      client.send.mockImplementationOnce( async _ => ( { Items: pages[0], Count: pages[0].length, LastEvaluatedKey: paginationKey } ) );
      client.send.mockImplementationOnce( async _ => ( { Items: pages[1], Count: pages[1].length, LastEvaluatedKey: paginationKey2 } ) );
      client.send.mockImplementationOnce( async _ => ( { Items: pages[2], Count: pages[2].length, LastEvaluatedKey: null } ) );

      const result = await select( client, 'scan', args, { recursive: true } );

      expect( result ).toEqual( { items: pages.flat(), count: pages.flat().length } );
      expect( ScanCommand ).toHaveBeenCalledTimes( 3 );
      expect( ScanCommand ).toHaveBeenNthCalledWith( 1, args );
      expect( ScanCommand ).toHaveBeenNthCalledWith( 2, { ...args, ExclusiveStartKey: paginationKey } );
      expect( ScanCommand ).toHaveBeenNthCalledWith( 3, { ...args, ExclusiveStartKey: paginationKey2 } );
    } );

    it( 'Should stop the recursion if the "Limit" in args is satisfied', async () => {
      const pages = [ makeItems( 5 ), makeItems( 5 ), makeItems( 3 ) ];
      const args = {
        TableName: 'foo-bar',
        Limit: 8
      };
      const paginationKey = { id: '5' };
      const paginationKey2 = { id: '10' };

      // calls 1 to 3
      client.send.mockImplementationOnce( async _ => ( { Items: pages[0], Count: pages[0].length, LastEvaluatedKey: paginationKey } ) );
      client.send.mockImplementationOnce( async _ => ( { Items: pages[1], Count: pages[1].length, LastEvaluatedKey: paginationKey2 } ) );
      client.send.mockImplementationOnce( async _ => ( { Items: pages[2], Count: pages[2].length, LastEvaluatedKey: null } ) );

      const result = await select( client, 'scan', args, { recursive: true } );

      expect( result ).toEqual( { items: pages.flat().slice( 0, 8 ), count: 8 } );
      expect( ScanCommand ).toHaveBeenCalledTimes( 2 );
      expect( ScanCommand ).toHaveBeenNthCalledWith( 1, args );
      expect( ScanCommand ).toHaveBeenNthCalledWith( 2, { ...args, ExclusiveStartKey: paginationKey } );
    } );

    it( 'Should trim the results to the "Limit" argument in the native args if present', async () => {
      const limit = 6;
      const pages = [ makeItems( 5 ), makeItems( 5 ) ];
      const args = {
        TableName: 'foo-bar',
        Limit: limit
      };
      const paginationKey = { id: '123' };

      // calls 1 and 2
      client.send.mockImplementationOnce( async _ => ( { Items: pages[0], Count: pages[0].length, LastEvaluatedKey: paginationKey } ) );
      client.send.mockImplementationOnce( async _ => ( { Items: pages[1], Count: pages[1].length, LastEvaluatedKey: null } ) );

      const result = await select( client, 'query', args, { recursive: true } );

      expect( result ).toEqual( { items: pages.flat().slice( 0, 6 ), count: limit } );
      expect( QueryCommand ).toHaveBeenCalledTimes( 2 );
      expect( QueryCommand ).toHaveBeenNthCalledWith( 1, args );
      expect( QueryCommand ).toHaveBeenNthCalledWith( 2, { ...args, ExclusiveStartKey: paginationKey } );
    } );

    it( 'Should allow a "Count" select, query there are no items, just numbers', async () => {
      const args = {
        TableName: 'foo-bar',
        Select: 'COUNT'
      };
      const paginationKey = { id: '123' };

      // calls 1 and 2
      client.send.mockImplementationOnce( async _ => ( { Items: undefined, Count: 10, LastEvaluatedKey: paginationKey } ) );
      client.send.mockImplementationOnce( async _ => ( { Items: undefined, Count: 10, LastEvaluatedKey: null } ) );

      const result = await select( client, 'query', args, { recursive: true } );

      expect( result ).toEqual( { items: null, count: 20 } );
      expect( QueryCommand ).toHaveBeenCalledTimes( 2 );
      expect( QueryCommand ).toHaveBeenNthCalledWith( 1, args );
      expect( QueryCommand ).toHaveBeenNthCalledWith( 2, { ...args, ExclusiveStartKey: paginationKey } );
    } );
  } );

  describe( 'Default', () => {
    it( 'Should return a page of results and a key to next results', async () => {
      const items = makeItems( 10 );

      const nextPaginationKey = { id: '10' };

      client.send.mockImplementationOnce( async () => ( { Items: items, Count: items.length, LastEvaluatedKey: nextPaginationKey } ) );

      const result = await select( client, 'query', {} );

      expect( result ).toEqual( {
        items,
        count: items.length,
        nextToken: encode( nextPaginationKey )
      } );
    } );

    it( 'Should return a page of results using the "paginationToken" option', async () => {
      const items = makeItems( 10 );

      const paginationKey = { id: '10' };
      const nextPaginationKey = { id: '20' };

      client.send.mockImplementationOnce( async _ => ( { Items: items, Count: items.length, LastEvaluatedKey: nextPaginationKey } ) );

      const result = await select( client, 'query', {}, { paginationToken: encode( paginationKey ) } );

      expect( result ).toEqual( {
        items,
        count: items.length,
        nextToken: encode( nextPaginationKey )
      } );
    } );
  } );
} );
