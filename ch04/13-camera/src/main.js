import pop from "../pop/index.js";
const { Container, Camera, Game, entity, KeyControls, math } = pop;
import Squizz from "./entities/Squizz.js";
import Baddie from "./entities/Baddie.js";
import Level from "./Level.js";

const game = new Game(640, 480);
const { scene, w, h } = game;

const controls = new KeyControls();
const squizz = new Squizz(controls);
const level = new Level(w * 2, h * 2);
squizz.pos = { x: level.w / 2, y: level.h / 2 };
const camera = new Camera(squizz, { w, h }, { w: level.w, h: level.h });

scene.add(camera);
camera.add(level);
camera.add(squizz);

// Add roaming baddies
const baddies = addBaddies(level);
camera.add(baddies);

function addBaddies(level) {
  const baddies = new Container();
  // Horizontal baddies
  for (let i = 0; i < 5; i++) {
    const b = baddies.add(new Baddie(32 * 5, 0));
    b.pos.y = ((level.h / 5) | 0) * i + level.tileH * 2;
  }
  // Vertical baddies
  for (let i = 0; i < 10; i++) {
    const b = baddies.add(new Baddie(0, 32 * 5));
    b.pos.x = ((level.w / 10) | 0) * i + level.tileW;
  }
  return baddies;
}

function updateBaddies() {
  baddies.map(b => {
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

game.run(() => {
  const { pos } = squizz;

  // Baddie logic
  updateBaddies();

  // Confine player to the play area
  const { bounds: { top, bottom, left, right } } = level;
  pos.x = math.clamp(pos.x, left, right);
  pos.y = math.clamp(pos.y, top, bottom);

  // See if we're on new ground
  const ground = level.checkGround(entity.center(squizz));
  if (ground === "cleared") {
    squizz.dead = true;
  }
});
