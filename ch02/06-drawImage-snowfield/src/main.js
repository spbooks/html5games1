const canvas = document.querySelector("#board canvas");
const ctx = canvas.getContext("2d");
const { width: w, height: h } = canvas;

const img = new Image();
img.src = "res/images/snowflake.png";
img.addEventListener("load", draw, false);

function draw() {
  const { width, height } = img;

  for (let i = 0; i < 100; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    const scale = Math.random();

    ctx.drawImage(img, x, y, width * scale, height * scale);
  }
}
