import pop from "../../pop/index.js";
// import { Engine, Events, World } from "matter-js";
import Matter from "../../vendor/matter.js"; // Using local version for native module support.
const { Engine, Events, World } = Matter;

const { Container, entity, Rect, Text } = pop;
import Penguin from "../entities/Penguin.js";
import Arrow from "../entities/Arrow.js";
import Course from "../Course.js";

class GameScreen extends Container {
  constructor(game, controls, onHole, stats) {
    super();
    this.w = game.w;
    this.h = game.h;

    this.onHole = onHole;
    this.keys = controls.keys;
    this.mouse = controls.mouse;

    this.ready = false;

    // Score
    this.shots = stats.shots;
    this.total = stats.total;

    const title = this.add(new Text("Pengolfin'", {
      font: "32pt Freckle Face, cursive",
      align: "left",
      fill: "#fff"
    }));
    title.pos.set(20, 20);

    this.scoreText = this.add(
      new Text("", { font: "24pt Freckle Face, cursive", fill: "#fff", align: "right" })
    );
    this.scoreText.pos.set(game.w - 20, 20);
    this.setScore();

    const course = new Course(this.w, this.h);
    const penguin = new Penguin(course.tee);
    const arrow = new Arrow();

    const hole = new Rect(20, 10, { fill: "#FDA740" });
    hole.pos.copy(course.hole).add({ x: 0, y: 15 });
    this.add(new Text(stats.hole, { font: "14pt Freckle Face, cursive", fill: "#000" }))
      .pos.copy(hole.pos)
      .add({ x: 5 - (stats.hole > 9 ? 5 : 0), y: -20 });

    // Add everyone to the game
    this.penguin = this.add(penguin);
    this.hole = this.add(hole);
    this.course = this.add(course);
    this.waves = this.add(new Rect(this.w, 50, { fill: "#1e5799" }));
    this.arrow = this.add(arrow);

    // Set up the physics engine
    this.engine = Engine.create({
      enableSleeping: true
    });
    World.add(this.engine.world, [penguin.body, course.body]);
    Events.on(penguin.body, "sleepStart", () => {
      // Are we in the hole?
      if (entity.hit(penguin, hole)) {
        this.onHole(true, this.shots);
      }
      this.ready = true;
      arrow.visible = true;
    });

    Engine.run(this.engine);
  }

  setScore(shots = 0) {
    this.shots += shots;
    this.scoreText.text = `Strokes: ${this.shots}   Total: ${this.total}`;
  }

  fireAway(angle, power) {
    const { penguin, arrow } = this;

    this.setScore(1);
    this.ready = false;
    arrow.visible = false;
    penguin.fire(angle, power);
  }

  update(dt, t) {
    super.update(dt, t);
    const { arrow, penguin, h, mouse, waves } = this;

    // Gone off the edge?
    if (penguin.pos.y > h) {
      this.onHole(false, this.shots);
    }

    // Start your stroke
    if (mouse.pressed) {
      arrow.start(mouse.pos);
    }

    if (this.ready) {
      if (mouse.isDown || mouse.released) {
        const { angle, power } = arrow.drag(mouse.pos);
        if (mouse.released) {
          this.fireAway(angle, power * 0.021);
        }
      }
      // Skip the current hole
      if (this.keys.action) {
        this.setScore(5); // 5 stroke penalty!
        this.onHole(true, this.shots);
      }
    }

    waves.pos.y = Math.sin(t / 800) * 7 + this.h - 20;
    mouse.update();
  }
}

export default GameScreen;
