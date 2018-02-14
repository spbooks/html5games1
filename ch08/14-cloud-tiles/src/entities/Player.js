import pop from "../../pop/index.js";
const { entity, Texture, TileSprite, wallslide, physics, Vec } = pop;

const texture = new Texture("res/images/bravedigger-tiles.png");

const GRAVITY = 2900;
const JUMP_IMPULSE = 780;
const STEER_FORCE = 2000;
const MAX_VEL = 300;
const MIN_VEL = 200;
const FRICTION_GROUND = 1800;

const WALL_JUMP_FORGIVENESS = 0.4;
const JUMP_FORGIVENESS = 0.08;
const JUMP_WALL_IMPULSE = 500;

class Player extends TileSprite {
  constructor(controls, map) {
    super(texture, 48, 48);
    this.type = "player";
    this.controls = controls;
    this.map = map;
    this.frame.x = 4;
    this.hitBox = {
      x: 8,
      y: 10,
      w: 28,
      h: 38
    };
    this.anchor = {
      x: 0,
      y: 0
    };
    this.vel = new Vec();
    this.acc = new Vec();

    this.jumpedAt = 0;
    this.falling = true;
    this.fallingTimer = 0;

    this.wallDir = 0;
    this.wallTimer = 0;
    this.releasedAction = false;

    this.hp = 5;
    this.invincible = 0;

    this.dir = -1;
  }

  hitBy(e) {
    if (this.invincible > 0) {
      return false;
    }
    this.knockBack(e);
    this.hp -= 1;
    if (this.hp <= 0) {
      this.gameOver = true;
    } else {
      this.invincible = 1.0;
    }
    return true;
  }

  knockBack(e) {
    const { vel, acc } = this;
    const angle = entity.angle(this, e);
    const power = 400;

    vel.set(0, 0);
    acc.set(0, 0);

    const dir = new Vec(Math.cos(angle), -1).multiply(power);
    physics.applyImpulse(this, dir, 1 / 60);
  }

  update(dt, t) {
    const { pos, controls, map, gameOver, vel, falling, wallTimer } = this;
    if (gameOver) {
      this.rotation += dt * 5;
      this.pivot.y = 24;
      this.pivot.x = 24;
      return;
    }

    const { keys } = controls;
    let { x, action: jump } = keys;
    if (x) {
      this.dir = x;
    }

    // Check when buttons released before re-triggering
    if (!jump) this.releasedAction = true;

    const canWallJump = wallTimer > 0 && this.releasedAction;
    if (jump && (!falling || canWallJump)) {
      let xo = 0;
      let ypower = 1;
      if (canWallJump) {
        xo = JUMP_WALL_IMPULSE * this.wallDir * -1;
        ypower = 1.1;
        vel.y = 0;
        this.dir = this.wallDir * -1;
      }

      physics.applyImpulse(this, { x: xo, y: -JUMP_IMPULSE * ypower }, dt);

      this.wallTimer = 0;
      this.falling = true;
      this.jumpedAt = t;
      this.releasedAction = false;
    }

    if (this.falling) {
      physics.applyForce(this, { x: 0, y: GRAVITY });
    }

    // So you can jump and change dir (even though moving fast)
    const changingDirection = (x > 0 && vel.x < 0) || (x < 0 && vel.x > 0);

    // Instant speed up.
    if (this.wallTimer > 0 && x !== this.wallDir) {
      // Don't steer off the wall!
    } else if (x != 0 && Math.abs(vel.x) < MIN_VEL) {
      physics.applyForce(this, { x: x * STEER_FORCE * 2, y: 0 }, dt);
    } else if (changingDirection || (x && vel.mag() < MAX_VEL)) {
      physics.applyForce(this, { x: x * STEER_FORCE, y: 0 }, dt);
    }
    physics.applyHorizontalFriction(this, FRICTION_GROUND);

    let r = physics.integrate(this, dt);
    // Stop friction!
    if (vel.mag() <= 15) {
      vel.set(0, 0);
    }
    r = wallslide(this, map, r.x, r.y);
    pos.add(r);

    if (r.hits.down) {
      vel.y = 0;
      this.falling = false;
      this.fallingTime = 0;
      this.wallTimer = 0;
    }

    if (r.hits.up) {
      vel.y = 0;
    }

    // Wall jump detection
    this.wallTimer -= dt;
    if (r.hits.left || r.hits.right) {
      this.wallDir = r.hits.left ? -1 : 1;
      if (this.falling && this.wallTimer <= 0 && t - this.jumpedAt > 0.105) {
        // Can wall jump...
        this.wallTimer = WALL_JUMP_FORGIVENESS;
      }
      vel.x = 0;
    }

    // Check if falling
    if (!this.falling && !r.hits.down) {
      // check if UNDER current is empty...
      const e = entity.bounds(this);
      const leftFoot = map.pixelToMapPos({ x: e.x, y: e.y + e.h + 1 });
      const rightFoot = map.pixelToMapPos({ x: e.x + e.w, y: e.y + e.h + 1 });
      const left = map.tileAtMapPos(leftFoot);
      const right = map.tileAtMapPos(rightFoot);
      if (left.frame.walkable && right.frame.walkable) {
        // Allow some "jump forgiveness" when off the edge
        if (this.fallingTimer <= 0) {
          this.fallingTimer = JUMP_FORGIVENESS;
        } else {
          if ((this.fallingTimer -= dt) <= 0) {
            this.falling = true;
          }
        }
      }
    }

    // Animations
    if ((this.invincible -= dt) > 0) {
      this.alpha = (t * 10 % 2) | 0 ? 0 : 1;
      //this.visible = this.alpha > 0 ? 1 : 0;
    } else {
      this.alpha = 1;
    }

    if (x && !this.falling) {
      this.frame.x = ((t / 0.1) | 0) % 4;
      if (x > 0) {
        this.anchor.x = 0;
        this.scale.x = 1;
      } else if (x < 0){
        this.anchor.x = this.w;
        this.scale.x = -1;
      }
    }
  }
}

export default Player;
