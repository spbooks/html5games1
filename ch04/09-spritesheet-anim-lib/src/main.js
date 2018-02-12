import pop from "../pop/index.js";
const { Game, KeyControls } = pop;
import Squizz from "./entities/Squizz.js";

const game = new Game(640, 320);
const { scene, w, h } = game;

const controls = new KeyControls();

for (let i = 0; i < 30; i++) {
  const squizz = new Squizz(controls);
  squizz.pos = {
    x: Math.random() * w,
    y: Math.random() * h
  };
  scene.add(squizz);
}

game.run();
