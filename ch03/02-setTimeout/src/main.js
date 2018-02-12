const canvas = document.querySelector("#board canvas");
const ctx = canvas.getContext("2d");
const { width: w, height: h } = canvas;

ctx.fillStyle = "#000";
ctx.strokeStyle = "#fff";
ctx.font = "40pt monospace";

const start = Date.now();
function loopy() {
  // Clear the screen
  ctx.fillRect(0, 0, w, h);
  // Write the time
  ctx.strokeText(Date.now() - start, 20, 80);

  if (Math.random() < 0.01) {
    ctx.strokeText("Game Over!", 160, 180);
  } else {
    // Loop
    setTimeout(loopy, 1000 / 60);
  }
}
loopy();
