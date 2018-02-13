import pop from "../pop/index.js";
const { Container, Rect, Text } = pop;
import CrashTestDummy from "./entities/CrashTestDummy.js";

class GameScreen extends Container {
  constructor(game, controls) {
    super();
    this.w = game.w;
    this.h = game.h;
    this.controls = controls;
    this.bounds = { x: 0, y: 0, w: this.w, h: this.h };

    this.line = this.add(new Rect(2, game.h));

    this.ctd = this.add(new CrashTestDummy(this.bounds));
    this.ctd.pos.y = this.h / 2;

    this.timer = this.add(
      new Text("time", {
        font: "20px sans-serif",
        fill: "#fff",
        align: "center"
      })
    );
    this.timer.pos.set(this.w / 2, 20);

    this.reset();
  }

  reset() {
    const { ctd, line } = this;
    this.time = 0;
    this.running = true;
    ctd.pos.x = 0;
    ctd.vel.x = 0;

    line.pos.x = -2;
  }

  update(dt, t) {
    super.update(dt, t);
    const { running, timer, ctd, controls, line } = this;
    this.time += dt;

    if (running) {
      timer.text = `t: ${this.time.toFixed(3)} x: ${ctd.pos.x |
        0} vel: ${ctd.vel.x.toFixed(3)}`;
      if (this.time >= 2) {
        this.running = false;
        line.pos.x = ctd.pos.x - 1;
      }
    }

    if (controls.action) {
      this.reset();
    }
  }
}

export default GameScreen;
