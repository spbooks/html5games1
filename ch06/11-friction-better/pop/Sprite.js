import Vec from "./utils/Vec.js";

class Sprite {
  constructor(texture) {
    this.texture = texture;
    this.pos = new Vec();
    this.anchor = { x: 0, y: 0 };
    this.scale = { x: 1, y: 1 };
    this.pivot = { x: 0, y: 0 };
    this.rotation = 0;
  }
}

export default Sprite;
