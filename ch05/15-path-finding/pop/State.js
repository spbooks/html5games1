class State {
  constructor(state) {
    this.set(state);
  }

  set(state) {
    this.last = this.state;
    this.state = state;
    this.time = 0;
    this.justSetState = true;
  }

  get() {
    return this.state;
  }

  update(dt) {
    this.first = this.justSetState;
    this.time += this.first ? 0 : dt;
    this.justSetState = false;
  }

  is(state) {
    return this.state === state;
  }

  isIn(...states) {
    return states.some(s => this.is(s));
  }
}

export default State;
