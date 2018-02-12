import pop from "../../pop/index.js";
const { TileSprite, Texture } = pop;

const texture = new Texture("res/images/pickups.png");

const pickups = {
  bomb: { frames: [[3, 0], [3, 1]], life: 10 },
  death: { frames: [[0, 0], [1, 0]], life: 30 },
  shoes: { frames: [[1, 1]], life: 10 }
};

class Pickup extends TileSprite {
  constructor(name) {
    super(texture, 32, 32);
    this.name = name;
    this.frames = pickups[name].frames.map(([x, y]) => ({ x, y }));
    this.liveForever = false;
    this.life = pickups[name].life;
    this.speed = 100;
  }

  update(dt, t) {
    const { frames, speed, liveForever } = this;
    this.frame = frames[Math.floor(t / speed) % frames.length];

    if (liveForever) return;
    const life = (this.life -= dt);
    if (life < 2) {
      this.visible = (t / 0.1 | 0) % 2;
    }
    if (life < 0) {
      this.dead = true;
    }
  }
}

Pickup.pickups = Object.keys(pickups);

export default Pickup;
