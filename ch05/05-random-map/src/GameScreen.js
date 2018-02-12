import pop from "../pop/index.js";
const { Container } = pop;
import Level from "./Level.js";
import Player from "./entities/Player.js";

class GameScreen extends Container {
  constructor (game, controls) {
    super();
    this.w = game.w;
    this.h = game.h;
    const map = new Level(game.w, game.h);
    const player = new Player(controls, map);
    player.pos.x = 48;
    player.pos.y = 48;

    this.map = this.add(map);
    this.player = this.add(player);
  }
}

export default GameScreen;
