import pop from "../../pop/index.js";
const { entity, Texture, TileSprite, math, State } = pop;
import Bullet from "./Bullet.js";

const texture = new Texture("res/images/bravedigger-tiles.png");

class Totem extends TileSprite {
  constructor(target, onFire) {
    super(texture, 48, 48);
    this.frame.x = 2;
    this.frame.y = 1;
    this.target = target;
    this.onFire = onFire;
    this.fireIn = 0;
    this.state = new State("IDLE");
  }

  update(dt, t) {
    const { state, frame, target } = this;
    let distance;
    switch (state.get()) {
      case "IDLE":
        distance = entity.distance(target, this);
        frame.x = distance < 180 ? 1 : 2;
        if (distance < 180 && math.randOneIn(250)) {
          state.set("WINDUP");
        }
        break;
      case "WINDUP":
        frame.x = [0, 1][((t / 0.1) | 0) % 2];
        if (state.time > 1) {
          this.fireAtTarget();
          state.set("IDLE");
        }
        break;
    }
    state.update(dt);
  }

  fireAtTarget() {
    const { target, onFire } = this;
    const totemPos = entity.center(this);
    const targetPos = entity.center(target);
    const angle = math.angle(targetPos, totemPos);

    const x = Math.cos(angle);
    const y = Math.sin(angle);

    const bullet = new Bullet({ x, y });
    bullet.pos.x = totemPos.x - bullet.w / 2;
    bullet.pos.y = totemPos.y - bullet.h / 2;
    bullet.speed = 300;

    onFire(bullet);
  }
}

export default Totem;
