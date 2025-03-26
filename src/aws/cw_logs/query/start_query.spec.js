const { StartQueryCommand } = require( '@aws-sdk/client-cloudwatch-logs' );
const startQuery = require( './start_query' );

jest.mock( './polling_delay', () => 50 );
jest.mock( '@aws-sdk/client-cloudwatch-logs', () => ( {
  StartQueryCommand: jest.fn()
} ) );

const client = {
  send: jest.fn()
};

const queryId = '123';
const commandInstance = jest.fn();

const fullNativeArgs = {
  startTime: Math.trunc( new Date( '2025-03-22T00:00:00.000Z' ).getTime() / 1000 ),
  endTime: Math.trunc( new Date( '2025-03-22T23:59:00.000Z' ).getTime() / 1000 ),
  logGroupName: '/aws/lambda/foo-bar',
  queryLanguage: 'CWLI',
  queryString: 'fields @timestamp, event_type | filter ispresent(event_type)'
};

const from = new Date( '2025-03-22T05:00:00.000Z' ).getTime();
const to = new Date( '2025-03-22T10:00:00.000Z' ).getTime();

describe( 'Start Query Spec', () => {
  beforeEach( () => {
    client.send.mockReset();
    StartQueryCommand.mockReset();
    StartQueryCommand.mockReturnValue( commandInstance );
  } );

  it( 'Should send out all native arguments to the StartQueryCommand', async () => {
    client.send.mockResolvedValue( { queryId } );
    const result = await startQuery( { client, nativeArgs: fullNativeArgs } );

    expect( result ).toEqual( queryId );
    expect( StartQueryCommand ).toHaveBeenCalledWith( fullNativeArgs );
  } );

  it( 'Should allow range.from to overwrite startTime, if present', async () => {
    client.send.mockResolvedValue( { queryId } );
    const result = await startQuery( { client, nativeArgs: { ...fullNativeArgs }, range: { from } } );

    expect( result ).toEqual( queryId );
    expect( StartQueryCommand ).toHaveBeenCalledWith( {
      ...fullNativeArgs,
      startTime: Math.trunc( from / 1000 )
    } );
  } );

  it( 'Should allow range.to to overwrite endTime, if present', async () => {
    client.send.mockResolvedValue( { queryId } );
    const result = await startQuery( { client, nativeArgs: { ...fullNativeArgs }, range: { to } } );

    expect( result ).toEqual( queryId );
    expect( StartQueryCommand ).toHaveBeenCalledWith( {
      ...fullNativeArgs,
      endTime: Math.trunc( to / 1000 )
    } );
  } );
} );
