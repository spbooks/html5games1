class MouseControls {
  constructor(container) {
    this.el = container || document.body;

    this.pos = { x: 0, y: 0 };
    this.isDown = false;
    this.pressed = false;
    this.released = false;

    // Handlers
    document.addEventListener("mousedown", e => this.down(e), false);
    document.addEventListener("mouseup", e => this.up(e), false);
    document.addEventListener("mousemove", e => this.move(e), false);
  }

  mousePosFromEvent({ clientX, clientY }) {
    const { el, pos } = this;
    const rect = el.getBoundingClientRect();
    const xr = el.width / el.clientWidth;
    const yr = el.height / el.clientHeight;
    pos.x = (clientX - rect.left) * xr;
    pos.y = (clientY - rect.top) * yr;
  }

  down(e) {
    this.isDown = true;
    this.pressed = true;
    this.mousePosFromEvent(e);
  }

  up() {
    this.isDown = false;
    this.released = true;
  }

  move(e) {
    this.mousePosFromEvent(e);
  }

  update() {
    this.released = false;
    this.pressed = false;
  }
}

export default MouseControls;
