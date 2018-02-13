import pop from "../../pop/index.js";
const { Texture, TileSprite, math, Vec } = pop;

const texture = new Texture("res/images/crash_test.png");

class CrashTestDummy extends TileSprite {
  constructor(bounds) {
    super(texture, 48, 48);
    this.frame.x = math.rand(4);
    this.vel = new Vec(math.rand(-300, 300), math.rand(-300, 300));
    this.pos.set(bounds.w / 2, bounds.h / 2);
    this.bounds = bounds;
    this.rotation = math.rand(4) * (Math.PI / 2);
    this.pivot = { x: 24, y: 24 };
  }

  update(dt) {
    const { pos, vel, bounds, w, h } = this;

    // Move in the direction of the path
    pos.x += vel.x * dt;
    pos.y += vel.y * dt;

    // Bounce off the walls
    if (pos.x < 0 || pos.x > bounds.w - w) {
      vel.x *= -1;
      this.rotation += Math.PI;
    }
    if (pos.y < 0 || pos.y > bounds.h - h) {
      vel.y *= -1;
      this.rotation += Math.PI;
    }
  }
}

export default CrashTestDummy;
