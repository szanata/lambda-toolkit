import { Timer } from './timer.js';
import { describe, it } from 'node:test';
import { strictEqual, ok } from 'node:assert';

describe( 'Timer Spec', () => {
  describe( 'Initial State', () => {
    it( 'Timer starts stopped, "running" is false', () => {
      const timer = new Timer();
      strictEqual( timer.running, false );
    } );

    it( 'Timer starts stopped, "elapsed" is 0', () => {
      const timer = new Timer();
      strictEqual( timer.elapsed, 0 );
    } );
  } );

  describe( 'Start', () => {
    it( 'Calling "start" starts the timer and "running" is true', () => {
      const timer = new Timer();
      timer.start();
      strictEqual( timer.running, true );
    } );

    it( 'Calling "start" starts the timer and "elapse" is how much time passed since', () => {
      const timer = new Timer();
      timer.start();
      const waitTime = 50;
      setTimeout( () => {
        ok( timer.elapsed >= waitTime - 10 );
      }, waitTime );
    } );

    it( 'Calling "start" when the timer is already running does nothing', () => {
      const timer = new Timer();
      timer.start();
      const waitTime = 50;
      setTimeout( () => {
        timer.start();
        setTimeout( () => {
          ok( timer.elapsed >= ( waitTime * 2 ) - 10 );
          // done();
        }, waitTime );
      }, waitTime );
    } );
  } );

  describe( 'Stop', () => {
    it( 'Calling "stop" on a timer that never started does nothing', () => {
      const timer = new Timer();
      timer.stop();
      strictEqual( timer.elapsed, 0 );
      strictEqual( timer.running, false );
    } );

    it( 'Calling "stop" on a timer that was stopped does nothing', () => {
      const timer = new Timer();
      timer.start();
      const waitTime = 50;
      setTimeout( () => {
        timer.stop();
        const elapsedTime = timer.elapsed;
        setTimeout( () => {
          timer.stop();
          strictEqual( timer.elapsed, elapsedTime );
          strictEqual( timer.running, false );
        }, waitTime );
      }, waitTime );

    } );

    it( 'Calling "stop" on a running timer stops it and returns the elapsed time', () => {
      const timer = new Timer();
      timer.start();
      const waitTime = 50;
      setTimeout( () => {
        timer.stop();
        const elapsedTime = timer.elapsed;
        setTimeout( () => {
          strictEqual( timer.elapsed, elapsedTime );
        }, waitTime );
      }, waitTime );
    } );
  } );

  describe( 'Restart', () => {
    it( 'Calling "restart" on a running timer resets the elapsed time', () => {
      const timer = new Timer();
      timer.start();
      const waitTime = 50;
      setTimeout( () => {
        timer.restart();
        ok( timer.elapsed <= 10 );
      }, waitTime );
    } );

    it( 'Calling "restart" on a stopped runner timer re-starts it', () => {
      const timer = new Timer();
      timer.start();
      const waitTime = 50;
      setTimeout( () => {
        timer.stop();
        setTimeout( () => {
          timer.restart();
          setTimeout( () => {
            ok( timer.elapsed >= waitTime - 10 );
          }, waitTime );
        }, waitTime );
      }, waitTime );
    } );
  } );
} );
