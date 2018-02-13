import pop from "../../pop/index.js";
const { Texture, TileSprite, math, physics, Vec } = pop;

const texture = new Texture("res/images/crash_test.png");

class CrashTestDummy extends TileSprite {
  constructor(bounds) {
    super(texture, 48, 48);
    this.frame.x = math.rand(4);
    this.vel = new Vec();
    this.acc = new Vec();
    this.bounds = bounds;
  }

  update(dt) {
    const { pos, vel, bounds, w, h } = this;

    if (math.randOneIn(130)) {
      physics.applyImpulse(
        this,
        {
          x: math.rand(-300, 300),
          y: math.rand(-500, -100)
        },
        dt
      );
    }

    const friction = vel.clone().multiply(-1).normalize().multiply(200);
    const gravity = { x: 0, y: 500 };

    physics.applyForce(this, friction);
    physics.applyForce(this, gravity);
    physics.integrate(this, dt);

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
