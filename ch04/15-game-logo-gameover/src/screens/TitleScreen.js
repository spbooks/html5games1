import pop from "../../pop/index.js";
const { Container, Text } = pop;
import Squizz from "../entities/Squizz.js";
import Level from "../Level.js";

class TitleScreen extends Container {
  constructor(game, controls, onStart) {
    super();
    this.onStart = onStart;
    this.controls = controls;
    controls.reset();

    const drawText = (msg, pos, size = 24) => {
      const font = `${size}pt 'VT323', monospace`;
      const text = new Text(msg, { font: font, fill: "#111" });
      text.pos = pos;
      return this.add(text);
    };

    this.add(new Level(game.w, game.h));

    this.title = drawText("SQUIZZBALL", { x: 230, y: 100 }, 40);

    drawText("Fill up the screen!", { x: 220, y: 200 });
    drawText("Avoid the wildebeest.", { x: 220, y: 300 });

    const fakeControls = {
      x: 0,
      y: 0,
      action: false
    };
    const squizz = this.add(new Squizz(fakeControls));
    squizz.update = () => {};
    squizz.pos = { x: 140, y: 200 };
  }

  update(dt, t) {
    super.update(dt, t);
    const { title, controls } = this;
    title.pos.y += Math.sin(t / 0.3) * 0.3;
    title.pos.x += Math.cos(t / 0.25) * 0.3;
    if (controls.action) {
      this.onStart();
    }
  }
}

export default TitleScreen;
