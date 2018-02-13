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
    this.balls = this.add(new Container());
    for (let i = 0; i < 40; i++) {
      const b = this.balls.add(new CrashTestDummy(this.bounds));
      b.pos.set(math.rand(32, this.w - 64), math.rand(32, this.h - 64));
    }
  }

  update(dt, t) {
    super.update(dt, t);
    const balls = this.balls.children;
    for (let i = 0; i < balls.length; i++) {
      const a = balls[i];

      for (let j = i + 1; j < balls.length; j++) {
        const b = balls[j];
        const diff = b.pos.clone().subtract(a.pos);
        if (diff.mag() > a.radius + b.radius) {
          continue;
        }
        const mid = a.pos.clone().add(b.pos).divide(2);
        const normal = diff.normalize();

        a.pos.set(mid.x - normal.x * a.radius, mid.y - normal.y * a.radius);
        b.pos.set(mid.x + normal.x * b.radius, mid.y + normal.y * a.radius);

        let power = (a.vel.x - b.vel.x) * normal.x;
        power += (a.vel.y - b.vel.y) * normal.y;

        const displacement = normal.multiply(power);
        a.vel.subtract(displacement);
        b.vel.add(displacement);
      }
    }
  }
}

export default GameScreen;
