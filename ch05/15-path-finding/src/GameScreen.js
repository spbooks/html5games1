import pop from "../pop/index.js";
const { Container, entity, math, State, Text } = pop;
import Level from "./Level.js";
import Player from "./entities/Player.js";
import Pickup from "./entities/Pickup.js";
import Bat from "./entities/Bat.js";
import Totem from "./entities/Totem.js";
import Ghost from "./entities/Ghost.js";

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
    player.pos.y -= 1;

    this.state = new State("READY");

    this.map = this.add(map);
    this.pickups = this.add(new Container());
    this.player = this.add(player);

    const baddies = new Container();
    for (let i = 0; i < 3; i++) {
      this.randoBat(baddies.add(new Bat(player)));
    }
    this.baddies = this.add(baddies);

    // Add a couple of Top-Hat Totems
    for (let i = 0; i < 2; i++) {
      const t = this.add(new Totem(player, b => baddies.add(b)));
      const { x, y } = map.findFreeSpot(false); // `false` means "NOT free"
      t.pos.x = x;
      t.pos.y = y;
    }

    const ghost = this.add(new Ghost(player, map));
    ghost.pos.x = 100;
    ghost.pos.y = 100;
    ghost.findPath();
    this.ghost = ghost;

    this.populate();
    this.score = 0;
    this.scoreText = this.add(
      new Text("0", {
        font: "40pt 'Luckiest Guy', san-serif",
        fill: "#fff",
        align: "center"
      })
    );
    this.scoreText.pos = { x: game.w / 2, y: game.h / 2 - 40 };
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
    const { controls, player, state } = this;

    switch (state.get()) {
      case "READY":
        if (state.first) {
          this.scoreText.text = "GET READY";
        }
        if (state.time > 2) {
          this.scoreText.text = "0";
          state.set("PLAYING");
        }
        break;

      case "PLAYING":
        super.update(dt, t);
        this.updatePlaying();
        break;

      case "GAMEOVER":
        if (state.first) {
          player.gameOver = true;
          this.scoreText.text = "DEAD. Score: " + this.score;
        }
        super.update(dt, t);

        // If player dead, wait for space bar
        if (player.gameOver && controls.action) {
          this.onGameOver();
        }
        break;
    }

    state.update(dt);
  }

  updatePlaying() {
    const { baddies, player, ghost, pickups, state } = this;
    baddies.map(baddie => {
      if (entity.hit(player, baddie)) {
        state.set("GAMEOVER");
        baddie.dead = true;
      }
    });

    if (entity.hit(player, ghost)) {
      player.gameOver = true;
      state.set("GAMEOVER");
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
