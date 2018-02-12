const canvas = document.querySelector("#board canvas");
const ctx = canvas.getContext("2d");
console.log(ctx.canvas);

// Set colors
ctx.strokeStyle = "red";
ctx.fillStyle = "black";

// Draw rectangle
ctx.fillRect(15, 100, 300, 300);
ctx.strokeRect(15, 100, 300, 300);

// Draw circle
ctx.beginPath();
ctx.arc(480, 250, 150, 0, Math.PI * 2, false);
ctx.fill();
ctx.stroke();
