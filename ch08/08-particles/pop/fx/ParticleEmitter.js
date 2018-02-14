import Container from "../Container.js";
import Vec from "../utils/Vec.js";
import Particle from "./Particle.js";

class ParticleEmitter extends Container {
  constructor(numParticles = 20, display) {
    super();
    this.pos = new Vec();

    this.particles = Array.from(new Array(numParticles), () =>
      this.add(new Particle(display))
    );
    this.lastPlay = 0;
  }
  play(pos) {
    const now = Date.now();
    if (now - this.lastPlay < 300) return;
    this.lastPlay = now;

    this.pos.copy(pos);
    this.particles.forEach(p => {
      p.reset();
    });
  }
}

export default ParticleEmitter;
