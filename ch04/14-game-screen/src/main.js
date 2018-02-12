import pop from "../pop/index.js";
const { Game, KeyControls } = pop;
import GameScreen from "./screens/GameScreen.js";

const game = new Game(640, 480);
const controls = new KeyControls();

game.scene = new GameScreen(game, controls);
game.run();
