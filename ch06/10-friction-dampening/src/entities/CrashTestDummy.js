import pop from "../../pop/index.js";
const { Texture, TileSprite, math, physics, Vec } = pop;

const texture = new Texture("res/images/crash_test.png");

class CrashTestDummy extends TileSprite {
  constructor(bounds, friction = 0.96) {
    super(texture, 48, 48);
    this.frame.x = math.rand(4);
    this.vel = new Vec();
    this.acc = new Vec();
    this.bounds = bounds;
    this.fling = false;

    this.friction = friction;
  }

  update(dt) {
    const { pos, vel, bounds, w, h, friction } = this;

    if (!this.fling) {
      physics.applyImpulse(this, { x: 800, y: 0 }, dt);
      this.fling = true;
    }
    physics.integrate(this, dt);

    vel.multiply(friction);

    // Bounce off the walls
    if (pos.x < 0 || pos.x > bounds.w - w) {
      vel.x *= -1;
    }
    if (pos.y < 0 || pos.y > bounds.h - h) {
      vel.y *= -1;
    }
  }
}

export default CrashTestDummy;
