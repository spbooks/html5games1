import pop from "../pop/index.js";
const { Game, KeyControls } = pop;
import TitleScreen from "./screens/TitleScreen.js";
import GameScreen from "./screens/GameScreen.js";

const game = new Game(48 * 19, 48 * 9);
const controls = {
  keys: new KeyControls()
};

function title () {
  game.scene = new TitleScreen(game, controls, startGame);
}
function startGame() {
  game.scene = new GameScreen(game, controls, title);
}
title();
game.run();
