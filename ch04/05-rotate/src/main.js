import pop from "../pop/index.js";
const { Container, Game, Sprite, Texture } = pop;

const game = new Game(640, 300);
const { scene, h } = game;

// Load game textures
const textures = {
  background: new Texture("res/images/bg.png"),
  spaceship: new Texture("res/images/spaceship.png")
};

scene.add(new Sprite(textures.background));
const ships = scene.add(new Container());
ships.pos.x = 80;
ships.pos.y = h / 2 - 16;

for (let i = 0; i < 10; i++) {
  const ship = ships.add(new Sprite(textures.spaceship));
  ship.pivot = { x: 16, y: 16 };
  ship.pos.x = i * 48;
}

game.run(dt => {
  const rps = Math.PI * 2 * dt;
  ships.map((s, i) => {
    s.rotation += i * rps;
  });
});
