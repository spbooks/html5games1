import pop from "../../pop/index.js";
const { Camera, Container, Text, Texture, TileSprite, math, entity } = pop;
import Level from "../Level.js";
import Squizz from "../entities/Squizz.js";
import Baddie from "../entities/Baddie.js";

const SCORE_PELLET = 8;

const textures = {
  squizz: new Texture("res/images/player-walk.png")
};

class GameScreen extends Container {
  constructor(game, controls, gameOver) {
    super();
    this.gameOver = gameOver;

    const level = new Level(game.w * 3, game.h * 2);
    const squizz = new Squizz(controls);
    squizz.pos = {
      x: (level.w / 2) | 0,
      y: (level.h / 2) | 0
    };

    const camera = this.add(
      new Camera(
        squizz,
        { w: game.w, h: game.h },
        { w: level.w, h: level.h },
        0.08
      )
    );

    // Add roaming baddies
    this.baddies = this.addBaddies(level);

    // Add it all to the game camera
    camera.add(level);
    camera.add(this.baddies);
    camera.add(squizz);

    // Add static graphic elements
    this.gui = this.createGUI(game);

    this.stats = {
      pellets: 0,
      maxPellets: level.totalFreeSpots,
      lives: 3,
      score: 0
    };

    this.updateLivesIcons();

    // Keep references to things we need in "update"
    this.level = level;
    this.camera = camera;
    this.squizz = squizz;
  }

  addBaddies(level) {
    const baddies = new Container();
    // Horizontal baddies
    for (let i = 0; i < 5; i++) {
      const b = baddies.add(new Baddie(200, 0));
      b.pos.y = ((level.h / 5) | 0) * i + level.tileH * 2;
    }
    // Vertical baddies
    for (let i = 0; i < 10; i++) {
      const b = baddies.add(new Baddie(0, 200));
      b.pos.x = ((level.w / 10) | 0) * i + level.tileW;
    }
    return baddies;
  }

  addScore(score) {
    const { stats, gui } = this;
    const complete = stats.pellets / stats.maxPellets * 100;

    stats.score += score;
    gui.score.text = stats.score;
    gui.complete.text = `${complete.toFixed(1)}%`;
  }

  createGUI(game) {
    const font = { font: "28pt 'VT323', monospace", fill: "#5f0" };
    const complete = this.add(new Text("", font));
    const score = this.add(new Text("", Object.assign({ align: "center"}, font)));
    complete.pos = { x: 20, y: 20 };
    score.pos = { x: game.w / 2, y: 20 };

    this.livesIcons = Array.from(new Array(4), (_, i) => {
      const icon = this.add(new TileSprite(textures.squizz, 32, 32));
      icon.pos = {
        x: game.w - 48,
        y: i * 48 + 180
      };
      return icon;
    });

    return {
      complete,
      score
    };
  }

  updateLivesIcons() {
    this.livesIcons.forEach((icon, i) => {
      icon.visible = i < this.stats.lives - 1;
    });
  }

  loseLife() {
    const { squizz, stats } = this;

    squizz.reset();

    if (--stats.lives === 0) {
      this.gameOver(stats);
    }
    this.updateLivesIcons();
  }

  update(dt, t) {
    super.update(dt, t);
    const { squizz, level, stats } = this;

    // Make this game harder the longer you play
    squizz.minSpeed -= 0.005 * dt;
    squizz.speed -= 0.004 * dt;

    // Update game containers
    this.updateBaddies();

    // Confine player to the level bounds
    const { pos } = squizz;
    const { bounds: { top, bottom, left, right } } = level;
    pos.x = math.clamp(pos.x, left, right);
    pos.y = math.clamp(pos.y, top, bottom);

    // See if we're on new ground
    const ground = level.checkGround(entity.center(squizz));
    if (ground === "solid") {
      stats.pellets++;
      this.addScore(SCORE_PELLET);
    }
    if (ground === "cleared" && !squizz.isPoweredUp) {
      this.loseLife();
    }
    // Flash the background if in powerup mode
    level.blank.y = squizz.isPoweredUp && ((t / 100) % 2) | 0 ? 1 : 0;
  }

  updateBaddies() {
    const { squizz, level } = this;

    this.baddies.map(b => {
      const { pos } = b;
      if (entity.distance(squizz, b) < 32) {
        // A hit!
        this.loseLife();

        // Send off screen for a bit
        if (b.xSpeed) pos.x = -level.w;
        else pos.y = -level.h;
      }

      // Screen wrap
      if (pos.x > level.w) pos.x = -32;
      if (pos.y > level.h) pos.y = -32;
    });
  }
}

export default GameScreen;
