import Container from "./Container.js";
import math from "./utils/math.js";
import Vec from "./utils/Vec.js";
import Rect from "./Rect.js";

class Camera extends Container {
  constructor(subject, viewport, worldSize = viewport) {
    super();
    this.pos = new Vec();
    this.w = viewport.w;
    this.h = viewport.h;
    this.worldSize = worldSize;

    this.shakePower = 0;
    this.shakeDecay = 0;
    this.shakeLast = new Vec();

    this.flashTime = 0;
    this.flashDuration = 0;
    this.flashRect = null;

    this.easing = 0.03;

    // Debugging tracking rectangle
    this.deb = this.add(
      new Rect(0, 0, {
        fill: "rgba(255, 0, 0, 0.2)"
      })
    );
    this.setTracking(96, 72);
    this.setSubject(subject);
    this.focus();
  }

  setSubject(e) {
    this.subject = e ? e.pos || e : this.pos;
    this.offset = { x: 0, y: 0 };

    // Center on the entity
    if (e && e.w) {
      this.offset.x += e.w / 2;
      this.offset.y += e.h / 2;
    }
    if (e && e.anchor) {
      this.offset.x -= e.anchor.x;
      this.offset.y -= e.anchor.y;
    }
    this.focus(1);
  }

  setTracking(w, h) {
    const { deb } = this;
    this.tracking = new Vec(w, h);
    if (deb) {
      deb.w = w * 2;
      deb.h = h * 2;
    }
  }

  shake(power = 8, duration = 0.5) {
    this.shakePower = power;
    this.shakeDecay = power / duration;
  }

  _shake(dt) {
    const { pos, shakePower, shakeLast } = this;
    if (shakePower <= 0) {
      shakeLast.set(0, 0);
      return;
    }
    shakeLast.set(
      math.randf(-shakePower, shakePower),
      math.randf(-shakePower, shakePower)
    );

    pos.add(shakeLast);
    this.shakePower -= this.shakeDecay * dt;
  }

  _unShake() {
    const { pos, shakeLast } = this;
    pos.subtract(shakeLast);
  }

  flash(duration = 0.3, color = "#fff") {
    if (!this.flashRect) {
      const { w, h } = this;
      this.flashRect = this.add(new Rect(w, h, { fill: color }));
    }
    this.flashRect.style.fill = color;
    this.flashDuration = duration;
    this.flashTime = duration;
  }

  _flash(dt) {
    const { flashRect, flashDuration, pos } = this;
    if (!flashRect) {
      return;
    }

    const time = (this.flashTime -= dt);
    if (time <= 0) {
      this.remove(flashRect);
      this.flashRect = null;
    } else {
      flashRect.alpha = time / flashDuration;
      flashRect.pos = Vec.from(pos).multiply(-1);
    }
  }

  focus(ease = 1, track = true) {
    const { deb, pos, worldSize, offset, subject, tracking, w, h } = this;

    const target = subject || pos;

    const centeredX = target.x + offset.x - w / 2;
    const maxX = worldSize.w - w;
    let x = -math.clamp(centeredX, 0, maxX);

    const centeredY = target.y + offset.y - h / 2;
    const maxY = worldSize.h - h;
    let y = -math.clamp(centeredY, 0, maxY);

    if (deb) {
      deb.pos.set(
        -pos.x + w / 2 - tracking.x,
        -pos.y + h / 2 - tracking.y
      );
    }

    if (track) {
      // Tracking box
      if (Math.abs(centeredX + pos.x) < tracking.x) {
        x = pos.x;
      }
      if (Math.abs(centeredY + pos.y) < tracking.y) {
        y = pos.y;
      }
    }

    pos.x = math.mix(pos.x, x, ease);
    pos.y = math.mix(pos.y, y, ease);
  }

  update(dt, t) {
    super.update(dt, t);
    this._unShake();
    if (this.subject) {
      this.focus(this.easing);
    }
    this._shake(dt);
    this._flash(dt);
  }
}

export default Camera;
