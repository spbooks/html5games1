import pop from "../../pop/index.js";
const { TileSprite, Texture } = pop;

const texture = new Texture("res/images/player-walk.png");

class Squizz extends TileSprite {
  constructor(controls) {
    super(texture, 32, 32);
    this.controls = controls;

    const { anims } = this;
    anims.add("walk", [0, 1, 2, 3].map(x => ({ x, y: 0 })), 0.1);
    anims.add("power", [0, 1, 2, 3].map(x => ({ x, y: 1 })), 0.07);

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
    this.powerupTime = 0;
    this.fastTime = 0;
    this.anims.play("walk");
  }

  powerUpFor(seconds = 3) {
    this.powerupTime = seconds;
    this.anims.play("power");
  }

  get isPoweredUp() {
    return this.powerupTime > 0;
  }

  update(dt, t) {
    super.update(dt, t);
    const { pos, controls, anims, minSpeed, dir } = this;
    let speed = this.speed;

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
    if ((this.fastTime -= dt) > 0) {
      speed /= 1.33;
    }

    pos.x += dir.x * dt * (32 / speed);
    pos.y += dir.y * dt * (32 / speed);

    // Powerball blink mode!
    this.visible = true;
    if (this.powerupTime > 0) {
      const time = this.powerupTime -= dt;
      // Blink when nearly done
      if (time < 1.5) {
        this.visible = t / 0.1 % 2 | 0;
      }
      if (time < 0) {
        anims.play("walk");
      }
    }
  }
}

export default Squizz;
