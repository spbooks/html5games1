import pop from "../../pop/index.js";
const { Container, Text } = pop;

class TitleScreen extends Container {
  constructor(game) {
    super();
    const title = this.add(new Text("SoundPoolin'", {
      font: "60pt Freckle Face, cursive",
      align: "center",
      fill: "#fff"
    }));
    title.pos.set(game.w / 2, game.h / 2 - 40);
  }
}

export default TitleScreen;
