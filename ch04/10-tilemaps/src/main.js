import pop from "../pop/index.js";
const { Game, Texture, TileMap, math } = pop;

const game = new Game(640, 320);
const { scene, w, h } = game;

const texture = new Texture("res/images/tiles.png");
const tileSize = 32;
const mapW = Math.floor(w / tileSize);
const mapH = Math.floor(h / tileSize);

// Make a random level of tile indexes
const level = [];
for (let y = 0; y < mapH; y++) {
  for (let x = 0; x < mapW; x++) {
    level.push({
      x: math.rand(5),
      y: math.rand(2)
    });
  }
}

const map = new TileMap(level, mapW, mapH, tileSize, tileSize, texture);

scene.add(map);
game.run();
