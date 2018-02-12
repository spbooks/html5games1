import pop from "../../pop/index.js";
const { Container, Sprite, Texture } = pop;
const texture = new Texture("res/images/logo-mompop.png");

class LogoScreen extends Container {
  constructor(game, onStart) {
    super();
    this.onStart = onStart;
    this.life = 2;

    const logo = this.logo = this.add(new Sprite(texture));
    logo.pos = { x: 220, y: 130 };
  }

  update(dt, t) {
    super.update(dt, t);
    this.life -= dt;

    const { logo, life } = this;
    if (life < 0) {
      this.onStart();
    }
    if (life < 0.4) {
      logo.pos.y -= 1000 * dt;
    }
  }
}

export default LogoScreen;
