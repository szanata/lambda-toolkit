const createInstance = require( './create_instance' );

describe( 'Create Instance Spec', () => {
  describe( 'Singleton', () => {
    it( 'Invoked static methods must receive the result of an instance provider as the first argument', () => {
      const instances = [ 'i1', 'i2', 'i3' ];
      const methods = {
        walk: jest.fn(),
        run: jest.fn(),
        jump: jest.fn()
      };
      const provider = jest.fn().mockImplementation( () => instances.shift() );

      const singleton = createInstance( provider, methods );
      singleton.walk( 'straight' );
      singleton.run( 'fast' );
      singleton.jump( 'high' );

      expect( provider ).toHaveBeenCalledTimes( 3 );
      expect( methods.walk ).toHaveBeenCalledWith( 'i1', 'straight' );
      expect( methods.run ).toHaveBeenCalledWith( 'i2', 'fast' );
      expect( methods.jump ).toHaveBeenCalledWith( 'i3', 'high' );
    } );

    it( 'Call to "getClient" returns the result of the instance provider', () => {
      const instances = [ 'i1', 'i2', 'i3' ];
      const methods = {
        walk: jest.fn()
      };
      const provider = jest.fn().mockImplementation( () => instances.shift() );
      const singleton = createInstance( provider, methods );

      expect( singleton.getClient() ).toBe( 'i1' );
      expect( singleton.getClient() ).toBe( 'i2' );
      expect( singleton.getClient() ).toBe( 'i3' );
    } );
  } );

  describe( 'Instance Factory', () => {
    it( 'The factory returns an instance where each method receives the same instance provider return, called with the factory args', () => {
      const instances = [ 'i1', 'i2', 'i3' ];
      const methods = {
        walk: jest.fn(),
        run: jest.fn(),
        jump: jest.fn()
      };
      const provider = jest.fn().mockImplementation( args => `${instances.shift()}_${args}` );

      const factory = createInstance( provider, methods );
      const instance1 = factory( 'arg1' );
      instance1.walk( 'straight' );
      instance1.run( 'fast' );
      instance1.jump( 'high' );

      const instance2 = factory( 'arg2' );
      instance2.walk( 'straight' );
      instance2.run( 'fast' );
      instance2.jump( 'high' );

      expect( provider ).toHaveBeenCalledTimes( 2 );
      expect( provider ).toHaveBeenNthCalledWith( 1, 'arg1' );
      expect( provider ).toHaveBeenNthCalledWith( 2, 'arg2' );
      expect( methods.walk ).toHaveBeenNthCalledWith( 1, 'i1_arg1', 'straight' );
      expect( methods.run ).toHaveBeenNthCalledWith( 1, 'i1_arg1', 'fast' );
      expect( methods.jump ).toHaveBeenNthCalledWith( 1, 'i1_arg1', 'high' );

      expect( methods.walk ).toHaveBeenNthCalledWith( 2, 'i2_arg2', 'straight' );
      expect( methods.run ).toHaveBeenNthCalledWith( 2, 'i2_arg2', 'fast' );
      expect( methods.jump ).toHaveBeenNthCalledWith( 2, 'i2_arg2', 'high' );
    } );

    it( 'After building the instance each call to "getClient" returns the same result of the instance provider', () => {
      const instances = [ 'i1', 'i2', 'i3' ];
      const methods = {
        walk: jest.fn()
      };
      const provider = jest.fn().mockImplementation( args => `${instances.shift()}_${args}` );

      const factory = createInstance( provider, methods );
      const instance = factory( 'arg1' );

      expect( instance.getClient() ).toBe( 'i1_arg1' );
      expect( instance.getClient() ).toBe( 'i1_arg1' );
      expect( instance.getClient() ).toBe( 'i1_arg1' );
    } );
  } );
} );
