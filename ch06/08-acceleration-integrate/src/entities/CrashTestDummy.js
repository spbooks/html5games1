import pop from "../../pop/index.js";
const { Texture, TileSprite, physics, Vec } = pop;

const texture = new Texture("res/images/crash_test.png");

class CrashTestDummy extends TileSprite {
  constructor(bounds) {
    super(texture, 48, 48);
    this.pivot = { x: 24, y: 24 };
    this.vel = new Vec();
    this.acc = new Vec();
    this.bounds = bounds;
  }

  update(dt) {
    const { pos, vel, bounds, w, h } = this;

    // Jetpack!
    physics.applyForce(this, { x: 200, y: 0 });

    // Gravity
    physics.applyForce(this, { x: 0, y: 300 });

    physics.integrate(this, dt);

    // Bounce off the walls
    if (pos.x < 0 || pos.x > bounds.w - w) {
      vel.x *= -1;
    }
    if (pos.y < 0 || pos.y > bounds.h - h) {
      vel.y *= -1;
    }

    this.rotation += vel.x * 0.05 * dt;
  }
}

export default CrashTestDummy;
