import pop from "../pop/index.js";
const { Container, entity } = pop;
import Level from "./Level.js";
import Player from "./entities/Player.js";
import Pickup from "./entities/Pickup.js";

class GameScreen extends Container {
  constructor (game, controls) {
    super();
    this.w = game.w;
    this.h = game.h;
    const map = new Level(game.w, game.h);
    const player = new Player(controls, map);
    player.pos = map.findFreeSpot();

    this.map = this.add(map);
    this.pickups = this.add(new Container());
    this.player = this.add(player);

    this.populate();
  }

  populate() {
    const { pickups, map } = this;
    for (let i = 0; i < 5; i++) {
      const p = pickups.add(new Pickup());
      p.pos = map.findFreeSpot();
    }
  }

  update(dt, t) {
    super.update(dt, t);
    const { player, pickups } = this;
    // Collect pickup!
    entity.hits(player, pickups, p => {
      p.dead = true;
      if (pickups.children.length === 1) {
        this.populate();
      }
    });
  }
}

export default GameScreen;
