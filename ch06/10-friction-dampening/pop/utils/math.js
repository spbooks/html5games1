function angle (a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const angle = Math.atan2(dy, dx);

  return angle;
}

function clamp(x, min, max) {
  return Math.max(min, Math.min(x, max));
}

function distance (a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;

  return Math.sqrt(dx * dx + dy * dy);
}

function rand(min, max) {
  return Math.floor(randf(min, max));
}

function randf(min, max) {
  if (max == null) {
    max = min || 1;
    min = 0;
  }
  return Math.random() * (max - min) + min;
}

function randOneIn(max) {
  return rand(0, max) === 0;
}

function randOneFrom(items) {
  return items[rand(0, items.length)];
}

export default {
  angle,
  clamp,
  distance,
  rand,
  randf,
  randOneIn,
  randOneFrom,
};
