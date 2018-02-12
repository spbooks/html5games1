import pop from "../../pop/index.js";
const { TileSprite, Texture, math } = pop;

const texture = new Texture("res/images/player-walk.png");

class Squizz extends TileSprite {
  constructor(controls) {
    super(texture, 32, 32);
    this.controls = controls;
    this.anchor = { x: -16, y: 16 };
    this.speed = math.randf(0.9, 1.2);

    // Set up the different animations
    const { anims } = this;
    anims.add("walk", [0, 1, 2, 3].map(x => ({ x, y: 0 })), 0.07 * this.speed);
    anims.add(
      "idle",
      [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 1 }, { x: 4, y: 0 }],
      0.15 * this.speed
    );

    // Play one of them!
    anims.play("walk");
  }

  update(dt) {
    super.update(dt);

    const { pos, scale, speed, anchor, anims, controls } = this;
    const { x } = controls;

    pos.x += x * dt * 100 * speed;

    // Set correct animation depending on controls
    if (x) {
      anims.play("walk");
      // Flip to correct direction
      scale.x = Math.sign(x);
      anchor.x = scale.x > 0 ? -16 : 16;
    } else {
      anims.play("idle");
    }
  }
}

export default Squizz;
