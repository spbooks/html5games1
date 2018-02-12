import pop from "../pop/index.js";
const { Container, Game, Sprite, Text, Texture } = pop;

const game = new Game(640, 300);
const { scene, w, h } = game;

// Load game textures
const textures = {
  background: new Texture("res/images/bg.png"),
  spaceship: new Texture("res/images/spaceship.png")
};

scene.add(new Sprite(textures.background));
const ships = scene.add(new Container());
ships.rotation = 0.1;
ships.pivot = { x: 16, y: 16 };

// Testing nested rotations

const two = scene.add(new Container());
two.pos.x = w / 2;
two.pos.y = h / 2;
two.rotation = 0.1;
[...Array(10)].map((_, i) => {
  const twoinner = two.add(new Container());
  twoinner.pivot = { x: 16, y: 16 };
  twoinner.rotation = i * (Math.PI / 6);
  const t = twoinner.add(new Sprite(textures.spaceship));
  t.pos.x = i * 12;
  t.pivot.x = 16;
  t.pivot.y = 16;
  t.rotation = i * Math.PI / 8;
});

const t = new Text("Rotated text", {
  font: "24pt monospace",
  fill: "green"
});
t.pos.x = 0;
t.pos.y = 60;
t.pivot = {
  x: 12,
  y: 12
};
t.rotation = Math.PI / 2;
scene.add(t);

for (let i = 0; i < 10; i++) {
  const ship = ships.add(new Sprite(textures.spaceship));
  ship.pivot = { x: 16, y: 16 };
  ship.pos.x = i * 48;
}

game.run((dt, t) => {
  const rps = Math.PI * 2 * dt;
  ships.map((s, i) => {
    s.rotation += i * rps;
    const flipped = Math.random() < 0.5;
    s.scale.x = flipped ? -1 : 1;
    s.anchor.x = flipped ? 32 : 0;
  });
  two.rotation -= rps * 0.1;
  ships.rotation += Math.sin(t) * 0.01;
});
