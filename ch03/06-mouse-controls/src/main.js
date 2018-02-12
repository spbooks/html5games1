const canvas = document.querySelector("#board canvas");
const ctx = canvas.getContext("2d");
const mouse = new MouseControls(canvas);

// Game setup code
let color = 0;

function loopy() {
  requestAnimationFrame(loopy);

  // Game logic code
  const x = mouse.pos.x;
  const y = mouse.pos.y;
  if (mouse.pressed) {
    color += 10;
    if (color > 360) {
      color -= 360;
    }
  }

  // Draw the rectangle
  ctx.fillStyle = `hsl(${color}, 50%, 50%)`;
  ctx.fillRect(x - 25, y - 25, 50, 50);

  mouse.update();
}
requestAnimationFrame(loopy);
