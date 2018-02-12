import pop from "../pop/index.js";
const { Container, Game, MouseControls, math } = pop;
import Squizz from "./entities/Squizz.js";

const game = new Game(640, 320);
const { scene, renderer, w, h } = game;

const mouse = new MouseControls(renderer.view);

// Add all the SquizzBalls
const balls = scene.add(new Container());
for (let i = 0; i < 100; i++) {
  const squizz = balls.add(new Squizz());
  // Position them offscren to the left
  squizz.pos = {
    x: math.rand(-w, 0),
    y: math.rand(h)
  };
}

game.run(() => {
  const { pressed, pos } = mouse;

  balls.map(b => {
    // If they get to the edge, send them back: but faster!
    if (b.pos.x > w * 2) {
      b.pos.x = -32;
      b.speed *= 1.1;
    }

    // Check mouse clicks
    if (pressed && math.distance(pos, b.pos) < 16) {
      // A hit!
      if (b.speed > 0) {
        b.speed = 0;
      } else {
        b.dead = true;
      }
    }
  });

  mouse.update();
});
