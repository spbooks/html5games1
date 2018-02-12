import Sprite from "./Sprite.js";

class TileSprite extends Sprite {
  constructor(texture, w, h) {
    super(texture);
    this.tileW = w;
    this.tileH = h;
    this.frame = { x: 0, y: 0 };
  }

  get w() {
    return this.tileW * Math.abs(this.scale.x);
  }

  get h() {
    return this.tileH * Math.abs(this.scale.y);
  }
}

export default TileSprite;
