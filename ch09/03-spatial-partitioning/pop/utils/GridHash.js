import entity from "./entity.js";

class GridHash {
  constructor(cellSize) {
    this.entities = {};
    this.cellSize = cellSize;
  }

  hash(pos) {
    const { cellSize } = this;
    return [Math.floor(pos.x / cellSize), Math.floor(pos.y / cellSize)];
  }

  insert(ent) {
    const b = entity.bounds(ent);
    const min = this.hash(b);
    const max = this.hash({ x: b.x + b.w, y: b.y + b.h });
    if (ent.hashMin) {
      // Entity hasn't changed cell
      if (min.toString() === ent.hashMin.toString()) {
        return;
      }
      this.remove(ent);
    }

    // Add entity to each cell it touches
    for (let j = min[1]; j < max[1] + 1; j++) {
      for (let i = min[0]; i < max[0] + 1; i++) {
        this._add([i, j], ent);
      }
    }
    ent.hashMin = min;
    ent.hashMax = max;
  }

  remove(ent) {
    const min = ent.hashMin;
    const max = ent.hashMax;
    for (let j = min[1]; j < max[1] + 1; j++) {
      for (let i = min[0]; i < max[0] + 1; i++) {
        const hash = [i, j];
        const cell = this.entities[hash];
        cell.delete(ent);
        if (cell.size == 0) {
          delete this.entities[hash];
        }
      }
    }
    ent.hashMin = null;
    ent.hashMax = null;
  }

  _add(hash, ent) {
    let cell = this.entities[hash];
    if (!cell) {
      cell = new Set();
      this.entities[hash] = cell;
    }
    cell.add(ent);
  }

}

export default GridHash;
