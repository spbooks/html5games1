import Trigger from "./Trigger.js";

class Door extends Trigger {
  constructor(properties, onCollide) {
    super({ w: 22, h: 30, x:12, y: 11 }, onCollide);
    this.type = "Door";
    this.properties = properties;
  }
  serialize() {
    const { pos: { x, y }, type, properties } = this;
    return { type, x, y, properties };
  }
}

export default Door;
