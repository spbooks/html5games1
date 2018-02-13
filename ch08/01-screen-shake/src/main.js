import pop from "../pop/index.js";
const { Game, KeyControls } = pop;
import GameScreen from "./screens/GameScreen.js";

const game = new Game(48 * 25, 48 * 16);
const controls = {
  keys: new KeyControls()
};

function startGame() {
  game.scene = new GameScreen(game, controls, startGame);
}
startGame();
game.run();
