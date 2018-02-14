import pop from "../../pop/index.js";
const { Rect, Vec } = pop;

class Trigger {
  constructor(hitBox, onCollide, debug = false) {
    const { w, h, x = 0, y = 0 } = hitBox;
    this.type = "Trigger";
    this.pos = new Vec();
    this.w = w;
    this.h = h;
    if (x || y) {
      this.hitBox = { w, h, x, y };
    }

    this.onCollide = onCollide;
    if (debug) {
      const box = new Rect(w, h, { fill: "rgba(255, 255, 0, 0.5)"});
      box.pos.set(x, y);
      this.children = [box];
    }
  }

  trigger() {
    if (this.onCollide) {
      this.onCollide();
    }
  }
}

export default Trigger;
