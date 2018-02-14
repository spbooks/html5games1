import Container from "../Container.js";
import Rect from "../Rect.js";
import Vec from "../utils/Vec.js";

class OneUp extends Container {
  constructor(display, speed = 2, duration = 1) {
    super();
    this.pos = new Vec();
    this.vel = new Vec(0, -speed);
    this.duration = duration;
    this.life = duration;
    this.add(display || new Rect(40, 30, { fill: "#ff0" }));
  }
  update(dt) {
    super.update(dt);
    const { life, duration, pos, vel } = this;
    this.alpha = life / duration;

    pos.add(vel);

    if ((this.life -= dt) <= 0) {
      this.dead = true;
    }
  }
}

export default OneUp;
