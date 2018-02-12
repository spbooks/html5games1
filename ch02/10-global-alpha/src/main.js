const canvas = document.querySelector("#board canvas");
const ctx = canvas.getContext("2d");
const { width: w, height: h } = canvas;

function draw() {
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 50, 0, Math.PI * 2, true);
    ctx.fill();
  }
}

ctx.save();
ctx.globalAlpha = 0.3;
ctx.fillStyle = "blue";
draw();
ctx.fillStyle = "orange";
draw();
ctx.fillStyle = "green";
draw();
ctx.restore();
ctx.fillStyle = "lemonchiffon";
draw();
