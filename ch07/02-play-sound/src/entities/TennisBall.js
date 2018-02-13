import pop from "../../pop/index.js";
const { Texture, Sprite, Vec } = pop;

const texture = new Texture("res/images/tennis_ball.png");

class TennisBall extends Sprite {
  constructor(speed) {
    super(texture);
    this.rad = 70;
    this.vel = new Vec(speed, 0);
  }
}

export default TennisBall;
