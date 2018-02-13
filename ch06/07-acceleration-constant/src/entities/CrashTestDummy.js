import pop from "../../pop/index.js";
const { Texture, TileSprite, Vec } = pop;

const texture = new Texture("res/images/crash_test.png");

class CrashTestDummy extends TileSprite {
  constructor(bounds) {
    super(texture, 48, 48);
    this.pivot = { x: 24, y: 24 };
    this.vel = new Vec();
    this.acc = new Vec();
    this.bounds = bounds;
    this.time = 0;
  }

  update(dt) {
    const { pos, vel, acc, bounds, w, h } = this;

    const ACCELERATION = 200;
    acc.x += ACCELERATION;

    vel.x += acc.x * dt;
    vel.y += acc.y * dt;

    pos.x += vel.x * dt;
    pos.y += vel.y * dt;

    // Print out what we expect from displacment test
    this.time += dt;
    if (this.time >= 2 && !this.prnt) {
      // s = ut * 1/2 a * t * t
      // eg: 200px/s/s ... 0 + (1/2) * 200 * 2 * 2 = 400px.
      const expectedPos = 0.5 * ACCELERATION * this.time * this.time;
      console.log(this.time, pos.x, expectedPos, expectedPos - pos.x);
      this.prnt = true;
    }

    // Bounce off the walls
    if (pos.x < 0 || pos.x > bounds.w - w) {
      vel.x *= -1;
    }
    if (pos.y < 0 || pos.y > bounds.h - h) {
      vel.y *= -1;
    }

    this.rotation += vel.x * 0.05 * dt;

    acc.set(0, 0);
  }
}

export default CrashTestDummy;
