import pop from "../pop/index.js";
const { Container, Text } = pop;
import CrashTestDummy from "./entities/CrashTestDummy.js";

class GameScreen extends Container {
  constructor(game, controls) {
    super();
    this.w = game.w;
    this.h = game.h;
    this.controls = controls;

    const velocity = this.w / 3; // X seconds to cross the screen.
    this.ctd = this.add(new CrashTestDummy(velocity));
    this.ctd.pos.y = game.h / 2 - 10;

    this.timer = this.add(
      new Text("time", { font: "24px sans-serif", fill: "#fff", align: "center" })
    );
    this.timer.pos.set(this.w / 2, 20);
    this.reset();
  }

  reset() {
    this.time = 0;
    this.running = true;
    this.ctd.pos.x = 0;
  }

  update(dt) {
    super.update(dt);
    const { ctd, running, timer, w, controls } = this;

    if (ctd.pos.x >= w) {
      this.running = false;
      ctd.pos.x -= w + 32;
    }

    if (running) {
      this.time += dt;
      timer.text = `${this.time.toFixed(3)} (${ctd.vel.x.toFixed(2)})`;
    }

    if (controls.action) {
      this.reset();
    }
  }
}

export default GameScreen;
