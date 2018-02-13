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
    this.frame.x = 4;
    this.speed = 250;
    this.jumping = true;
    this.vel = 0;
  }

  update(dt, t) {
    const { pos, controls, map, speed, gameOver } = this;

    if (gameOver) {
      this.rotation += dt * 5;
      this.pivot.y = 24;
      this.pivot.x = 24;
      return;
    }

    const { x } = controls;
    const xo = x * dt * speed;
    let yo = 0;

    if (!this.jumping && controls.action) {
      this.vel = -10;
      this.jumping = true;
    }

    if (this.jumping) {
      yo += this.vel;
      this.vel += 32 * dt;
    }

    const r = wallslide(this, map, xo, yo);

    if (r.hits.down) {
      this.jumping = false;
      this.vel = 0;
    }
    if (r.hits.up) {
      this.vel = 0;
    }

    // Check if falling
    if (!this.jumping && !r.hits.down) {
      this.jumping = true;
      this.vel = 3;
    }

    pos.x += r.x;
    pos.y += r.y;

    // Animations
    if (x && !this.jumping) {
      this.frame.x = ((t / 0.1) | 0) % 4;
      if (x > 0) {
        this.anchor.x = 0;
        this.scale.x = 1;
      } else if (x < 0){
        this.anchor.x = this.w;
        this.scale.x = -1;
      }
    }
  }
}

export default Player;
