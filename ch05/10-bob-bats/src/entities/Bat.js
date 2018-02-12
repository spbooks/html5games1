import pop from "../../pop/index.js";
const { Texture, TileSprite, math } = pop;

const texture = new Texture("res/images/bravedigger-tiles.png");

class Bat extends TileSprite {
  constructor() {
    super(texture, 48, 48);
    this.hitBox = {
      x: 6,
      y: 6,
      w: 30,
      h: 26
    };
    this.frame.x = 3;
    this.frame.y = 1;
    this.dir = {
      x: -1,
      y: 0
    };
    this.speed = math.rand(180, 300);
  }

  update(dt, t) {
    const { pos, dir, speed } = this;

    let { x, y } = dir;
    const xo = x * dt * speed;
    const yo = y * dt * speed;
    pos.x += xo;
    pos.y += yo;
    pos.y += Math.sin((t + speed) * 10) * speed * dt;

    this.frame.x = ((t / 0.1) | 0) % 2 + 3;
  }
}

export default Bat;
