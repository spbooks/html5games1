import pop from "../pop/index.js";
const { Game, Sprite, Texture } = pop;

const game = new Game(640, 320);
const { scene } = game;

// Load game textures
const textures = {
  pointer: new Texture("res/images/pointership.png"),
  crosshair: new Texture("res/images/crosshair.png"),
  spaceship: new Texture("res/images/spaceship.png")
};

function makeCrosshair(pos) {
  const c = scene.add(new Sprite(textures.crosshair));
  c.pos = pos;
  c.anchor = { x: -16, y: -16 }; // Center the crosshair
}

// Default anchor point, default scale
const ship1 = scene.add(new Sprite(textures.spaceship));
ship1.pos = { x: 200, y: 150 };
ship1.anchor = { x: 0, y: 0 };
makeCrosshair(ship1.pos);

// Anchor to center, default scale
const ship2 = scene.add(new Sprite(textures.spaceship));
ship2.pos = { x: 300, y: 150 };
ship2.anchor = { x: -16, y: -16 };
makeCrosshair(ship2.pos);

// Anchor to middle on y, "width for x, invert horizontal scale
// This is how you "flip in place".
const ship3 = scene.add(new Sprite(textures.spaceship));
ship3.pos = { x: 400, y: 150 };
ship3.anchor = { x: 32, y: -16 };
ship3.scale.x = -1;
makeCrosshair(ship3.pos);

game.run();
