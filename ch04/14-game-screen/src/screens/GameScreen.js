import pop from "../../pop/index.js";
const { Container, Camera, entity, math } = pop;

import Squizz from "../entities/Squizz.js";
import Baddie from "../entities/Baddie.js";
import Level from "../Level.js";

class GameScreen extends Container {
  constructor(game, controls) {
    super();

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

  update(dt, t) {
    super.update(dt, t);
    const { squizz, level } = this;

    // Make this game harder the longer you play
    squizz.speed -= 0.003 * dt;

    // Update game containers
    this.updateBaddies();

    // Confine player to the level bounds
    const { pos } = squizz;
    const { bounds: { top, bottom, left, right } } = level;
    pos.x = math.clamp(pos.x, left, right);
    pos.y = math.clamp(pos.y, top, bottom);

    // See if we're on new ground
    const ground = level.checkGround(entity.center(squizz));
    if (ground === "cleared") {
      squizz.dead = true;
    }
  }

  updateBaddies() {
    const { squizz, level } = this;

    this.baddies.map(b => {
      const { pos } = b;
      if (entity.distance(squizz, b) < 32) {
        // A hit!
        squizz.dead = true;

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
