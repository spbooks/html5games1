import pop from "../pop/index.js";
const { Container, math } = pop;
import CrashTestDummy from "./entities/CrashTestDummy.js";

class GameScreen extends Container {
  constructor(game, controls) {
    super();
    this.w = game.w;
    this.h = game.h;
    this.controls = controls;
    this.bounds = { x: 0, y: 0, w: this.w, h: this.h };
    for (let i = 0; i < 30; i++) {
      const friction = (i / 29) * 0.19 + 0.8;
      const ctd = this.add(new CrashTestDummy(this.bounds, friction));
      ctd.pos.set(0, math.rand(this.h - 48));
    }
  }

}

export default GameScreen;
