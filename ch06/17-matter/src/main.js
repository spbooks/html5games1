import Matter from "../vendor/matter.js";
// import Matter from "matter-js";
// Using local version for native module support.
const { Engine, Bodies, World, Render } = Matter;

const w = 800;
const h = 400;

// Set up the physics engine
const engine = Engine.create();

// Create some bodies
const course = Bodies.rectangle(w / 2, h - 48, w - 100, 48, { isStatic: true });
const balls = Array(50).fill(0).map(() => {
  const radius = Math.random() * 25 + 5;
  const x = Math.random() * w;
  const y = -Math.random() * 1000;
  const options = {
    restitution: 0.7
  };
  return Bodies.circle(x, y, radius, options);
});

// Add them to the world
World.add(engine.world, [course, ...balls]);
Engine.run(engine);

// Debug render it
const render = Render.create({
  element: document.querySelector("#board"),
  engine: engine,
  options: {
    width: w,
    height: h,
    showAngleIndicator: true
  }
});
Render.run(render);
