import pop from "../../pop/index.js";
const { Texture, TileSprite, math } = pop;

const texture = new Texture("res/images/bravedigger-tiles.png");

class Ghost extends TileSprite {
  constructor(map) {
    super(texture, 48, 48);
    this.type = "Ghost";
    this.hitBox = {
      x: 6,
      y: 3,
      w: 32,
      h: 32
    };
    this.frame.x = 5;
    this.frame.y = 1;
    this.anchor = { x: 0, y: 0 };

    this.speed = 250;
    this.vel = {
      x: math.randf(0.5, 1) * this.speed,
      y: 0,
    };
    this.map = map;
  }

  update(dt, t) {
    const { pos, vel, frame, map, w } = this;
    pos.x += vel.x * dt;
    pos.y += vel.y * dt;

    // Bob spookily
    pos.y += Math.sin(t / 100) * 0.5;
    frame.x = ((t / 100) | 0) % 2 + 3;

    if (pos.x < map.tileW) {
      vel.x *= -1;
      pos.x = map.tileW;
    }

    if (pos.x + w > map.w - map.tileW) {
      vel.x *= -1;
      pos.x = map.w - w - map.tileW;
    }

  }
}

export default Ghost;
