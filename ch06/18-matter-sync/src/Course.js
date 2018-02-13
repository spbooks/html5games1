import pop from "../pop/index.js";
const { Rect, Vec } = pop;

// import { Bodies, Body } from "matter-js";
import Matter from "../vendor/matter.js"; // Using local version for native module support.
const { Bodies, Body } = Matter;

class Course extends Rect {
  constructor(pos) {
    super(1000, 20, { fill: "#eee" });

    this.pivot = new Vec(this.w, this.h).multiply(0.5);
    this.anchor = Vec.from(this.pivot).multiply(-1);

    // Create the course
    const body = Bodies.rectangle(0, 0, this.w, this.h, { isStatic: true });
    Body.setPosition(body, pos);
    Body.rotate(body, Math.PI * 0.04);

    // Sync the rectangle
    this.pos.copy(body.position);
    this.rotation = body.angle;

    this.body = body;
  }
}

export default Course;
