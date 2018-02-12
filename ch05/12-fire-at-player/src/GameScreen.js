import pop from "../pop/index.js";
const { Container, entity, math, Text } = pop;
import Level from "./Level.js";
import Player from "./entities/Player.js";
import Pickup from "./entities/Pickup.js";
import Bat from "./entities/Bat.js";
import Totem from "./entities/Totem.js";

class GameScreen extends Container {
  constructor(game, controls, onGameOver) {
    super();
    this.w = game.w;
    this.h = game.h;
    this.controls = controls;
    this.onGameOver = onGameOver;
    const map = new Level(game.w, game.h);
    const player = new Player(controls, map);
    player.pos = map.findFreeSpot();

    this.map = this.add(map);
    this.pickups = this.add(new Container());
    this.player = this.add(player);

    const baddies = new Container();
    for (let i = 0; i < 3; i++) {
      this.randoBat(baddies.add(new Bat(() => map.findFreeSpot(false))));
    }
    this.baddies = this.add(baddies);

    // Add a couple of Top-Hat Totems
    for (let i = 0; i < 2; i++) {
      const t = this.add(new Totem(player, b => baddies.add(b)));
      const { x, y } = map.findFreeSpot(false); // `false` means "NOT free"
      t.pos.x = x;
      t.pos.y = y;
    }

    this.populate();
    this.score = 0;
    this.scoreText = this.add(
      new Text("0", {
        font: "40pt 'Luckiest Guy', san-serif",
        fill: "#fff",
        align: "center"
      })
    );
    this.scoreText.pos = { x: game.w / 2, y: 180 };
  }

  populate() {
    const { pickups, map } = this;
    for (let i = 0; i < 5; i++) {
      const p = pickups.add(new Pickup());
      p.pos = map.findFreeSpot();
    }
  }

  randoBat(bat) {
    const { w, h } = this;
    const angle = math.randf(Math.PI * 2);
    bat.pos.x = Math.cos(angle) * 300 + w / 2;
    bat.pos.y = Math.sin(angle) * 300 + h / 2;
    bat.speed = math.rand(70, 150);
    return bat;
  }

  update(dt, t) {
    super.update(dt, t);
    const { controls, baddies, player, pickups } = this;

    baddies.map(b => {
      if (entity.hit(player, b)) {
        player.gameOver = true;
      }
    });

    // If player dead, wait for space bar
    if (player.gameOver && controls.action) {
      this.onGameOver();
    }

    // Collect pickup!
    entity.hits(player, pickups, p => {
      p.dead = true;
      this.score++;
      if (pickups.children.length === 1) {
        this.populate();
        this.score += 5;
      }
      this.scoreText.text = this.score;
    });
  }
}

export default GameScreen;
