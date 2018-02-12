import pop from "../pop/index.js";
const { Game, entity, KeyControls, math } = pop;
import Mouse from "./entities/Mouse.js";
import Cheese from "./entities/Cheese.js";

const game = new Game(640, 320);
const { scene, w, h } = game;

const relocate = e => {
  const { pos } = e;
  pos.x = math.rand(w - 50);
  pos.y = math.rand(h - 50);
};

const mouse = scene.add(new Mouse(new KeyControls()));
const cheese = scene.add(new Cheese());
relocate(mouse);
relocate(cheese);
entity.addDebug(mouse);
entity.addDebug(cheese);

game.run(() => {
  const { hitBox: aHit, pos: aPos } = mouse;
  const a = {
    x: aHit.x + aPos.x,
    y: aHit.y + aPos.y,
    w: aHit.w,
    h: aHit.h
  };

  const { hitBox: bHit, pos: bPos } = cheese;
  const b = {
    x: bHit.x + bPos.x,
    y: bHit.y + bPos.y,
    w: bHit.w,
    h: bHit.h
  };

  // Bounding box detection.
  if (
    a.x + a.w >= b.x &&
    a.x < b.x + b.w &&
    a.y + a.h >= b.y &&
    a.y < b.y + b.h) {
    relocate(cheese);
  }
});
