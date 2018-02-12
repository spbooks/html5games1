import pop from "../pop/index.js";
const { entity, Game, KeyControls, math } = pop;
import Squizz from "./entities/Squizz.js";
import Level from "./Level.js";

const game = new Game(640, 480);
const { scene, w, h } = game;

const controls = new KeyControls();
const squizz = new Squizz(controls);
const level = new Level(w, h);

scene.add(level);
scene.add(squizz);

game.run(() => {
  const { pos } = squizz;

  // Confine player to the play area
  const { bounds: { top, bottom, left, right } } = level;
  pos.x = math.clamp(pos.x, left, right);
  pos.y = math.clamp(pos.y, top, bottom);

  // See if we're on new ground
  const ground = level.checkGround(entity.center(squizz));
  // ... handle the `ground` result
});
