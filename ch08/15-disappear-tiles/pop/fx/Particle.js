import Container from "../Container.js";
import Rect from "../Rect.js";
import Vec from "../utils/Vec.js";
import math from "../utils/math.js";

class Particle extends Container {
  constructor(display) {
    super(8, 8, { fill: "#f00" });
    this.pos = new Vec();
    this.vel = new Vec();
    this.alpha = this.life = 0;
    this.add(display || new Rect(10, 10, { fill: "#900" }));
  }
  reset () {
    this.vel.set(math.randf(-5, 5), math.randf(-5, -10));
    this.life = math.randf(0.8, 1.5);
    this.pos.set(0, 0);
  }
  update(dt) {
    const { pos, vel, life } = this;
    if (life < 0) {
      return;
    }
    this.life -= dt;

    pos.add(vel);
    vel.add({x: 0, y: 30 * dt});
    this.alpha = life;
  }
}

export default Particle;
