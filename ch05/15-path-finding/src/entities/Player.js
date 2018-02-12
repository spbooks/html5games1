import pop from "../../pop/index.js";
const { Texture, TileSprite, wallslide } = pop;

const texture = new Texture("res/images/bravedigger-tiles.png");

class Player extends TileSprite {
  constructor(controls, map) {
    super(texture, 48, 48);
    this.controls = controls;
    this.map = map;
    this.hitBox = {
      x: 8,
      y: 10,
      w: 28,
      h: 38
    };
    this.speed = 210;
    this.anchor = { x: 0, y: 0 };
    this.frame.x = 4;
  }

  update(dt, t) {
    const { pos, controls, map, speed, gameOver } = this;

    if (gameOver) {
      this.rotation += dt * 5;
      this.pivot.y = 24;
      this.pivot.x = 24;
      return;
    }

    let { x, y } = controls;
    const xo = x * dt * speed;
    const yo = y * dt * speed;
    const r = wallslide(this, map, xo, yo);
    if (r.x !== 0 && r.y !== 0) {
      r.x /= Math.sqrt(2);
      r.y /= Math.sqrt(2);
    }
    pos.x += r.x;
    pos.y += r.y;

    // Animate!
    if (r.x || r.y) {
      this.frame.x = ((t / 0.08) | 0) % 4;
      if (r.x < 0) {
        this.scale.x = -1;
        this.anchor.x = 48;
      }
      if (r.x > 0) {
        this.scale.x = 1;
        this.anchor.x = 0;
      }
    } else {
      this.frame.x = ((t / 0.2) | 0) % 2 + 4;
    }
  }
}

export default Player;
