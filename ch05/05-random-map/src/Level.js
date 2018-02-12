import pop from "../pop/index.js";
const { TileMap, Texture, math } = pop;

const texture = new Texture("res/images/bravedigger-tiles.png");

class Level extends TileMap {
  constructor(w, h) {
    const tileSize = 48;
    const mapW = Math.floor(w / tileSize);
    const mapH = Math.floor(h / tileSize);

    const tileIndexes = [
      { id: "empty", x: 1, y: 2 },
      { id: "wall", x: 2, y: 2 }
    ];

    // Make a random dungeon
    const level = Array(mapW * mapH).fill(0);
    for (let y = 0; y < mapH; y++) {
      for (let x = 0; x < mapW; x++) {
        // Define the dungeon walls
        level[y * mapW + x] = math.randOneFrom([0, 0, 1]);
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
}

export default Level;
