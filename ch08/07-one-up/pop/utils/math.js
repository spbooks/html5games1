function angle (a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const angle = Math.atan2(dy, dx);

  return angle;
}

function clamp(x, min = 0, max = 1) {
  return Math.max(min, Math.min(x, max));
}

function distance (a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.sqrt(dx * dx + dy * dy);
}

function lerp(x, min = 0, max = 1) {
  return (x - min) / (max - min);
}

function rand(min, max) {
  return Math.floor(randf(min, max));
}

let random = Math.random;
function randf(min, max) {
  if (max == null) {
    max = min || 1;
    min = 0;
  }
  return random() * (max - min) + min;
}

function randOneIn(max) {
  return rand(0, max) === 0;
}

function randOneFrom(items) {
  return items[rand(0, items.length)];
}

let seed = 42;
function randomSeed(s) {
  if (!isNaN(s)) {
    seed = s;
  }
  return seed;
}

function randomSeeded() {
  // https://en.wikipedia.org/wiki/Linear_congruential_generator
  seed = (seed * 16807 + 0) % 2147483647;
  return seed / 2147483647;
}

function useSeededRandom(blnUse = true) {
  randomSeeded();
  random = blnUse ? randomSeeded : Math.random;
}

const ease = {
  quadIn(x) {
    return x * x;
  },
  quadOut(x) {
    return 1 - this.quadIn(1 - x);
  },
  cubicIn(x) {
    return x * x * x;
  },
  cubicInOut(p) {
    if (p < 0.5) return this.cubicIn(p * 2) / 2;
    return 1 - this.cubicIn((1 - p) * 2) / 2;
  },
  elasticOut(x) {
    const p = 0.4;
    return Math.pow(2, -10 * x) *
      Math.sin((x - p / 4) *
      (Math.PI * 2) / p) + 1;
  }
};

export default {
  angle,
  clamp,
  distance,
  ease,
  lerp,
  rand,
  randf,
  randOneIn,
  randOneFrom,
  randomSeed,
  useSeededRandom
};
