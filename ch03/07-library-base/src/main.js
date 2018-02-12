import pop from "../pop/index.js";
const { Container } = pop;

// Game setup code
const scene = new Container();

// Example game element to manipulate
const player = {
  update: function() {
    console.log("updated!");
  }
};

scene.add(player);
scene.update();
scene.remove(player);

console.log(scene.children);
