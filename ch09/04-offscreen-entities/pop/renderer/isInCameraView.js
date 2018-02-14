export default function isInCameraView(e, camera) {
  const tmpDbg = 50; // To show rendering doesn't happen outside box.
  return e.pos.x + e.w >= -camera.pos.x + tmpDbg &&
    e.pos.x <= -camera.pos.x + camera.w - tmpDbg &&
    e.pos.y + e.h >= -camera.pos.y + tmpDbg &&
    e.pos.y <= -camera.pos.y + camera.h - tmpDbg;
}
