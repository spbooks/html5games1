import pop from "../../pop/index.js";
const { Container, Sound, Text } = pop;

const sounds = {
  theme: new Sound("res/sounds/theme.mp3", { volume: 0.4, loop: true })
};

class TitleScreen extends Container {
  constructor(game, controls, onStart) {
    super();
    this.onStart = onStart;
    this.keys = controls.keys;

    const title = this.add(new Text("Pengolfin'", {
      font: "60pt Freckle Face, cursive",
      align: "center",
      fill: "#fff"
    }));
    title.pos.set(game.w / 2, game.h / 2 - 40);

    sounds.theme.play();
  }

  update() {
    const { keys } = this;
    if (keys.action) {
      sounds.theme.stop();
      this.onStart();
    }
  }
}

export default TitleScreen;
