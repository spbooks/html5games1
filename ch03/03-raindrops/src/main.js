const canvas = document.querySelector("#board canvas");
const ctx = canvas.getContext("2d");
const { width: w, height: h } = canvas;

// Game setup code
ctx.fillStyle = "#000";
ctx.globalAlpha = 0.02;

function loopy() {
  requestAnimationFrame(loopy);

  // Game logic code
  ctx.save();
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.globalAlpha = 1;

  // Random circle
  const x = Math.random() * w;
  const y = Math.random() * h;
  const radius = Math.random() * 20;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
requestAnimationFrame(loopy);
