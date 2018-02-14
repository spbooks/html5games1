import pop from "../../pop/index.js";
const { Texture, TileSprite } = pop;

const texture = new Texture("res/images/bravedigger-tiles.png");

class Pickup extends TileSprite {
  constructor() {
    super(texture, 48, 48);
    this.hitBox = {
      x: 2,
      y: 22,
      w: 44,
      h: 26
    };
    this.frame.x = 5;
    this.frame.y = 2;
  }
}

export default Pickup;
