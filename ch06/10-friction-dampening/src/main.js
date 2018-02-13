import pop from "../pop/index.js";
const { Game, KeyControls } = pop;
import GameScreen from "./GameScreen.js";

const game = new Game(800, 300);
const keys = new KeyControls();
function startGame() {
  game.scene = new GameScreen(game, keys, startGame);
}
startGame();
game.run();
