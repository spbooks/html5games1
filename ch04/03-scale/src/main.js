import pop from "../pop/index.js";
const { Container, Game, math, Sprite, Texture } = pop;

const game = new Game(640, 320);
const { scene, w, h } = game;

// Load game textures
const textures = {
  background: new Texture("res/images/bg.png"),
  spaceship: new Texture("res/images/spaceship.png"),
  building: new Texture("res/images/building.png")
};

scene.add(new Sprite(textures.background));

const buildings = scene.add(new Container());
const makeRandom = (b, x) => {
  b.scale.x = math.randf(1, 3);
  b.scale.y = math.randf(1, 4);
  b.pos.x = x;
  b.pos.y = h - b.scale.y * 64;
};
for (let x = 0; x < 20; x++) {
  const b = buildings.add(new Sprite(textures.building));
  makeRandom(b, math.rand(w));
}

const ship = scene.add(new Sprite(textures.spaceship));
ship.pos = { x: 80, y: 120 };

ship.update = function(dt, t) {
  // Wobbly ship
  const { scale } = this;
  scale.x = Math.abs(Math.sin(t)) + 1;
  scale.y = Math.abs(Math.sin(t * 1.33)) + 1;
};

game.run(dt => {
  buildings.map(b => {
    b.pos.x -= 100 * dt;
    if (b.pos.x < -80) {
      makeRandom(b, w);
    }
  });
});
