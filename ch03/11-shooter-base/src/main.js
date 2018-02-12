import pop from "../pop/index.js";
const { CanvasRenderer, Container, KeyControls, Texture, Sprite } = pop;

// Game setup code
const w = 640;
const h = 300;
const renderer = new CanvasRenderer(w, h);
document.querySelector("#board").appendChild(renderer.view);

// Load game textures
const textures = {
  background: new Texture("res/images/bg.png"),
  spaceship: new Texture("res/images/spaceship.png")
};
const scene = new Container();
const controls = new KeyControls();

// Make a spaceship
const ship = new Sprite(textures.spaceship);
ship.pos.x = 120;
ship.pos.y = h / 2 - 16;
ship.update = function(dt) {
  const { pos } = this;
  pos.x += controls.x * dt * 200;
  pos.y += controls.y * dt * 200;

  if (pos.x < 0) pos.x = 0;
  if (pos.x > w) pos.x = w;
  if (pos.y < 0) pos.y = 0;
  if (pos.y > h) pos.y = h;
};

// Add everything to the scene container
scene.add(new Sprite(textures.background));
scene.add(ship);

let dt = 0;
let last = 0;
function loopy(ms) {
  requestAnimationFrame(loopy);

  const t = ms / 1000;
  dt = t - last;
  last = t;

  // Game logic code
  ship.pos.x += Math.sin(t * 10);

  scene.update(dt, t);
  renderer.render(scene);
}
requestAnimationFrame(loopy);
