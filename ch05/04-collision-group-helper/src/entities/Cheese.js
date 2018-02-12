import pop from "../../pop/index.js";
const { Sprite, Texture } = pop;

const texture = new Texture("res/images/cheese.png");

class Cheese extends Sprite {
  constructor() {
    super(texture);
    this.w = 74;
    this.h = 50;
    this.hitBox = {
      x: 2,
      y: 5,
      w: 70,
      h: 45
    };
    this.speed = 100;
  }
  update(dt) {
    const { pos, speed } = this;
    pos.x -= speed * dt;
  }
}

export default Cheese;
