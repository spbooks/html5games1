import pop from "../pop/index.js";
const { Game, Sprite, Texture } = pop;
const game = new Game(640, 320);
const { scene, w, h } = game;

// Game objects
const ship = new Sprite(new Texture("res/images/spaceship.png"));
scene.add(ship);

// Our old loop!
game.run((dt, t) => {
  // Move the ship
  ship.pos.x += 200 * dt;
  ship.pos.y = Math.sin(t * 15) * 500 * dt + h / 2;

  // Wraparound the screen
  if (ship.pos.x > w) {
    ship.pos.x = -32;
  }
});
