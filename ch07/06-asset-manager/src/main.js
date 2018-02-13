import pop from "../pop/index.js";
const { Assets, Game, KeyControls, math, MouseControls } = pop;
import TitleScreen from "./screens/TitleScreen.js";
import GameScreen from "./screens/GameScreen.js";

const game = new Game(800, 400);
const controls = {
  keys: new KeyControls(),
  mouse: new MouseControls(game.renderer.view)
};

math.useSeededRandom(true);
let lastSeed = 1; //(Math.random() * 420000) | 0;
math.randomSeed(lastSeed);

let hole = 0;
let total = 0;

function playHole(completed = true, shots = 0) {
  if (completed) {
    hole++;
    total += shots;
    shots = 0;
  } else {
    // Reset seed to last level
    math.randomSeed(lastSeed);
  }

  lastSeed = math.randomSeed();
  const stats = {
    hole,
    shots,
    total
  };
  game.scene = new GameScreen(game, controls, playHole, stats);
}

// Show the asset loading progress
const loading = document.querySelector("#loading");
const loaded = loading.querySelector("#loaded");
Assets.onProgress((current, total) => {
  loaded.innerText = `${current}/${total}`;
});
// Remove the loader when ready
Assets.onReady(() => {
  loading.parentNode.removeChild(loading);
});

game.scene = new TitleScreen(game, controls, playHole);
game.run();
