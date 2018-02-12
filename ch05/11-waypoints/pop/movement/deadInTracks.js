import entity from "../utils/entity.js";

function deadInTracks(ent, map, x = 0, y = 0) {
  const bounds = entity.bounds(ent);
  const tiles = map.tilesAtCorners(bounds, x, y);
  const walks = tiles.map(t => t && t.frame.walkable);
  const blocked = walks.some(w => !w);
  if (blocked) {
    x = 0;
    y = 0;
  }
  return { x, y };
}

export default deadInTracks;
