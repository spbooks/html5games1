class Vec {
  static from(v) {
    return new Vec().copy(v);
  }

  constructor(x = 0, y = 0) {
    this.set(x, y);
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  copy({ x, y }) {
    this.x = x;
    this.y = y;
    return this;
  }

  clone() {
    return Vec.from(this);
  }

  add({ x, y }) {
    this.x += x;
    this.y += y;
    return this;
  }

  subtract({ x, y }) {
    this.x -= x;
    this.y -= y;
    return this;
  }

  multiply(s) {
    this.x *= s;
    this.y *= s;
    return this;
  }

  divide(s) {
    this.x /= s;
    this.y /= s;
    return this;
  }

  mag() {
    const { x, y } = this;
    return Math.sqrt(x * x + y * y);
  }

  normalize() {
    const mag = this.mag();
    if (mag > 0) {
      this.x /= mag;
      this.y /= mag;
    }
    return this;
  }

  dot({ x, y }) {
    return this.x * x + this.y * y;
  }

  toString() {
    return `(${this.x},${this.y})`;
  }
}
export default Vec;
