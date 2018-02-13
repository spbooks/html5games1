import pop from "../pop/index.js";
const { Game, Sound, SoundPool } = pop;
import TitleScreen from "./screens/TitleScreen.js";

const game = new Game(800, 400);

// Try this as a "new Sound()"", rather than a "new SoundPool()":
const plops = new SoundPool("./res/sounds/plop.mp3", { volume: 0.2 }, 3);

game.scene = new TitleScreen(game);

const rate = 0.1;
let next = rate;
game.run((dt, t) => {
  if (t > next) {
    next = t + rate;
    plops.play();
  }
});
