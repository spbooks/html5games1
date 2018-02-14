import pop from "../../pop/index.js";
const { Texture, TileSprite, State } = pop;

const texture = new Texture("res/images/bravedigger-tiles.png");

class Spikes extends TileSprite {

  constructor(idle = 1.0, duration = 1.5, offset = 0) {
    super(texture, 48, 48);
    this.frame.x = 7;
    this.frame.y = 1;
    this.type = "Spikes";
    this.hitBox = {
      x: 6,
      y: 18,
      w: 36,
      h: 26
    };
    this.idle = idle;
    this.duration = duration;
    this.offset = offset;
    this.state = new State("IDLE");
  }

  update(dt, t) {
    const { state, frame, duration, idle, offset } = this;
    switch (state.get()) {
      case "IDLE":
        this.frame.x = 7;
        this.deadly = false;
        if (state.time > idle + offset) {
          state.set("PRIMING");
        }
        break;
      case "PRIMING":
        frame.x = [7, 8][((t / 0.1) | 0) % 2];
        if (state.time > 1) {
          state.set("SPRING");
        }
        break;
      case "SPRING":
        frame.x = 6;
        this.deadly = true;
        if (state.time > duration) {
          state.set("IDLE");
        }
        break;
    }
    state.update(dt);
  }
  serialize() {
    const { pos: { x, y }, type } = this;
    return { type, x, y };
  }
}

export default Spikes;
