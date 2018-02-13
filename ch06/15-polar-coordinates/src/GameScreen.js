import pop from "../pop/index.js";
const { Container } = pop;
import CrashTestDummy from "./entities/CrashTestDummy.js";

class GameScreen extends Container {
  constructor(game, controls) {
    super();
    this.w = game.w;
    this.h = game.h;
    this.controls = controls;
    this.bounds = { x: 0, y: 0, w: this.w, h: this.h };
    for (let i = 0; i < 30; i++) {
      const b = this.add(new CrashTestDummy(this.bounds));
      b.pos.x = this.w / 2;
      b.pos.y = this.h / 2;
    }
  }
}

export default GameScreen;
