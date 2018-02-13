import pop from "../../pop/index.js";
const { Texture, TileSprite, physics, Vec } = pop;

const texture = new Texture("res/images/crash_test.png");

class CrashTestDummy extends TileSprite {
  constructor(bounds, onBounce) {
    super(texture, 48, 48);
    this.vel = new Vec();
    this.acc = new Vec();
    this.bounds = bounds;
    this.onBounce = onBounce;

    this.time = 0;
  }

  update(dt) {
    const { pos, vel, bounds } = this;

    if (this.time == 0) {
      physics.applyImpulse(this, {
        x: bounds.w,
        y: 0
      }, dt);
    }
    this.time += dt;

    physics.integrate(this, dt);

    // Bounce off the walls
    if (pos.x < 0 || pos.x > bounds.w) {
      vel.x *= -1;
      this.onBounce(this.time);
    }
  }
}

export default CrashTestDummy;
