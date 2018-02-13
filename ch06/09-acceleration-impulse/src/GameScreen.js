import pop from "../pop/index.js";
const { Container, Text } = pop;
import CrashTestDummy from "./entities/CrashTestDummy.js";

class GameScreen extends Container {
  constructor(game, controls) {
    super();
    this.w = game.w;
    this.h = game.h;
    this.controls = controls;

    const timer = this.add(
      new Text("0", {
        font: "20px sans-serif",
        fill: "#fff",
        align: "center"
      })
    );
    timer.pos.set(this.w / 2, 20);

    const bounds = { x: 0, y: 0, w: this.w, h: this.h };
    this.ctd = this.add(new CrashTestDummy(bounds, t => timer.text = t));
    this.ctd.pos.y = this.h / 2;

  }
}

export default GameScreen;
