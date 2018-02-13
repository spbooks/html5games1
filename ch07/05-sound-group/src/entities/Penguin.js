import pop from "../../pop/index.js";
const { Sound, SoundGroup, Texture, TileSprite, Vec } = pop;

//import { Body, Bodies } from "matter-js";
import Matter from "../../vendor/matter.js"; // Using local version for native module support.
const { Body, Bodies } = Matter;

const texture = new Texture("res/images/pengolfuin.png");
const squawk = new SoundGroup([
  new Sound("res/sounds/squawk1.mp3", { volume: 0.7 }),
  new Sound("res/sounds/squawk2.mp3", { volume: 0.7 }),
  new Sound("res/sounds/squawk3.mp3", { volume: 0.7 }),
  new Sound("res/sounds/squawk4.mp3", { volume: 0.7 }),
  new Sound("res/sounds/squawk5.mp3", { volume: 0.7 })
]);

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
    this.lastSquawk = Date.now();
  }

  collide(speed) {
    const { lastSquawk } = this;
    if (speed > 1 && Date.now() - lastSquawk > 100) {
      // Play a squawk
      squawk.play();
      this.lastSquawk = Date.now();
    }
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
