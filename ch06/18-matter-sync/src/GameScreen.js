import pop from "../pop/index.js";
// import { Engine, Events, World, Render } from "matter-js";
import Matter from "../vendor/matter.js"; // Using local version for native module support.
const { Engine, Events, World, Render } = Matter;

const { Container, math } = pop;
import Penguin from "./entities/Penguin.js";
import Course from "./Course.js";

class GameScreen extends Container {
  constructor(game, controls, onHole) {
    super();
    this.w = game.w;
    this.h = game.h;

    this.ready = false;
    this.onHole = onHole;
    this.mouse = controls.mouse;

    const course = new Course({ x: 450, y: 300 });
    const penguin = new Penguin({ x: this.w / 2, y: -32 });

    // Add everyone to the game
    this.penguin = this.add(penguin);
    this.course = this.add(course);

    // Set up the physics engine
    this.engine = Engine.create({
      enableSleeping: true
    });
    World.add(this.engine.world, [penguin.body, course.body]);
    Events.on(penguin.body, "sleepStart", () => {
      this.ready = true;
    });

    Engine.run(this.engine);

    const render = Render.create({
      element: document.querySelector("#board"),
      engine: this.engine,
      options: {
        width: this.w,
        height: this.h,
        showAngleIndicator: true
      }
    });
    Render.run(render);
  }

  update(dt, t) {
    super.update(dt, t);
    const { penguin, h, mouse } = this;

    // Gone off the edge?
    if (penguin.pos.y > h) {
      this.onHole(false, this.shots);
    }

    if (mouse.released) {
      const angle = -Math.PI / math.randf(1.75, 2.25);
      const power = 0.01;
      penguin.fire(angle, power);
    }

    mouse.update();
  }
}

export default GameScreen;
