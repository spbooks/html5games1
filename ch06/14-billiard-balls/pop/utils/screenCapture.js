const screenCapture = canvas => {
  document.addEventListener("keydown", ({which}) => {
    if (which === 192 /* ~ key */) {
      const img = new Image();
      img.src = canvas.toDataURL("image/png");
      img.style.width = "150px";
      img.style.height = "100px";
      document.body.appendChild(img);
    }
  }, false);
};

export default screenCapture;
