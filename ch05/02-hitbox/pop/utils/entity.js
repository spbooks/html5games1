import math from "./math.js";
import Rect from "../Rect.js";

function addDebug(e) {
  e.children = e.children || [];
  const bb = new Rect(e.w, e.h, { fill: "rgba(255, 0, 0, 0.3)" });
  e.children.push(bb);
  if (e.hitBox) {
    const { x, y, w, h } = e.hitBox;
    const hb = new Rect(w, h, { fill: "rgba(255, 0, 0, 0.5)" });
    hb.pos.x = x;
    hb.pos.y = y;
    e.children.push(hb);
  }
  return e;
}

function center(entity) {
  const { pos, w, h } = entity;
  return {
    x: pos.x + w / 2,
    y: pos.y + h / 2
  };
}

function distance(a, b) {
  return math.distance(center(a), center(b));
}

export default {
  addDebug,
  center,
  distance
};
