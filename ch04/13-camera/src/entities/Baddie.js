import pop from "../../pop/index.js";
const { TileSprite, Texture } = pop;

const texture = new Texture("res/images/baddie-walk.png");

class Baddie extends TileSprite {
  constructor(xSpeed = 100, ySpeed = 0) {
    super(texture, 32, 32);
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    if (xSpeed !== 0) {
      this.frame.x = xSpeed < 0 ? 2 : 0;
    } else {
      this.frame.x = ySpeed < 0 ? 3 : 1;
    }
  }

  update(dt) {
    const { pos, xSpeed, ySpeed } = this;
    pos.x += xSpeed * dt;
    pos.y += ySpeed * dt;
  }
}

export default Baddie;
