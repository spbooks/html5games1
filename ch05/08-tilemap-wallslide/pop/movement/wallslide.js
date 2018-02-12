import entity from "../utils/entity.js";

function wallslide(ent, map, x = 0, y = 0) {
  let tiles;
  const bounds = entity.bounds(ent);

  // Final amounts of movement to allow
  let xo = x;
  let yo = y;

  // Check vertical movement
  if (y !== 0) {
    tiles = map.tilesAtCorners(bounds, 0, yo);
    const [tl, tr, bl, br] = tiles.map(t => t && t.frame.walkable);

    // Hit your head
    if (y < 0 && !(tl && tr)) {
      yo = 0;
    }
    // Hit your feet
    if (y > 0 && !(bl && br)) {
      yo = 0;
    }
  }

  // Check horizontal movement
  if (x !== 0) {
    tiles = map.tilesAtCorners(bounds, xo, yo);
    const [tl, tr, bl, br] = tiles.map(t => t && t.frame.walkable);

    // Hit left edge
    if (x < 0 && !(tl && bl)) {
      xo = 0;
    }
    // Hit right edge
    if (x > 0 && !(tr && br)) {
      xo = 0;
    }
  }
  // xo & yo contain the amount we're allowed to move by.
  return { x: xo, y: yo };
}

export default wallslide;
