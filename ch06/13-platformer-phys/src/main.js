import pop from "../pop/index.js";
const { Game, KeyControls } = pop;
import GameScreen from "./GameScreen.js";

const game = new Game(48 * 25, 48 * 16);
const keys = new KeyControls();
function startGame() {
  game.scene = new GameScreen(game, keys, startGame);
}
startGame();
game.run();
