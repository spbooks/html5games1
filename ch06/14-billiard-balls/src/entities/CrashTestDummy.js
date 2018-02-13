import pop from "../../pop/index.js";
const { Texture, TileSprite, math, physics, Vec } = pop;

const texture = new Texture("res/images/crash_test.png");

class CrashTestDummy extends TileSprite {
  constructor(bounds) {
    super(texture, 48, 48);
    this.pivot = { x: 24, y: 24 };
    this.radius = 24;
    this.frame.x = math.rand(4);
    this.vel = new Vec();
    this.acc = new Vec();
    this.bounds = bounds;
    this.rotation = math.rand(4) * (Math.PI / 2);
  }

  update(dt) {
    const { pos, vel, bounds, w, h } = this;

    if (math.randOneIn(1000)) {
      const MAX_POWER = 500;
      physics.applyImpulse(
        this,
        {
          x: math.rand(-MAX_POWER, MAX_POWER),
          y: math.rand(-MAX_POWER, MAX_POWER)
        },
        dt
      );
    }

    physics.applyFriction(this, 100);
    physics.integratePos(this, dt); // this is the normal integrate function, it just adds `pos` for us!

    // Bounce off the walls
    if (pos.x < 0 || pos.x > bounds.w - w) {
      vel.x *= -1;
      pos.x = pos.x < 0 ? 0 : bounds.w - w;
    }
    if (pos.y < 0 || pos.y > bounds.h - h) {
      vel.y *= -1;
      pos.y = pos.y < 0 ? 0 : bounds.h - h;
    }
  }
}

export default CrashTestDummy;
