import pop from "../pop/index.js";
const { Container, CanvasRenderer, Text } = pop;

// Game setup code
const w = 640;
const h = 320;
const renderer = new CanvasRenderer(w, h);
document.querySelector("#board").appendChild(renderer.view);

// Game objects
const scene = new Container();
const message = new Text("The Renderer!", {
  font: "40pt monospace",
  fill: "blue"
});
message.pos = { x: w, y: h / 2 };
message.update = function(dt, t) {
  const { pos } = this;
  pos.x -= 100 * dt;
  pos.y += Math.sin(t / 100);
  if (pos.x < -450) {
    pos.x = w;
  }
};
scene.add(message);

let dt = 0;
let last = 0;
const loopy = ms => {
  requestAnimationFrame(loopy);

  const t = ms / 1000;
  dt = t - last;
  last = t;

  // Game logic code
  //...

  // Update everything
  scene.update(dt, t);

  // Render everything
  renderer.render(scene);
};
requestAnimationFrame(loopy);
