import pop from "../../pop/index.js";
const { TileSprite, Texture, math } = pop;

const texture = new Texture("res/images/player-walk.png");

class Squizz extends TileSprite {
  constructor() {
    super(texture, 32, 32);
    this.anchor = { x: -16, y: -16 };
    this.speed = math.rand(20, 100);

    // Animation variables
    this.rate = 0.15 - (0.1 * this.speed / 100);
    this.curTime = 0;
    this.curFrame = 0;
    this.frames = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 }
    ];
    this.frame = this.frames[this.curFrame];
  }

  update(dt) {
    const { pos, speed, rate, frames } = this;
    pos.x += speed * dt;

    if (speed) {
      // Animation handling
      this.curTime += dt;
      if (this.curTime > rate) {
        this.frame = frames[this.curFrame++ % frames.length];
        this.curTime -= rate;
      }
    }
  }
}

export default Squizz;
