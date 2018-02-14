import pop from "../../pop/index.js";
const { Camera, Container, TileSprite, TileMap, Texture, math } = pop;

const texture = new Texture("res/images/bravedigger-tiles.png");

class GameScreen extends Container {
  constructor(game, controls) {
    super();

    const player = new TileSprite(texture, 48, 48);
    player.frame.x = 1;

    const mapW = 1000;
    const mapH = 100;

    const map = new TileMap(
      [...Array(mapW * mapH)].map(() => ({
        x: math.rand(0, 3),
        y: math.rand(1, 3)
      })),
      mapW,
      mapH,
      48,
      48,
      texture
    );

    player.pos.set(map.w / 2, map.h / 2);

    this.controls = controls;
    this.game = game;
    this.camera = this.add(
      new Camera(null, { w: game.w, h: game.h }, { w: map.w, h: map.h })
    );

    this.camera.setSubject(player);
    this.camera.add(map);
    this.player = this.camera.add(player);

  }

  update(dt, t) {
    const { controls, player } = this;
    const { keys } = controls;
    super.update(dt, t);

    player.pos.x += keys.x * 400 * dt;
    player.pos.y += keys.y * 400 * dt;
  }
}

export default GameScreen;
