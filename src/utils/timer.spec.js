const Timer = require( './timer' );

describe( 'Timer Spec', () => {
  describe( 'Initial State', () => {
    it( 'Timer starts stopped, "running" is false', () => {
      const timer = new Timer();
      expect( timer.running ).toBe( false );
    } );

    it( 'Timer starts stopped, "elapsed" is 0', () => {
      const timer = new Timer();
      expect( timer.elapsed ).toBe( 0 );
    } );
  } );

  describe( 'Start', () => {
    it( 'Calling "start" starts the timer and "running" is true', () => {
      const timer = new Timer();
      timer.start();
      expect( timer.running ).toBe( true );
    } );

    it( 'Calling "start" starts the timer and "elapse" is how much time passed since', () => {
      const timer = new Timer();
      timer.start();
      const waitTime = 50;
      setTimeout( () => {
        expect( timer.elapsed ).toBeGreaterThanOrEqual( waitTime - 10 );
      }, waitTime );
    } );

    it( 'Calling "start" when the timer is already running does nothing', done => {
      const timer = new Timer();
      timer.start();
      const waitTime = 50;
      setTimeout( () => {
        timer.start();
        setTimeout( () => {
          expect( timer.elapsed ).toBeGreaterThanOrEqual( ( waitTime * 2 ) - 10 );
          done();
        }, waitTime );
      }, waitTime );
    } );
  } );

  describe( 'Stop', () => {
    it( 'Calling "stop" on a timer that never started does nothing', () => {
      const timer = new Timer();
      timer.stop();
      expect( timer.elapsed ).toBe( 0 );
      expect( timer.running ).toBe( false );
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
          expect( timer.elapsed ).toBe( elapsedTime );
          expect( timer.running ).toBe( false );
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
          expect( timer.elapsed ).toBe( elapsedTime );
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
        expect( timer.elapsed ).toBeLessThanOrEqual( 10 );
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
            expect( timer.elapsed ).toBeGreaterThanOrEqual( waitTime - 10 );
          }, waitTime );
        }, waitTime );
      }, waitTime );
    } );
  } );
} );
