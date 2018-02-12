import pop from "../pop/index.js";
const { Game, KeyControls, math } = pop;
import Mouse from "./entities/Mouse.js";
import Cheese from "./entities/Cheese.js";

const game = new Game(640, 320);
const { scene, w, h } = game;

const a = scene.add(new Mouse(new KeyControls()));
const b = scene.add(new Cheese());
const relocate = e => {
  const { pos } = e;
  pos.x = math.rand(w - 50);
  pos.y = math.rand(h - 50);
};
relocate(a);
relocate(b);

game.run(() => {
  // Bounding box detection.
  if (
    a.pos.x + a.w >= b.pos.x &&
    a.pos.x < b.pos.x + b.w &&
    a.pos.y + a.h >= b.pos.y &&
    a.pos.y < b.pos.y + b.h
  ) {
    relocate(b);
  }
});
