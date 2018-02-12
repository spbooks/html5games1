import pop from "../pop/index.js";
const { TileMap, Texture, math } = pop;

const texture = new Texture("res/images/bravedigger-tiles.png");

class Level extends TileMap {
  constructor(w, h) {
    const tileSize = 48;
    const mapW = Math.floor(w / tileSize);
    const mapH = Math.floor(h / tileSize);

    const tileIndexes = [
      { id: "empty", x: 0, y: 2, walkable: true },
      { id: "wall", x: 2, y: 2 },
      { id: "wall_end", x: 3, y: 2 }
    ];
    const getTile = id => tileIndexes.find(t => t.id == id);
    const getIdx = id => tileIndexes.indexOf(getTile(id));

    // Make a random dungeon
    const level = Array(mapW * mapH).fill(getIdx("empty"));
    for (let y = 0; y < mapH; y++) {
      for (let x = 0; x < mapW; x++) {
        // Map borders
        if (y === 0 || x === 0 || y === mapH - 1 || x === mapW - 1) {
          level[y * mapW + x] = getIdx("wall");
          continue;
        }
        // Grid points - randomly skip some to make "rooms"
        if (y % 2 || x % 2 || math.randOneIn(4)) {
          continue;
        }
        level[y * mapW + x] = 1;
        // Side walls - pick a random direction
        const [xo, yo] = math.randOneFrom([[0, -1], [0, 1], [1, 0], [-1, 0]]);
        level[(y + yo) * mapW + (x + xo)] = getIdx("wall");
      }
    }

    // "3d-ify" if no wall below a tile
    for (let y = 0; y < mapH - 1; y++) {
      for (let x = 0; x < mapW; x++) {
        const below = level[(y + 1) * mapW + x];
        const me = level[y * mapW + x];
        if (me === getIdx("wall") && below !== getIdx("wall")) {
          level[y * mapW + x] = getIdx("wall_end");
        }
      }
    }

    super(
      level.map(i => tileIndexes[i]),
      mapW,
      mapH,
      tileSize,
      tileSize,
      texture
    );
  }

  findFreeSpot(isFree = true) {
    const { mapW, mapH } = this;
    let found = false;
    let x, y;
    while (!found) {
      x = math.rand(mapW);
      y = math.rand(mapH);
      const { frame } = this.tileAtMapPos({ x, y });
      if (!!frame.walkable == isFree) {
        found = true;
      }
    }
    return this.mapToPixelPos({ x, y });
  }
}

export default Level;
