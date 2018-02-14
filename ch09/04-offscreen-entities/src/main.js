import pop from "../pop/index.js";
const { Game, KeyControls } = pop;
import GameScreen from "./screens/GameScreen.js";

const game = new Game(48 * 16, 48 * 9);
const controls = {
  keys: new KeyControls()
};

function startGame() {
  game.setScene(new GameScreen(game, controls), 0);
}

startGame();
game.run();
