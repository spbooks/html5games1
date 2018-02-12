import pop from "../pop/index.js";
const { Game, Texture, TileSprite, math } = pop;

const game = new Game(640, 320);
const { scene, w, h } = game;

const texture = new Texture("res/images/player-walk.png");
const squizz = scene.add(new TileSprite(texture, 32, 32));
squizz.pos = { x: w / 2, y: h / 2};

game.run(() => {
  // Randomly change x frame:
  if (math.randOneIn(20)) {
    squizz.frame.x = math.rand(3);
  }
});
