import pop from "../../pop/index.js";
const {
  Assets,
  Camera,
  Container,
  entity,
  OneUp,
  State,
  Text,
  Texture,
  TileSprite,
  Timer,
  ParticleEmitter
} = pop;
import TiledLevel from "../TiledLevel.js";
import Player from "../entities/Player.js";
import Pickup from "../entities/Pickup.js";
import Bat from "../entities/Bat.js";
import Door from "../entities/Door.js";
import Ghost from "../entities/Ghost.js";
import Spikes from "../entities/Spikes.js";
import Totem from "../entities/Totem.js";

const texture = new Texture("res/images/bravedigger-tiles.png");

class GameScreen extends Container {
  constructor(game, controls, gameState, screens) {
    super();
    this.game = game;
    this.controls = controls;
    this.gameState = gameState;
    this.screens = screens;

    this.state = new State("LOADING");
    this.score = 0;

    this.camera = this.add(new Camera(null, { w: game.w, h: game.h }));
    this.hud = this.add(new Container());

    this.addAfter = [];

    // Score
    this.scoreText = this.add(
      new Text("0", {
        font: "40pt 'Luckiest Guy', san-serif",
        fill: "#fff",
        align: "center"
      })
    );
    this.scoreText.pos = { x: game.w / 2, y: game.h / 2 - 40 };

    // Either load from url or memory
    const levelUrl = `res/levels/bd_level0${gameState.level}.json?c=${Date.now()}`;
    const serialized = gameState.data[gameState.level];
    const level = serialized
      ? Promise.resolve(serialized)
      : Assets.json(levelUrl);

    level.then(json => this.setupLevel(json, !!serialized)).then(() => {
      // Level is loaded
      this.loaded = true;
      if (gameState.spawn) {
        this.player.pos.copy(this.map.mapToPixelPos(gameState.spawn));
      }
    });
  }

  populate() {
    const { pickups, map } = this;
    for (let i = 0; i < 5; i++) {
      const p = pickups.add(new Pickup());
      p.pos = map.findFreeSpot();
    }
  }

  setupLevel(json, parsed) {
    const { camera, controls, gameState } = this;

    const map = new TiledLevel(json, parsed);
    const player = new Player(controls, map, gameState.hp);
    player.pos.copy(map.spawns.player);

    camera.worldSize = { w: map.w, h: map.h };
    camera.setSubject(player);

    // Add the layers in the correct Z order
    this.map = camera.add(map);
    this.triggers = camera.add(new Container());
    this.pickups = camera.add(new Container());
    this.player = camera.add(player);
    this.baddies = camera.add(new Container());
    this.bullets = camera.add(new Container());
    this.fx = camera.add(new Container());

    // Add level pickups
    map.spawns.pickups.forEach(p => {
      const pickup = this.pickups.add(new Pickup());
      pickup.pos.copy(p);
    });

    // Add level bad guys
    map.spawns.baddies.forEach(data => {
      const { type, x, y, properties = {} } = data;
      const b = this.baddies.add(this.makeBaddie(type));
      if (properties.speed) {
        b.vel.x = properties.speed;
      }
      b.pos.set(x, y);
    });

    // Add level doors
    map.spawns.doors.forEach(door => {
      const d = this.triggers.add(this.makeDoor(door));
      d.pos.copy(door);
    });

    const p = new TileSprite(texture, 48, 48);
    p.scale.x = 0.4;
    p.scale.y = 0.4;
    p.frame.x = 6;
    p.frame.y = 2;

    this.pe = this.fx.add(new ParticleEmitter(25, p));
  }

  makeBaddie(type) {
    const { baddies, player, map } = this;
    let e;
    switch (type) {
      case "Totem":
        e = new Totem(player, b => {
          this.addAfter.push(b);
          return b;//return baddies.add(b);
        });
        break;
      case "Ghost":
        e = new Ghost(map);
        break;
      case "Spikes":
        e = new Spikes();
        break;
      case "Bat":
        e = new Bat(player);
        break;
      default:
        console.warn("Sorry, I don't know that bad guy:", type);
    }
    return e;
  }

  makeDoor(door) {
    const { gameState, map, screens, player } = this;

    const { toLevel, spawnX, spawnY } = door.properties;
    const t = new Door(door.properties, () => {
      gameState.doors[toLevel] = true;
      gameState.data[gameState.level] = map.serialize(this);
      gameState.hp = player.hp;
      screens.onLevel(toLevel, false, {
        x: spawnX,
        y: spawnY
      });
    });

    // Set door tile
    const doorOpen = gameState.doors[toLevel];
    const tile = map.tileAtPixelPos(door);
    tile.frame.walkable = doorOpen;
    tile.frame.x = doorOpen ? 1 : 0;
    tile.frame.y = 4;

    return t;
  }

  gotPickup(pickup) {
    const { camera, player, pickups } = this;
    this.score++;
    pickup.dead = true;
    player.invincible = 0.6;

    // Make a coin to OneUp.
    const coin = new TileSprite(texture, 48, 48);
    coin.anims.add("spin", [5, 6, 7, 8].map(x => ({ x, y: 4 })), 0.1);
    coin.anims.play("spin");
    // OneUp it!
    const one = this.fx.add(new OneUp(coin));
    one.pos.copy(player.pos);

    if (pickups.children.length === 1) {
      camera.flash();
      this.score += 5;
      this.openDoors();
    }
    this.scoreText.text = this.score;
  }

  openDoors() {
    const { map, gameState } = this;
    map.spawns.doors.forEach(door => {
      const frame = this.map.tileAtPixelPos(door).frame;
      gameState.doors[door.properties.toLevel] = true;
      frame.x = 1;
      frame.y = 4;
      frame.walkable = true;
    });
  }

  playerWasHit(baddie) {
    const { player, pe, game, camera } = this;

    if (baddie.type === "Spikes" && !baddie.deadly) {
      return;
    }

    if (player.hitBy(baddie)) {
      pe.play(entity.center(player));
      //this.setHearts();
      if (player.gameOver) {
        this.state.set("GAMEOVER");
      }
      camera.shake(9);

      // Hit lag.
      this.add(
        new Timer(
          0.5,
          p => (game.speed = (1 - p) * 2 + 1),
          () => (game.speed = 1)
        )
      );
    }

    switch (baddie.type) {
      case "Bullet":
        baddie.dead = true;
        break;
    }
  }

  update(dt, t) {
    const { controls, player, state } = this;
    const { keys } = controls;

    switch (state.get()) {
      case "LOADING":
        this.scoreText.text = "...";
        if (this.loaded) {
          state.set("READY");
        }
        break;

      case "READY":
        if (state.first) {
          this.game.speed = 1;
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
        if (keys.action) {
          this.screens.onReset();
        }
        break;
    }

    // TMP hack! Will explain soon...
    if (this.addAfter.length) {
      this.addAfter.forEach(b => this.baddies.add(b));
      this.addAfter = [];
    }

    state.update(dt);
  }

  updatePlaying() {
    const { baddies, player, pickups, triggers } = this;

    baddies.map(b => {
      // Baddie hit the player
      if (entity.hit(player, b)) {
        this.playerWasHit(b);
      }
    });

    // Touched a door
    entity.hits(player, triggers, trigger => trigger.trigger());

    // Collect pickup!
    entity.hits(player, pickups, pickup => this.gotPickup(pickup));
  }
}

export default GameScreen;
