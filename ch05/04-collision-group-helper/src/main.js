import pop from "../pop/index.js";
const { Container, Game, entity, MouseControls, math } = pop;
import Mouse from "./entities/Mouse.js";
import Cheese from "./entities/Cheese.js";

const game = new Game(640, 320);
const { scene, w, h } = game;

const relocate = e => {
  const { pos } = e;
  pos.x = math.rand(w - 50);
  pos.y = math.rand(h - 50);
};

const mouse = scene.add(new Mouse(new MouseControls(game.renderer.view)));
relocate(mouse);

const cheeses = scene.add(new Container());
for (let i = 0; i < 10; i++) {
  const cheese = cheeses.add(new Cheese());
  relocate(cheese);
  cheese.pos.x += w;
}

let maxSpeed = 400;
let minSpeed = 100;
game.run(() => {
  entity.hits(mouse, cheeses, cheese => {
    relocate(cheese);
    cheese.pos.x += w;
    cheese.speed = math.rand(minSpeed++, maxSpeed++);
  });
  cheeses.map(cheese => {
    if (cheese.pos.x < -cheese.w) {
      cheese.pos.x = w;
    }
  });
  mouse.pos.x = math.clamp(mouse.pos.x, 0, w - mouse.w);
  mouse.pos.y = math.clamp(mouse.pos.y, 0, h - mouse.h);
});
