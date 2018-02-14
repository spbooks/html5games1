import pop from "../../pop/index.js";
const { Camera, Container, entity, OneUp, State, Text, Texture, TileSprite, } = pop;
import Level from "../Level.js";
import Player from "../entities/Player.js";
import Pickup from "../entities/Pickup.js";
import Bat from "../entities/Bat.js";
import Totem from "../entities/Totem.js";

const texture = new Texture("res/images/bravedigger-tiles.png");

class GameScreen extends Container {
  constructor(game, controls, onGameOver) {
    super();
    this.w = game.w;
    this.h = game.h;
    this.controls = controls;
    this.onGameOver = onGameOver;
    this.state = new State("READY");

    // Map, player, camera
    const map = new Level(game.w, game.h);
    const player = new Player(controls, map);
    player.pos.x = map.spawns.player.x;
    player.pos.y = map.spawns.player.y;

    const camera = new Camera(
      player,
      { w: game.w, h: game.h },
      { w: map.w, h: map.h }
    );
    this.camera = this.add(camera);
    this.map = camera.add(map);
    this.pickups = camera.add(new Container());
    this.player = camera.add(player);

    // Bats
    const baddies = new Container();
    map.spawns.bats.forEach(({x, y}) => {
      const bat = baddies.add(new Bat(player));
      bat.pos.x = x;
      bat.pos.y = y;
    });
    this.baddies = camera.add(baddies);

    // Totems
    map.spawns.totems.forEach(({ x, y }) => {
      const t = camera.add(new Totem(player, b => baddies.add(b)));
      t.pos.x = x;
      t.pos.y = y;
    });

    // Pickups
    this.populate();

    // Score
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

  gotPickup(pickup) {
    const { camera, player, pickups } = this;
    this.score++;
    pickup.dead = true;

    camera.shake();
    camera.flash();

    // Make a coin to OneUp.
    const coin = new TileSprite(texture, 48, 48);
    coin.anims.add("spin", [5, 6, 7, 8].map(x => ({ x, y: 4 })), 0.1);
    coin.anims.play("spin");
    // OneUp it!
    const one = this.add(new OneUp(coin));
    one.pos.copy(player.pos);

    if (pickups.children.length === 1) {
      this.populate();
      this.score += 5;
    }
    this.scoreText.text = this.score;
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
        this.updatePlaying(dt, t);
        break;

      case "GAMEOVER":
        if (state.first) {
          player.gameOver = true;
        }
        super.update(dt, t);

        // If player dead, wait for space bar
        if (player.gameOver && controls.keys.action) {
          this.onGameOver();
        }
        break;
    }

    state.update(dt);
  }

  updatePlaying(dt, t) {
    const { baddies, player, pickups, state } = this;

    baddies.map(b => {
      // Unkillable while we test
      // if (entity.hit(player, b)) {
      //   state.set("GAMEOVER");
      // }
    });

    // Collect pickup!
    entity.hits(player, pickups, pickup => this.gotPickup(pickup));
  }
}

export default GameScreen;
