import pop from "../../pop/index.js";
const { Sprite, Texture } = pop;

const texture = new Texture("res/images/mouse.png");

class Mouse extends Sprite {
  constructor(controls) {
    super(texture);
    this.w = 100;
    this.h = 51;
    this.controls = controls;
    this.hitBox = {
      x: 18,
      y: 8,
      w: 70,
      h: 35
    };
  }
  update() {
    const { pos, controls ,w ,h } = this;
    pos.x = controls.pos.x - w / 2;
    pos.y = controls.pos.y - h / 2;
  }
}

export default Mouse;
