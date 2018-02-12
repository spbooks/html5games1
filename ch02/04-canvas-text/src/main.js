const canvas = document.querySelector("#board canvas");
const ctx = canvas.getContext("2d");
const { width: w, height: h } = canvas;

ctx.font = "30pt sans-serif";
ctx.textAlign = "center";

const center = w / 2;
for (let i = 0; i < 11; i++) {
  ctx.fillText("if you're in the game", center, i * 40);
}
ctx.strokeText("strokes the word", center, h - 30);
