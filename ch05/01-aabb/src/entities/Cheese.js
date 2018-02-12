import pop from "../../pop/index.js";
const { Sprite, Texture } = pop;

const texture = new Texture("res/images/cheese.png");

class Cheese extends Sprite {
  constructor() {
    super(texture);
    this.w = 74;
    this.h = 50;
  }
}

export default Cheese;
