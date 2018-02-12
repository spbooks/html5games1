class Rect {
  constructor(w, h, style = { fill: "#333" }) {
    this.pos = { x: 0, y: 0 };
    this.w = w;
    this.h = h;
    this.style = style;
  }
}

export default Rect;
