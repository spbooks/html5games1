import Vec from "./utils/Vec.js";

class Rect {
  constructor(w, h, style = { fill: "#333" }) {
    this.pos = new Vec();
    this.w = w;
    this.h = h;
    this.style = style;
  }
}

export default Rect;
