import entity from "../utils/entity.js";

/*
  Expects:
  * an entity (with pos vector, w & h)
  * a Pop TileMap
  * The x and y amount *requesting* to move (no checks if 0)
*/

const TL = 0;
const TR = 1;
const BL = 2;
const BR = 3;

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
      tileEdge = tiles[TL].pos.y + tiles[TL].h;
      yo = tileEdge - bounds.y;
    }
    const isCloud = tiles[BL].frame.cloud || tiles[BR].frame.cloud;
    if (!(bl && br) || isCloud) {
      tileEdge = tiles[BL].pos.y - 1;
      const dist = tileEdge - (bounds.y + bounds.h);
      if (!isCloud || dist > -10) {
        hits.down = true;
        yo = dist;
      }
    }
  }

  // Check horizontal movement
  if (x !== 0) {
    tiles = map.tilesAtCorners(bounds, xo, yo);
    const [tl, tr, bl, br] = tiles.map(t => t && t.frame.walkable);

    // Hit left tile
    if (x < 0 && !(tl && bl)) {
      hits.left = true;
      tileEdge = tiles[TL].pos.x + tiles[TL].w;
      xo = tileEdge - bounds.x;
    }
    // Hit right tile
    if (x > 0 && !(tr && br)) {
      hits.right = true;
      tileEdge = tiles[TR].pos.x - 1;
      xo = tileEdge - (bounds.x + bounds.w);
    }
  }

  // xo & yo contain the amount we're allowed to move by, and any hit tiles
  return { x: xo, y: yo, hits };
}

export default wallslide;
