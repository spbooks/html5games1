import pop from "../../pop/index.js";
const { Texture, TileSprite } = pop;

const texture = new Texture("res/images/bravedigger-tiles.png");

class Ghost extends TileSprite {
  constructor(map) {
    super(texture, 48, 48);
    this.type = "Ghost";
    this.hitBox = {
      x: 6,
      y: 3,
      w: 32,
      h: 32
    };
    this.frame.x = 5;
    this.frame.y = 1;
    this.anchor = { x: 0, y: 0 };
    this.vel = {
      x: 50,
      y: 0
    };
    this.map = map;
    this.hp = 5;
  }

  hit(power = 1) {
    this.hp -= power;
    if (this.hp <= 0) {
      this.dead = true;
      return true;
    }
    return false;
  }

  update(dt, t) {
    const { pos, vel, map, w, h } = this;
    pos.x += vel.x * dt;
    pos.y += vel.y * dt;

    // Face direction
    this.anchor.y += Math.sin(t * 10) * 0.1;
    this.anchor.x = vel.x > 0 ? w : 0;
    this.scale.x = vel.x > 0 ? -1 : 1;

    // Check for edge of platform
    const xo = vel.x < 0 ? 0 : w;
    const [nextTo, under] = [0, h].map(yo => {
      const p = map.pixelToMapPos({ x: pos.x + xo, y: pos.y + yo });
      const f = map.tileAtMapPos(p).frame;
      return f.walkable && !f.cloud;
    });
    // Hit edge of platform!
    if (!nextTo || under) {
      vel.x *= -1;
    }
  }

  serialize() {
    const { pos, vel, type } = this;
    return {
      type,
      x: pos.x,
      y: pos.y,
      properties: {
        speed: vel.x
      }
    };
  }
}

export default Ghost;
