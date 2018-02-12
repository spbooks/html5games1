const canvas = document.querySelector("#board canvas");
const ctx = canvas.getContext("2d");
const { width: w, height: h } = canvas;

function draw() {
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    ctx.fillRect(x, y, 50, 50);
  }
}

ctx.fillStyle = "black";
draw();

ctx.save();
ctx.fillStyle = "red";
draw();
ctx.restore();

// Back in black!
draw();
