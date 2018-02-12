import pop from "../pop/index.js";
const { Container, entity, math } = pop;
import Level from "./Level.js";
import Player from "./entities/Player.js";
import Pickup from "./entities/Pickup.js";
import Bat from "./entities/Bat.js";

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

    const bats = this.add(new Container());
    for (let i = 0; i < 5; i++) {
      this.randoBat(bats.add(new Bat(() => map.findFreeSpot())));
    }
    this.bats = bats;

    this.populate();
  }

  populate() {
    const { pickups, map } = this;
    for (let i = 0; i < 5; i++) {
      const p = pickups.add(new Pickup());
      p.pos = map.findFreeSpot();
    }
  }

  randoBat(bat) {
    bat.pos.x = this.w * math.randf(1, 2);
    bat.pos.y = math.rand(10) * 32;
    bat.speed = math.rand(150, 230);
    return bat;
  }

  update(dt, t) {
    super.update(dt, t);
    const { bats, player, pickups } = this;

    bats.map(bat => {
      if (entity.hit(player, bat)) {
        player.gameOver = true;
      }
      if (bat.pos.x < -32) {
        this.randoBat(bat);
      }
    });

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
