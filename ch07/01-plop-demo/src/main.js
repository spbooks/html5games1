import pop from "../pop/index.js";
const { Game } = pop;
import TennisBall from "./entities/TennisBall.js";

const w = 800;
const h = 400;
const game = new Game(w, h);

const balls = [
  { x: 0, y: h / 2, dir: 1 },
  { x: w, y: h / 2, dir: -1 }
].map(d => {
  const p = game.scene.add(new TennisBall(600 * d.dir));
  p.pos.copy(d).add({ x: -p.rad, y: -p.rad });
  return p;
});

const plop = new Audio();
plop.src = "./res/sounds/plop.mp3";

game.run(dt => {
  const [x1, x2] = balls.map(p => {
    const { pos, vel } = p;
    pos.x += vel.x * dt;
    if (pos.x < -p.rad || pos.x > w - p.rad) {
      vel.x *= -1;
    }
    return pos.x;
  });

  if (Math.abs(x1 - x2) < 5) {
    plop.play();
  }
});
