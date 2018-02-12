import pop from "../pop/index.js";
const { Container, Game, entity, KeyControls, math } = pop;
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
relocate(mouse);
entity.addDebug(mouse);

const cheeses = scene.add(new Container());
for (let i = 0; i < 10; i++) {
  const cheese = cheeses.add(new Cheese());
  relocate(cheese);
  entity.addDebug(cheese);
}

game.run(() => {
  cheeses.map(cheese => {
    // Check for collisions with cheese
    if (entity.hit(mouse, cheese)) {
      relocate(cheese);
    }
  });
});
