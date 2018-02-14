function tiledParser(json) {
  const {
    tilewidth: tileW,
    tileheight: tileH,
    width: mapW,
    height: mapH,
    layers,
    tilesets
  } = json;

  const getLayer = name => {
    const layer = layers.find(l => l.name === name);
    if (!layer) {
      throw new Error(`Tiled error: Missing layer "${name}".`);
    }
    return layer;
  };

  const getTileset = idx => {
    if (!tilesets || !tilesets[idx]) {
      throw new Error(`Tiled error: Missing tileset index ${idx}`);
    }
    return tilesets[idx];
  };

  const levelLayer = getLayer("Level");
  const entitiesLayer = getLayer("Entities");
  const entities = entitiesLayer.objects.map(
    ({ x, y, width, height, properties, type, name }) => ({
      x,
      y: y - height, // Fix tiled Y alignment
      width,
      height,
      properties,
      type,
      name
    })
  );

  const getObjectsByType = (type, mandatory = false) => {
    const es = entities.filter(o => o.type === type);
    if (!es.length && mandatory) {
      throw new Error(`Tiled error: Missing an object of type "${type}"`);
    }
    return es;
  };

  const getObjectByName = (name, mandatory = false) => {
    const e = entities.find(o => o.name === name);
    if (!e && mandatory) {
      throw new Error(`Tiled error: Missing named object "${name}"`);
    }
    return e;
  };

  // Map the Tiled level data to our game format
  const tileset = getTileset(0);
  const props = tileset.tileproperties; // Extra tile properties: walkable, clouds
  const tilesPerRow = Math.floor(tileset.imagewidth / tileset.tilewidth);
  const tiles = levelLayer.data.map(cell => {
    const idx = cell - tileset.firstgid; // Get correct Tiled offset
    return Object.assign({}, props && props[idx] || {}, {
      x: idx % tilesPerRow,
      y: Math.floor(idx / tilesPerRow)
    });
  });

  return {
    tileW,
    tileH,
    mapW,
    mapH,
    tiles,

    getObjectByName,
    getObjectsByType
  };
}

export default tiledParser;
