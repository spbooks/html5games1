import pop from "../../pop/index.js";
const { math, Sprite, Texture } = pop;

const texture = new Texture("res/images/cloud.png");

class Cloud extends Sprite {
  constructor (pos, life = 1) {
    super(texture);
    this.life = life;
    this.pos.x = pos.x - 16;
    this.pos.y = pos.y - 16;
  }

  update (dt) {
    // Jiggle!
    this.pos.x += math.randf(-1, 1);
    this.pos.y += math.randf(-1, 1);

    if ((this.life -= dt) < 0) {
      this.dead = true;
    }
  }

}

export default Cloud;
