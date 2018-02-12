import pop from "../pop/index.js";
const { Game, KeyControls } = pop;
import GameScreen from "./GameScreen.js";

const game = new Game(48 * 19, 48 * 11);
game.scene = new GameScreen(game, new KeyControls());
game.run();
