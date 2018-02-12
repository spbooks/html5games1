import pop from "../pop/index.js";
const { Game, KeyControls, Sprite, Texture } = pop;

const game = new Game(640, 300);
const { scene, w, h } = game;

// Load game textures
const textures = {
  background: new Texture("res/images/bg.png"),
  spaceship: new Texture("res/images/spaceship.png")
};

// Game objects
const controls = new KeyControls();

// Make a spaceship
const spaceship = new Sprite(textures.spaceship);
spaceship.pos = { x: w / 2, y: h / 2 };
spaceship.update = function(dt) {
  const { x, y } = controls;
  // Translate
  this.pos.x += x * dt * 200;
  this.pos.y += y * dt * 200;
};

scene.add(new Sprite(textures.background));
scene.add(spaceship);

game.run();
