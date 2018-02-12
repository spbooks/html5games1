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

function randOneFrom(items) {
  return items[rand(items.length)];
}

function randOneIn(max = 2) {
  return rand(0, max) === 0;
}

export default {
  rand,
  randf,
  randOneFrom,
  randOneIn
};
