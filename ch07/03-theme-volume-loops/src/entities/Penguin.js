import pop from "../../pop/index.js";
const { Texture, TileSprite, Vec } = pop;

//import { Body, Bodies } from "matter-js";
import Matter from "../../vendor/matter.js"; // Using local version for native module support.
const { Body, Bodies } = Matter;

const texture = new Texture("res/images/pengolfuin.png");

class Penguin extends TileSprite {
  constructor(pos) {
    super(texture, 32, 32);
    this.pivot.x = this.w / 2;
    this.pivot.y = this.h / 2;
    this.anchor = Vec.from(this.pivot).multiply(-1);

    this.body = Bodies.circle(pos.x, pos.y, 10, {
      restitution: 0.7
    });
    this.body.torque = 0.0002;
  }

  fire(angle, power) {
    const { body } = this;
    Body.applyForce(
      body,
      { x: body.position.x, y: body.position.y - 10 },
      { x: Math.cos(angle) * power, y: Math.sin(angle) * power }
    );
  }

  update() {
    // Sync the physics body
    const { pos, body } = this;
    this.rotation = body.angle;
    pos.copy(body.position);//.subtract(pivot);
  }
}

export default Penguin;
