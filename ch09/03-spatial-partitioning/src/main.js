import pop from "../pop/index.js";
const { Game, GridHash, Texture, Sprite, Rect, math, entity } = pop;

// TODO: ooops, I removed Stats.js - put it back so we can monitor fps!

const game = new Game(31 * 25, 32 * 16);
const { w, h, scene } = game;

const useHash = true;
const cellSize = 80;
const numSprites = 1000;

const hash = new GridHash(cellSize);

const texture = new Texture("res/images/char-scary-mcgee.png");
const makeSprite = (x, y) => {
  const sprite = scene.add(new Sprite(texture));
  sprite.w = 16;
  sprite.h = 16;
  sprite.alpha = 1.0;
  sprite.pos.set(x, y);
  hash.insert(sprite);
  return sprite;
};

for (let j = 0; j < (h / cellSize) | 0; j++) {
  for (let i = 0; i < (w / cellSize) | 0; i++) {
    const r = scene.add(new Rect(cellSize - 1, cellSize - 1, { fill: "#000" }));
    r.pos.set(i * cellSize, j * cellSize);
  }
}

const sprites = [...Array(numSprites)].map(() =>
  makeSprite(math.rand(-16, w), math.rand(-16, h))
);

function moveAll(blnUseHash) {
  sprites.forEach(s => {
    s.pos.x += math.rand(-2, 3);
    s.pos.y += math.rand(-2, 3);
    s.alpha = 1.0;
    if (blnUseHash) {
      hash.insert(s);
    }
  });
}

function checkViaBruteForce () {
  for (var i = 0; i < sprites.length; i++) {
    const a = sprites[i];
    for (var j = i + 1; j < sprites.length; j++) {
      const b = sprites[j];
      if (entity.hit(a, b)) {
        a.alpha = 0.3;
        b.alpha = 0.3;
      }
    }
  }
}

function checkViaHash () {
  Object.values(hash.entities).forEach(set => {
    if (set.size < 2) {
      return;
    }
    const ents = [...set]; // Convert to regular array

    for (var i = 0; i < ents.length; i++) {
      const a = ents[i];
      for (var j = i + 1; j < ents.length; j++) {
        const b = ents[j];
        if (entity.hit(a, b)) {
          a.alpha = 0.3;
          b.alpha = 0.3;
        }
      }
    }
  });
}

moveAll(useHash);
checkViaHash();


game.run(() => {
  moveAll(useHash);
  if (useHash) {
    checkViaHash();
  } else {
    checkViaBruteForce();
  }
});
