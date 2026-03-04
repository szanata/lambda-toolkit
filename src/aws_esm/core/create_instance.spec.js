import { createInstance } from './create_instance.js';
import { describe, it } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';

describe( 'Create Instance Spec', () => {
  describe( 'Singleton', () => {
    it( 'Invoked static methods must receive the result of an instance provider as the first argument', t => {
      const instances = [ 'i1', 'i2', 'i3' ];
      const methods = {
        walk: t.mock.fn(),
        run: t.mock.fn(),
        jump: t.mock.fn()
      };
      const provider = t.mock.fn( () => instances.shift() );

      const singleton = createInstance( provider, methods );
      singleton.walk( 'straight' );
      singleton.run( 'fast' );
      singleton.jump( 'high' );

      strictEqual( provider.mock.calls.length, 3 );
      deepStrictEqual( methods.walk.mock.calls[0].arguments, [ 'i1', 'straight' ] );
      deepStrictEqual( methods.run.mock.calls[0].arguments, [ 'i2', 'fast' ] );
      deepStrictEqual( methods.jump.mock.calls[0].arguments, [ 'i3', 'high' ] );
    } );

    it( 'Call to "getClient" returns the result of the instance provider', t => {
      const instances = [ 'i1', 'i2', 'i3' ];
      const methods = {
        walk: t.mock.fn()
      };
      const provider = t.mock.fn( () => instances.shift() );
      const singleton = createInstance( provider, methods );

      strictEqual( singleton.getClient(), 'i1' );
      strictEqual( singleton.getClient(), 'i2' );
      strictEqual( singleton.getClient(), 'i3' );
    } );
  } );

  describe( 'Instance Factory', () => {
    it( 'The factory returns an instance where each method receives the same instance provider return, called with the factory args', t => {
      const instances = [ 'i1', 'i2', 'i3' ];
      const methods = {
        walk: t.mock.fn(),
        run: t.mock.fn(),
        jump: t.mock.fn()
      };
      const provider = t.mock.fn( args => `${instances.shift()}_${args}` );

      const factory = createInstance( provider, methods );
      const instance1 = factory( 'arg1' );
      instance1.walk( 'straight' );
      instance1.run( 'fast' );
      instance1.jump( 'high' );

      const instance2 = factory( 'arg2' );
      instance2.walk( 'straight' );
      instance2.run( 'fast' );
      instance2.jump( 'high' );

      strictEqual( provider.mock.calls.length, 2 );
      deepStrictEqual( provider.mock.calls[0].arguments, [ 'arg1' ] );
      deepStrictEqual( provider.mock.calls[1].arguments, [ 'arg2' ] );

      deepStrictEqual( methods.walk.mock.calls[0].arguments, [ 'i1_arg1', 'straight' ] );
      deepStrictEqual( methods.run.mock.calls[0].arguments, [ 'i1_arg1', 'fast' ] );
      deepStrictEqual( methods.jump.mock.calls[0].arguments, [ 'i1_arg1', 'high' ] );

      deepStrictEqual( methods.walk.mock.calls[1].arguments, [ 'i2_arg2', 'straight' ] );
      deepStrictEqual( methods.run.mock.calls[1].arguments, [ 'i2_arg2', 'fast' ] );
      deepStrictEqual( methods.jump.mock.calls[1].arguments, [ 'i2_arg2', 'high' ] );
    } );

    it( 'After building the instance each call to "getClient" returns the same result of the instance provider', t => {
      const instances = [ 'i1', 'i2', 'i3' ];
      const methods = {
        walk: t.mock.fn()
      };
      const provider = t.mock.fn( args => `${instances.shift()}_${args}` );

      const factory = createInstance( provider, methods );
      const instance = factory( 'arg1' );

      strictEqual( instance.getClient(), 'i1_arg1' );
      strictEqual( instance.getClient(), 'i1_arg1' );
      strictEqual( instance.getClient(), 'i1_arg1' );
    } );
  } );
} );
