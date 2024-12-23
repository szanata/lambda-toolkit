module.exports = class Timer {
  #startedAt;
  #stoppedAt = null;
  #running = false;

  get elapsed() {
    if ( this.#running ) {
      return Date.now() - this.#startedAt;
    } else if ( !this.#startedAt ) {
      return 0;
    } else {
      return this.#stoppedAt - this.#startedAt;
    }
  }

  get running() {
    return this.#running;
  }

  start() {
    if ( !this.#running ) {
      this.#startedAt = Date.now();
      this.#running = true;
    }
    return this;
  }

  restart() {
    this.#running = true;
    this.#startedAt = Date.now();
    return this;
  }

  stop() {
    if ( this.#running ) {
      this.#running = false;
      this.#stoppedAt = Date.now();
    }
    return this.#stoppedAt - this.#startedAt;
  }
};
