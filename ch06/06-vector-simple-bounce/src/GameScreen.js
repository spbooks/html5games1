import pop from "../pop/index.js";
const { Container } = pop;
import CrashTestDummy from "./entities/CrashTestDummy.js";

class GameScreen extends Container {
  constructor(game, controls) {
    super();
    this.w = game.w;
    this.h = game.h;
    this.controls = controls;
    const bounds = { x: 0, y: 0, w: this.w, h: this.h };

    for (let i = 0; i < 30; i++) {
      this.add(new CrashTestDummy(bounds));
    }
  }
}

export default GameScreen;
