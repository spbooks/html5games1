import pop from "../../pop/index.js";
const { Camera, Container, Text, Texture, TileSprite, math, entity } = pop;
import Level from "../Level.js";
import Squizz from "../entities/Squizz.js";
import Baddie from "../entities/Baddie.js";
import Pickup from "../entities/Pickup.js";
import Cloud from "../entities/Cloud.js";
import Jackpot from "../entities/Jackpot.js";

const SCORE_BADDIES = 999;
const SCORE_PELLET = 8;
const SCORE_JACKPOT = 51;
const SCORE_POWERBALL = 42;

const textures = {
  jackpots: new Texture("res/images/jackpots.png"),
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

    // Refueling power-ups
    this.pickups = new Container();
    this.lastPickupAt = 0;

    // Add it all to the game camera
    camera.add(level);
    camera.add(this.pickups);
    camera.add(this.baddies);
    camera.add(squizz);

    // Add static graphic elements
    this.gui = this.createGUI(game);
    this.letters = this.createBonusLetters();

    this.stats = {
      pellets: 0,
      maxPellets: level.totalFreeSpots,
      lives: 3,
      score: 0,
      lettersHave: ""
    };

    this.updateLivesIcons();

    // Keep references to things we need in "update"
    this.level = level;
    this.camera = camera;
    this.squizz = squizz;
  }

  addBaddies(level) {
    const baddies = new Container();
    for (let i = 0; i < 5; i++) {
      const b = baddies.add(new Baddie(200, 0));
      b.pos.y = ((level.h / 5) | 0) * i + level.tileH * 2;
    }
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

  createBonusLetters() {
    return Jackpot.BONUS_WORD.split("").map((ch, i) => {
      const letter = this.add(new TileSprite(textures.jackpots, 32, 32));
      letter.frame.x = i;
      letter.pos = { x: 10, y: i * 32 + 128 };
      letter.scale = { x: 0.75, y: 0.75 };
      letter.visible = false;
      return letter;
    });
  }

  updateLivesIcons() {
    this.livesIcons.forEach((icon, i) => {
      icon.visible = i < this.stats.lives - 1;
    });
  }

  loseLife() {
    const { squizz, stats } = this;

    squizz.reset();
    this.addCloud(squizz.pos);

    if (--stats.lives === 0) {
      this.gameOver(stats);
    }
    this.updateLivesIcons();
  }

  addCloud(pos) {
    const { camera } = this;
    camera.add(new Cloud(pos));
  }

  addPickup() {
    const { stats, level, pickups } = this;
    const pickup = math.randOneFrom(Pickup.pickups);
    const p = pickups.add(new Pickup(pickup));
    if (pickup === "death") {
      // One less cell that user can possibly fill
      stats.maxPellets--;
      p.life *= 3; // death stays for a long time.
    }
    p.pos = level.getRandomPos();
  }

  addBonusLetter() {
    const { level, pickups } = this;
    const p = pickups.add(new Jackpot());
    p.pos = level.getRandomPos();
  }

  pickupBonusLetter(letter) {
    const { stats, letters } = this;
    if (stats.lettersHave.indexOf(letter) !== -1) {
      // Already have this letter
      return;
    }
    stats.lettersHave += letter;
    letters[Jackpot.BONUS_WORD.indexOf(letter)].visible = true;
    if (stats.lettersHave.length === Jackpot.BONUS_WORD.length) {
      // FREE LIFE!
      stats.lives += 1;
      stats.lettersHave = "";
      letters.forEach(l => (l.visible = false));
      this.updateLivesIcons();
    }
  }

  update(dt, t) {
    super.update(dt, t);
    const { squizz, level, stats } = this;

    // Make this game harder the longer you play
    squizz.minSpeed -= 0.005 * dt;
    squizz.speed -= 0.004 * dt;

    // Update game containers
    this.updatePickups(t);
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

  updatePickups(t) {
    const { squizz, lastPickupAt } = this;

    // Check for collisions
    this.pickups.map(p => {
      if (entity.distance(squizz, p) < 32) {
        switch (p.name) {
          case "jackpots":
            this.pickupBonusLetter(p.letter);
            this.addScore(SCORE_JACKPOT);
            break;
          case "bomb":
            squizz.powerUpFor(4);
            this.addScore(SCORE_POWERBALL);
            break;
          case "shoes":
            squizz.fastTime = 3;
            break;
          case "death":
            this.loseLife();
        }
        p.dead = true;
      }
    });

    // Add new pickup item
    if (t - lastPickupAt > 1) {
      this.lastPickupAt = t;
      this.addPickup();
      // ... and maybe a bonus letter
      if (math.randOneIn(3)) {
        this.addBonusLetter();
      }
    }
  }

  updateBaddies() {
    const { squizz, level } = this;

    this.baddies.map(b => {
      const { pos } = b;
      if (entity.distance(squizz, b) < 32) {
        // A hit!
        this.addCloud(pos);
        this.addScore(SCORE_BADDIES);

        if (!squizz.isPoweredUp) {
          this.loseLife();
        }

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
