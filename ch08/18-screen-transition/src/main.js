import pop from "../pop/index.js";
const { Game, KeyControls } = pop;
import TitleScreen from "./screens/TitleScreen.js";
import GameScreen from "./screens/GameScreen.js";

const game = new Game(48 * 25, 48 * 16);
const controls = {
  keys: new KeyControls()
};

function title () {
  game.setScene(new TitleScreen(game, controls, startGame), 0);
}
function startGame() {
  game.setScene(new GameScreen(game, controls, title));
}
title();
game.run();
