const cache = require( './cache_storage' );
const genericClientProvider = require( './generic_client_provider' );

jest.mock( './cache_storage', () => ( {
  set: jest.fn(),
  get: jest.fn()
} ) );

const className = 'class-name';

// This will be the "class", the fn represents the constructor
const constructor = new Proxy( jest.fn(), {
  // this customizes the .name, since with jest.fn() this property is read-only
  get: ( _this, prop ) => prop === 'name' ? className : _this[prop]
} );

// this is the supposed to be instance from constructor
const instance = {
  prop: 'I\'m an instance'
};

describe( 'Generic Client Provider', () => {
  beforeEach( () => {
    constructor.mockReturnValue( instance );
  } );

  afterEach( () => {
    cache.set.mockReset();
    cache.get.mockReset();
    constructor.mockReset();
  } );

  it( 'Should return from cache if present', () => {
    cache.get.mockReturnValue( 'cache-value' );

    const result = genericClientProvider( constructor );

    expect( result ).toBe( 'cache-value' );
    expect( cache.get ).toHaveBeenCalledWith( `${className}()` );
    expect( cache.set ).not.toHaveBeenCalled();
    expect( constructor ).not.toHaveBeenCalled();
  } );

  describe( 'If not on cache', () => {
    it( 'Should initialize constructor without arguments and save to cache', () => {
      const result = genericClientProvider( constructor );

      expect( result ).toEqual( instance );
      expect( cache.get ).toHaveBeenCalledWith( `${className}()` );
      expect( cache.set ).toHaveBeenCalledWith( `${className}()`, instance );
      expect( constructor ).toHaveBeenCalledWith();
    } );

    it( 'Should initialize constructor with arguments and save to cache', () => {
      const args = [ { option: 'none' }, 2, '3' ];

      const result = genericClientProvider( constructor, args );

      const key = `${className}({"option":"none"},2,"3")`;
      expect( result ).toEqual( instance );
      expect( cache.get ).toHaveBeenCalledWith( key );
      expect( cache.set ).toHaveBeenCalledWith( key, instance );
      expect( constructor ).toHaveBeenCalledWith( ...args );
    } );
  } );
} );
