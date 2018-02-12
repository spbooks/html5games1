import pop from "../pop/index.js";
const { Game, KeyControls } = pop;
import LogoScreen from "./screens/LogoScreen.js";
import TitleScreen from "./screens/TitleScreen.js";
import GameScreen from "./screens/GameScreen.js";
import GameOverScreen from "./screens/GameOverScreen.js";

const game = new Game(640, 480);
const controls = new KeyControls();

function titleScreen () {
  game.scene = new TitleScreen(game, controls, newGame);
}

function gameOverScreen (result) {
  game.scene = new GameOverScreen(game, controls, result, titleScreen);
}

function newGame () {
  game.scene = new GameScreen(game, controls, gameOverScreen);
}

game.scene = new LogoScreen(game, titleScreen);
game.run();
