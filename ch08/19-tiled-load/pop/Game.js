import Assets from "./Assets.js";
import Container from "./Container.js";
import CanvasRenderer from "./renderer/CanvasRenderer.js";
import screenCapture from "./utils/screenCapture.js";

const STEP = 1 / 60;
let MULTIPLIER = 1;
let SPEED = STEP * MULTIPLIER;
const MAX_FRAME = SPEED * 5;

class Game {
  constructor(w, h, parent = "#board") {
    this.w = w;
    this.h = h;
    this.renderer = new CanvasRenderer(w, h);
    document.querySelector(parent).appendChild(this.renderer.view);
    screenCapture(this.renderer.view);
    this.scene = new Container();
    this.destination = null;

    this.fadeTime = 0;
    this.fadeDuration = 0;
  }

  setScene(scene, duration = 0.5) {
    if (!duration) {
      this.scene = scene;
      return;
    }
    this.destination = scene;
    this.fadeTime = duration;
    this.fadeDuration = duration;
  }

  run(gameUpdate = () => {}) {

    Assets.onReady(() => {
      let dt = 0;
      let last = 0;
      const loopy = ms => {
        const { scene, renderer, fadeTime } = this;

        const t = ms / 1000; // Let's work in seconds
        dt += Math.min(t - last, MAX_FRAME);
        last = t;

        while (dt >= SPEED) {
          this.scene.update(STEP, t / MULTIPLIER);
          gameUpdate(STEP, t / MULTIPLIER);
          dt -= SPEED;
        }
        renderer.render(scene);

        // Screen transition
        if (fadeTime > 0) {
          const { fadeDuration, destination } = this;
          const ratio = fadeTime / fadeDuration;
          this.scene.alpha = ratio;
          destination.alpha = 1 - ratio;
          renderer.render(destination, false);
          if ((this.fadeTime -= STEP) <= 0) {
            this.scene = destination;
            this.destination = null;
          }
        }
        requestAnimationFrame(loopy);
      };
      requestAnimationFrame(loopy);
    });
  }
  get speed() {
    return MULTIPLIER;
  }
  set speed(speed) {
    MULTIPLIER = speed;
    SPEED = STEP * MULTIPLIER;
  }
}

export default Game;
