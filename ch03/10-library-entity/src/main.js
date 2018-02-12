import pop from "../pop/index.js";
const { Container, CanvasRenderer, Texture, Sprite } = pop;

// Game setup code
const w = 640;
const h = 480;
const renderer = new CanvasRenderer(w, h);
document.querySelector("#board").appendChild(renderer.view);

// Game objects
const scene = new Container();
const texture = new Texture("res/images/spaceship.png");

// Make some ships!
for (let i = 0; i < 50; i++) {
  const speed = Math.random() * 150 + 50;
  const ship = new Sprite(texture);
  const { pos } = ship;
  pos.x = Math.random() * w;
  pos.y = Math.random() * h;
  ship.update = function(dt) {
    pos.x += speed * dt;
    if (pos.x > w) {
      pos.x = -32;
    }
  };
  scene.add(ship);
}

// Main game loop
let dt = 0;
let last = 0;

function loopy(ms) {
  requestAnimationFrame(loopy);

  const t = ms / 1000;
  dt = t - last;
  last = t;

  // Update everything
  scene.update(dt, t);

  // Render everything
  renderer.render(scene);
}
requestAnimationFrame(loopy);
