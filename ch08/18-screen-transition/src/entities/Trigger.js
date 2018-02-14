import pop from "../../pop/";
const { Vec } = pop;

class Trigger {
  constructor(hitBox, onCollide) {
    this.pos = new Vec();
    const { w, h, x = 0, y = 0 } = hitBox;
    this.w = w + x;
    this.h = h + y;
    if (x || y) {
      this.hitBox = { w, h, x, y };
    }
    this.onCollide = onCollide;
  }

  fire() {
    if (this.onCollide) {
      this.onCollide();
    }
  }
}

export default Trigger;
