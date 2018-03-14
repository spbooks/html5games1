(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Container = function () {
  function Container() {
    _classCallCheck(this, Container);

    this.pos = { x: 0, y: 0 };
    this.children = [];
  }

  _createClass(Container, [{
    key: "add",
    value: function add(child) {
      this.children.push(child);
      return child;
    }
  }, {
    key: "remove",
    value: function remove(child) {
      this.children = this.children.filter(function (c) {
        return c !== child;
      });
      return child;
    }
  }, {
    key: "update",
    value: function update(dt, t) {
      var _this = this;

      this.children = this.children.filter(function (child) {
        if (child.update) {
          child.update(dt, t, _this);
        }
        return child.dead ? false : true;
      });
    }
  }]);

  return Container;
}();

exports.default = Container;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sprite = function Sprite(texture) {
  _classCallCheck(this, Sprite);

  this.texture = texture;
  this.pos = { x: 0, y: 0 };
};

exports.default = Sprite;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Text = function Text() {
  var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  _classCallCheck(this, Text);

  this.pos = { x: 0, y: 0 };
  this.text = text;
  this.style = style;
};

exports.default = Text;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Texture = function Texture(url) {
  _classCallCheck(this, Texture);

  this.img = new Image();
  this.img.src = url;
};

exports.default = Texture;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KeyControls = function () {
  function KeyControls() {
    var _this = this;

    _classCallCheck(this, KeyControls);

    this.keys = {};

    // Bind event handlers
    document.addEventListener("keydown", function (e) {
      if ([37, 38, 39, 40, 32].indexOf(e.which) >= 0) {
        e.preventDefault();
      }
      _this.keys[e.which] = true;
    }, false);

    document.addEventListener("keyup", function (e) {
      _this.keys[e.which] = false;
    }, false);
  }

  _createClass(KeyControls, [{
    key: "key",
    value: function key(_key, value) {
      if (value !== undefined) {
        this.keys[_key] = value;
      }
      return this.keys[_key];
    }
  }, {
    key: "reset",
    value: function reset() {
      for (var key in this.keys) {
        this.keys[key] = false;
      }
    }

    // Handle key actions

  }, {
    key: "action",
    get: function get() {
      return this.keys[32];
    }
  }, {
    key: "x",
    get: function get() {
      if (this.keys[37] || this.keys[65]) {
        return -1;
      }
      if (this.keys[39] || this.keys[68]) {
        return 1;
      }
      return 0;
    }
  }, {
    key: "y",
    get: function get() {
      if (this.keys[38] || this.keys[87]) {
        return -1;
      }
      if (this.keys[40] || this.keys[83]) {
        return 1;
      }
      return 0;
    }
  }]);

  return KeyControls;
}();

exports.default = KeyControls;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MouseControls = function () {
  function MouseControls(container) {
    var _this = this;

    _classCallCheck(this, MouseControls);

    this.el = container || document.body;

    this.pos = { x: 0, y: 0 };
    this.isDown = false;
    this.pressed = false;
    this.released = false;

    // Handlers
    document.addEventListener("mousedown", function (e) {
      return _this.down(e);
    }, false);
    document.addEventListener("mouseup", function (e) {
      return _this.up(e);
    }, false);
    document.addEventListener("mousemove", function (e) {
      return _this.move(e);
    }, false);
  }

  _createClass(MouseControls, [{
    key: "mousePosFromEvent",
    value: function mousePosFromEvent(_ref) {
      var clientX = _ref.clientX,
          clientY = _ref.clientY;
      var el = this.el,
          pos = this.pos;

      var rect = el.getBoundingClientRect();
      pos.x = clientX - rect.left;
      pos.y = clientY - rect.top;
    }
  }, {
    key: "down",
    value: function down(e) {
      this.isDown = true;
      this.pressed = true;
      this.mousePosFromEvent(e);
    }
  }, {
    key: "up",
    value: function up() {
      this.isDown = false;
      this.released = true;
    }
  }, {
    key: "move",
    value: function move(e) {
      this.mousePosFromEvent(e);
    }
  }, {
    key: "update",
    value: function update() {
      this.released = false;
      this.pressed = false;
    }
  }]);

  return MouseControls;
}();

exports.default = MouseControls;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Container = require("./Container.js");

var _Container2 = _interopRequireDefault(_Container);

var _CanvasRenderer = require("./renderer/CanvasRenderer.js");

var _CanvasRenderer2 = _interopRequireDefault(_CanvasRenderer);

var _KeyControls = require("./controls/KeyControls.js");

var _KeyControls2 = _interopRequireDefault(_KeyControls);

var _MouseControls = require("./controls/MouseControls.js");

var _MouseControls2 = _interopRequireDefault(_MouseControls);

var _Sprite = require("./Sprite.js");

var _Sprite2 = _interopRequireDefault(_Sprite);

var _Text = require("./Text.js");

var _Text2 = _interopRequireDefault(_Text);

var _Texture = require("./Texture.js");

var _Texture2 = _interopRequireDefault(_Texture);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  CanvasRenderer: _CanvasRenderer2.default,
  Container: _Container2.default,
  KeyControls: _KeyControls2.default,
  MouseControls: _MouseControls2.default,
  Sprite: _Sprite2.default,
  Text: _Text2.default,
  Texture: _Texture2.default
};

},{"./Container.js":1,"./Sprite.js":2,"./Text.js":3,"./Texture.js":4,"./controls/KeyControls.js":5,"./controls/MouseControls.js":6,"./renderer/CanvasRenderer.js":8}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CanvasRenderer = function () {
  function CanvasRenderer(w, h) {
    _classCallCheck(this, CanvasRenderer);

    var canvas = document.createElement("canvas");
    this.w = canvas.width = w;
    this.h = canvas.height = h;
    this.view = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.textBaseline = "top";
  }

  _createClass(CanvasRenderer, [{
    key: "render",
    value: function render(container) {
      var clear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (container.visible == false) {
        return;
      }
      var ctx = this.ctx;


      function renderRec(container) {
        // Render the container children
        container.children.forEach(function (child) {
          if (child.visible == false) {
            return;
          }
          ctx.save();

          // Handle transforms
          if (child.pos) {
            ctx.translate(Math.round(child.pos.x), Math.round(child.pos.y));
          }

          // Draw the leaf nodes
          if (child.text) {
            var _child$style = child.style,
                font = _child$style.font,
                fill = _child$style.fill,
                align = _child$style.align;

            if (font) ctx.font = font;
            if (fill) ctx.fillStyle = fill;
            if (align) ctx.textAlign = align;
            ctx.fillText(child.text, 0, 0);
          } else if (child.texture) {
            ctx.drawImage(child.texture.img, 0, 0);
          }

          // Render any child sub-nodes
          if (child.children) {
            renderRec(child);
          }
          ctx.restore();
        });
      }

      if (clear) {
        ctx.clearRect(0, 0, this.w, this.h);
      }
      renderRec(container);
    }
  }]);

  return CanvasRenderer;
}();

exports.default = CanvasRenderer;

},{}],9:[function(require,module,exports){
"use strict";

var _index = require("../pop/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CanvasRenderer = _index2.default.CanvasRenderer,
    Container = _index2.default.Container,
    KeyControls = _index2.default.KeyControls,
    Text = _index2.default.Text,
    Texture = _index2.default.Texture,
    Sprite = _index2.default.Sprite;

// Game setup code

var w = 640;
var h = 300;
var renderer = new CanvasRenderer(w, h);
document.querySelector("#board").appendChild(renderer.view);

// Load game textures
var textures = {
  background: new Texture("res/images/bg.png"),
  spaceship: new Texture("res/images/spaceship.png"),
  bullet: new Texture("res/images/bullet.png"),
  baddie: new Texture("res/images/baddie.png")
};

// Game objects
var scene = new Container();
var controls = new KeyControls();

// Make a spaceship
var ship = new Sprite(textures.spaceship);
ship.pos.x = 120;
ship.pos.y = h / 2 - 16;
ship.update = function (dt) {
  var pos = this.pos;

  pos.x += controls.x * dt * 200;
  pos.y += controls.y * dt * 200;

  // Confine player to the screen
  if (pos.x < 0) pos.x = 0;
  if (pos.x > w) pos.x = w;
  if (pos.y < 0) pos.y = 0;
  if (pos.y > h) pos.y = h;
};

// Bullets
var bullets = new Container();
function bulletMove(dt) {
  this.pos.x += 400 * dt;
}
function fireBullet(x, y) {
  var bullet = new Sprite(textures.bullet);
  bullet.pos.x = x;
  bullet.pos.y = y;
  bullet.update = bulletMove;
  bullets.add(bullet);
}

// Bad guys
var baddies = new Container();
function spawnBaddie(x, y, speed) {
  var baddie = new Sprite(textures.baddie);
  baddie.pos.x = x;
  baddie.pos.y = y;
  baddie.update = function (dt) {
    this.pos.x += speed * dt;
  };
  baddies.add(baddie);
}

function doGameOver() {
  var gameOverMessage = new Text("Game Over", {
    font: "30pt sans-serif",
    fill: "#8B8994",
    align: "center"
  });
  gameOverMessage.pos = { x: w / 2, y: 120 };
  scene.add(gameOverMessage);
  scene.remove(ship);
  gameOver = true;
}

// Add the score game object
var score = new Text("score:", {
  font: "20px sans-serif",
  fill: "#8B8994",
  align: "center"
});
score.pos = { x: w / 2, y: h - 30 };

// Add everything to the scene container
scene.add(new Sprite(textures.background));
scene.add(ship);
scene.add(bullets);
scene.add(baddies);
scene.add(score);

// Game state variables
var lastShot = 0;
var lastSpawn = 0;
var spawnSpeed = 1.0;
var scoreAmount = 0;
var gameOver = false;

// Main loop
var dt = 0;
var last = 0;

function loopy(ms) {
  requestAnimationFrame(loopy);

  var t = ms / 1000;
  dt = t - last;
  last = t;

  // Game logic code
  ship.pos.x += Math.sin(t * 10); // "bob" the player
  score.text = "score: " + scoreAmount; // update score

  // Check if player can fire yet
  if (!gameOver && controls.action && t - lastShot > 0.15) {
    lastShot = t;
    fireBullet(ship.pos.x + 24, ship.pos.y + 10);
  }

  // Check for collisions, or out of screen
  baddies.children.forEach(function (baddie) {
    bullets.children.forEach(function (bullet) {

      // Check distance between baddie and bullet
      var dx = baddie.pos.x + 16 - (bullet.pos.x + 8);
      var dy = baddie.pos.y + 16 - (bullet.pos.y + 8);
      if (Math.sqrt(dx * dx + dy * dy) < 24) {
        // A hit!
        bullet.dead = true;
        baddie.dead = true;
        scoreAmount += Math.floor(t);
      }
      // Bullet out of the screen?
      if (bullet.pos.x >= w + 20) {
        bullet.dead = true;
      }
    });

    // Check if baddie reached the city
    if (baddie.pos.x < -32) {
      if (!gameOver) {
        doGameOver();
      }
      baddie.dead = true;
    }
  });

  // Spawn a baddie
  if (t - lastSpawn > spawnSpeed) {
    lastSpawn = t;
    var speed = -50 - Math.random() * Math.random() * 100;
    var position = Math.random() * (h - 24);
    spawnBaddie(w, position, speed);

    // Accelerating for the next spawn
    spawnSpeed = spawnSpeed < 0.05 ? 0.6 : spawnSpeed * 0.97 + 0.001;
  }

  // Update & render everything
  scene.update(dt, t);
  renderer.render(scene);
}
requestAnimationFrame(loopy);

},{"../pop/index.js":7}]},{},[9]);
