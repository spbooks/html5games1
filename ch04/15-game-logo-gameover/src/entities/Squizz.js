import pop from "../../pop/index.js";
const { TileSprite, Texture } = pop;

const texture = new Texture("res/images/player-walk.png");

class Squizz extends TileSprite {
  constructor(controls) {
    super(texture, 32, 32);
    this.controls = controls;

    const { anims } = this;
    anims.add("walk", [0, 1, 2, 3].map(x => ({ x, y: 0 })), 0.1);

    this.minSpeed = 0.5;
    this.reset();

    this.speed = this.minSpeed;
    this.dir = {
      x: 1,
      y: 0
    };
    this.nextCell = this.speed;
  }

  reset() {
    this.speed = this.minSpeed * 5;
    this.anims.play("walk");
  }

  update(dt, t) {
    super.update(dt, t);
    const { pos, controls, minSpeed, speed, dir } = this;

    if ((this.nextCell -= dt) <= 0) {
      this.nextCell += speed;
      const { x, y } = controls;
      if (x && x !== dir.x) {
        dir.x = x;
        dir.y = 0;
        pos.y = Math.round(pos.y / 32) * 32;
      } else if (y && y !== dir.y) {
        dir.x = 0;
        dir.y = y;
        pos.x = Math.round(pos.x / 32) * 32;
      }
    }

    // Speed adjustments
    if (this.speed > minSpeed) {
      this.speed -= dt;
    }

    pos.x += dir.x * dt * (32 / speed);
    pos.y += dir.y * dt * (32 / speed);
  }
}

export default Squizz;
