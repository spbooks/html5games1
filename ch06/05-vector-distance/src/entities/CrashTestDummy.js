import pop from "../../pop/index.js";
const { Texture, TileSprite, Vec } = pop;

const texture = new Texture("res/images/crash_test.png");

class CrashTestDummy extends TileSprite {
  constructor(vel) {
    super(texture, 48, 48);
    this.vel = new Vec(vel, 0);
    this.pivot = { x: 24, y: 24 };
  }

  update(dt) {
    const { pos, vel } = this;

    // Move in the direction of the path
    pos.x += vel.x * dt;
    pos.y += vel.y * dt;

    // Or...
    // pos.add(vel.clone().multiply(dt));

    this.rotation += 5 * dt;
  }
}

export default CrashTestDummy;
