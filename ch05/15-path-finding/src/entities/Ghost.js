import pop from "../../pop/index.js";
const { Texture, TileSprite, entity } = pop;

const texture = new Texture("res/images/bravedigger-tiles.png");

class Ghost extends TileSprite {
  constructor(target, map) {
    super(texture, 48, 48);
    this.hitBox = {
      x: 6,
      y: 3,
      w: 32,
      h: 32
    };
    this.frame.x = 5;
    this.frame.y = 1;
    this.speed = 100;
    this.target = target;
    this.waypoint = null;
    this.map = map;
  }

  findPath() {
    // Calculate the path-finding path
    const { map, target } = this;
    const s = map.pixelToMapPos(entity.center(this));
    const d = map.pixelToMapPos(entity.center(target));
    const start = performance.now();
    const s2 = Date.now();
    map.path.findPath(s.x, s.y, d.x, d.y, path => {
      this.path = path || [];
      const end = performance.now();
      console.log(`Pathfinding took ${end - start} ms`, Date.now() - s2);
      // Pathfinding took 13.8799999999992 ms
    });
    map.path.calculate();
  }

  followPath(dt) {
    const { map, speed, path, pos, hitBox } = this;
    // Move along the path
    if (!path.length) {
      return;
    }

    const cell = this.path[0];
    // Move in the direction of the path
    const xo = cell.x * map.tileW - (pos.x - hitBox.x);
    const yo = cell.y * map.tileH - (pos.y - hitBox.y);

    const closeX = Math.abs(xo) <= 2;
    const closeY = Math.abs(yo) <= 2;
    if (!closeX) pos.x += Math.sign(xo) * speed * dt;
    if (!closeY) pos.y += Math.sign(yo) * speed * dt;

    // If you made it, move to the next path element
    if (closeX && closeY) {
      this.path = path.slice(1);
      if (this.path.length === 0) {
        this.findPath();
      }
    }
  }

  update(dt, t) {
    const { pos } = this;
    this.followPath(dt);
    // Bob spookily
    pos.y += Math.sin(t / 0.1) * 0.5;
  }
}

export default Ghost;
