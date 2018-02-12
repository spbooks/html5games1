import pop from "../../pop/index.js";
const { entity, Texture, TileSprite, math } = pop;

const texture = new Texture("res/images/bravedigger-tiles.png");

const states = {
  ATTACK: 0,
  EVADE: 1,
  WANDER: 2
};

class Bat extends TileSprite {
  constructor(target) {
    super(texture, 48, 48);
    this.hitBox = {
      x: 6,
      y: 6,
      w: 30,
      h: 26
    };
    this.frame.x = 3;
    this.frame.y = 1;
    this.speed = math.rand(180, 300);
    this.target = target;
    this.waypoint = null;

    this.state = states.ATTACK;
  }

  update(dt, t) {
    const { pos, speed, target, waypoint, state } = this;

    const angle = entity.angle(target, this);
    const distance = entity.distance(target, this);
    let xo = 0;
    let yo = 0;
    let waypointAngle;
    let waypointDistance;

    if (state === states.ATTACK) {
      xo = Math.cos(angle) * speed * dt;
      yo = Math.sin(angle) * speed * dt;
      if (distance < 60) {
        this.state = states.EVADE;
      }
    } else if (state === states.EVADE) {
      xo = -Math.cos(angle) * speed * dt;
      yo = -Math.sin(angle) * speed * dt;
      if (distance > 120) {
        if (math.randOneIn(2)) {
          this.state = states.WANDER;
          this.waypoint = {
            x: pos.x + math.rand(-200, 200),
            y: pos.y + math.rand(-200, 200)
          };
        } else {
          this.state = states.ATTACK;
        }
      }
    } else if (state === states.WANDER) {
      waypointAngle = math.angle(waypoint, pos);
      waypointDistance = math.distance(pos, waypoint);

      xo = Math.cos(waypointAngle) * speed * dt;
      yo = Math.sin(waypointAngle) * speed * dt;
      if (waypointDistance < 60) {
        this.state = states.EVADE;
      }
    }
    pos.x += xo;
    pos.y += yo;

    this.frame.x = ((t / 0.1) | 0) % 2 + 3;
  }
}

export default Bat;
