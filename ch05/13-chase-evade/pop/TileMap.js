import Container from "./Container.js";
import TileSprite from "./TileSprite.js";

class TileMap extends Container {
  constructor(tiles, mapW, mapH, tileW, tileH, texture) {
    super();
    this.mapW = mapW;
    this.mapH = mapH;
    this.tileW = tileW;
    this.tileH = tileH;
    this.w = mapW * tileW;
    this.h = mapH * tileH;

    // Add all tile sprites
    this.children = tiles.map((frame, i) => {
      const s = new TileSprite(texture, tileW, tileH);
      s.frame = frame;
      s.pos.x = i % mapW * tileW;
      s.pos.y = Math.floor(i / mapW) * tileH;
      return s;
    });
  }

  pixelToMapPos(pos) {
    const { tileW, tileH } = this;
    return {
      x: Math.floor(pos.x / tileW),
      y: Math.floor(pos.y / tileH)
    };
  }

  mapToPixelPos(mapPos) {
    const { tileW, tileH } = this;
    return {
      x: mapPos.x * tileW,
      y: mapPos.y * tileH
    };
  }

  tileAtMapPos(mapPos) {
    return this.children[mapPos.y * this.mapW + mapPos.x];
  }

  tileAtPixelPos(pos) {
    return this.tileAtMapPos(this.pixelToMapPos(pos));
  }

  setFrameAtMapPos(mapPos, frame) {
    const tile = this.tileAtMapPos(mapPos);
    tile.frame = frame;
    return tile;
  }

  setFrameAtPixelPos(pos, frame) {
    return this.setFrameAtMapPos(this.pixelToMapPos(pos), frame);
  }

  tilesAtCorners(bounds, xo = 0, yo = 0) {
    return [
      [bounds.x, bounds.y], // Top-left
      [bounds.x + bounds.w, bounds.y], // Top-right
      [bounds.x, bounds.y + bounds.h], // Bottom-left
      [bounds.x + bounds.w, bounds.y + bounds.h] // Bottom-right
    ].map(([x, y]) =>
      this.tileAtPixelPos({
        x: x + xo,
        y: y + yo
      })
    );
  }
}

export default TileMap;
