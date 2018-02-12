import pop from "../pop/index.js";
const { Container, Game, math } = pop;
import Squizz from "./entities/Squizz.js";

const game = new Game(640, 320);
const { scene, w, h } = game;

const balls = scene.add(new Container());
for (let i = 0; i < 20; i++) {
  const squizz = balls.add(new Squizz());
  squizz.pos = {
    x: math.rand(w - 100),
    y: math.rand(h - 50)
  };
}

game.run();
