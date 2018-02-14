import pop from "../pop/index.js";
const { Game, KeyControls } = pop;
import TitleScreen from "./screens/TitleScreen.js";
import GameScreen from "./screens/GameScreen.js";

const game = new Game(48 * 25, 48 * 16);
const controls = {
  keys: new KeyControls()
};

const defaults = () => ({
  newGame: true,
  level: 1,
  doors: { "1": true },
  data: {},
  hp: 5,
  score: 0,
  spawn: null
});

let state = defaults();

function title () {
  state = defaults();
  game.setScene(
    new TitleScreen(game, controls, () => startGame(1)),
    0
  );
}
function startGame(toLevel, spawn) {
  state.level = toLevel;
  state.spawn = spawn;

  game.setScene(
    new GameScreen(game, controls, state, {
      onLevel: startGame,
      onReset: title
    })
  );
}
title();
game.run();
