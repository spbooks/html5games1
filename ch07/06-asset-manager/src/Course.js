import pop from "../pop/index.js";
const { Container, math, Vec } = pop;

// import { Bodies, Body } from "matter-js";
import Matter from "../vendor/matter.js"; // Using local version for native module support.
const { Bodies, Body } = Matter;

class Course extends Container {
  constructor(gameW, gameH) {
    super();

    const segments = 13;
    const segmentWidth = 64;
    const xo = 15;

    let yo = math.randOneFrom([32, 128, 300]);
    let minY = yo;
    let maxY = yo;
    let holeSegment = math.rand(segments - 7, segments);

    const terrainData = Array(segments).fill(0).map((_, i) => {
      const mustBeFlat = i <= 1 || i === holeSegment;
      if (!mustBeFlat) {
        const drop = math.randOneFrom([32, 64, 152]);
        const dir = math.randOneFrom([-1, 0, 1]);

        // Random go down
        if (dir === 1 && yo - drop > 0) {
          yo -= drop;
        }

        //Random go up
        if (dir === -1 && yo + drop < 320) {
          yo += drop;
        }
        if (yo > maxY) maxY = yo;
        if (yo < minY) minY = yo;
      }
      return { x: i * segmentWidth, y: yo };
    });

    const tee = terrainData[0];
    const hole = terrainData[holeSegment];

    // Add the hole
    terrainData.splice(
      holeSegment,
      0,
      { x: hole.x - 30, y: hole.y },
      { x: hole.x - 30, y: hole.y + 25 },
      { x: hole.x - 10, y: hole.y + 25 },
      { x: hole.x - 10, y: hole.y }
    );

    // Add the base, close the path
    const { x } = terrainData[terrainData.length - 1];
    maxY += 52;
    terrainData.push({ x, y: maxY });
    terrainData.push({ x: 0, y: maxY });

    const h = gameH - (maxY - minY);

    // Create the geometry
    const terrain = Bodies.fromVertices(0, 0, terrainData, { isStatic: true });
    Body.setPosition(terrain, {
      x: -terrain.bounds.min.x + xo,
      y: h - terrain.bounds.min.y
    });

    this.path = terrainData;
    this.style = { fill: "#eee" };

    this.pos = new Vec(xo, h - minY);
    this.hole = new Vec().copy(hole).add({ x: -15, y: h - minY });
    this.tee = new Vec()
      .copy(tee)
      .add({ x: xo + segmentWidth / 2, y: h - minY - 5 });

    this.body = terrain;
  }
}

export default Course;
