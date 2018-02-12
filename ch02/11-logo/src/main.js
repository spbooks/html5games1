const canvas = document.querySelector("#board canvas");
const ctx = canvas.getContext("2d");
const { width: w, height: h } = canvas;

// Starfield!
ctx.fillStyle = "#444";
let x, y, radius;
for (let i = 0; i < 550; i++) {
  x = Math.random() * w;
  y = Math.random() * h;
  radius = Math.random() * 3;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.fill();
}

ctx.translate(225, 150);

// Draw the words as a mask
ctx.font = "bold 70pt monospace";
ctx.fillStyle = "black";
ctx.fillText("MOM", 10, 60);
ctx.fillText("POP", 10, 118);

// Draw lines over the mask
ctx.globalCompositeOperation = "source-atop";

// Rainbow!
for (let i = 0; i < 6; i++) {
  ctx.fillStyle = `hsl(${i * (250 / 6)}, 90%, 55%)`;
  ctx.fillRect(0, i * 20, 200, 20);
}

// Draw the shadow behind the logo
ctx.fillStyle = "#999";
ctx.globalCompositeOperation = "destination-over";
ctx.fillText("MOM", 13, 62);
ctx.fillText("POP", 13, 120);
ctx.font = "30pt monospace";

// Back to default
ctx.globalCompositeOperation = "source-over";

// Add characters (so they are evenly spaced)
"games".split("").forEach((ch, i) => {
  ctx.fillText(ch, i * 37 + 12, 145);
});
