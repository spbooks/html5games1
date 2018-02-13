import entity from "../utils/entity.js";

/*
  Expects:
  * an entity (with pos vector, w & h)
  * a Pop TileMap
  * The x and y amount *requesting* to move (no checks if 0)
*/

function wallslide(ent, map, x = 0, y = 0) {
  let tiles;
  let tileEdge;
  const bounds = entity.bounds(ent);
  const hits = { up: false, down: false, left: false, right: false };

  // Final amounts of movement to allow
  let xo = x;
  let yo = y;

  // Check vertical movement
  if (y !== 0) {
    tiles = map.tilesAtCorners(bounds, 0, yo);
    const [tl, tr, bl, br] = tiles.map(t => t && t.frame.walkable);

    // Hit your head
    if (y < 0 && !(tl && tr)) {
      hits.up = true;
      tileEdge = tiles[0].pos.y + tiles[0].h;
      yo = tileEdge - bounds.y;
    }
    // Hit your feet
    if (y > 0 && !(bl && br)) {
      hits.down = true;
      tileEdge = tiles[2].pos.y - 1;
      yo = tileEdge - (bounds.y + bounds.h);
    }
  }

  // Check horizontal movement
  if (x !== 0) {
    tiles = map.tilesAtCorners(bounds, xo, yo);
    const [tl, tr, bl, br] = tiles.map(t => t && t.frame.walkable);

    // Hit left tile
    if (x < 0 && !(tl && bl)) {
      hits.left = true;
      tileEdge = tiles[0].pos.x + tiles[0].w;
      xo = tileEdge - bounds.x;
    }
    // Hit right tile
    if (x > 0 && !(tr && br)) {
      hits.right = true;
      tileEdge = tiles[1].pos.x - 1;
      xo = tileEdge - (bounds.x + bounds.w);
    }
  }

  // xo & yo contain the amount we're allowed to move by, and any hit tiles
  return { x: xo, y: yo, hits };
}

export default wallslide;
