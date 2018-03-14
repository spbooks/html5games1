(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Anim = function () {
  function Anim(frames, rate) {
    _classCallCheck(this, Anim);

    this.frames = frames;
    this.rate = rate;
    this.reset();
  }

  _createClass(Anim, [{
    key: "reset",
    value: function reset() {
      this.frame = this.frames[0];
      this.curFrame = 0;
      this.curTime = 0;
    }
  }, {
    key: "update",
    value: function update(dt) {
      var rate = this.rate,
          frames = this.frames;

      if ((this.curTime += dt) > rate) {
        this.curFrame++;
        this.frame = frames[this.curFrame % frames.length];
        this.curTime -= rate;
      }
    }
  }]);

  return Anim;
}();

var AnimManager = function () {
  function AnimManager() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { x: 0, y: 0 };

    _classCallCheck(this, AnimManager);

    this.anims = {};
    this.running = false;
    this.frameSource = e.frame || e;
    this.current = null;
  }

  _createClass(AnimManager, [{
    key: "add",
    value: function add(name, frames, speed) {
      this.anims[name] = new Anim(frames, speed);
      return this.anims[name];
    }
  }, {
    key: "update",
    value: function update(dt) {
      var current = this.current,
          anims = this.anims,
          frameSource = this.frameSource;

      if (!current) {
        return;
      }
      var anim = anims[current];
      anim.update(dt);

      // Sync the tileSprite frame
      frameSource.x = anim.frame.x;
      frameSource.y = anim.frame.y;
    }
  }, {
    key: "play",
    value: function play(anim) {
      var current = this.current,
          anims = this.anims;

      if (anim === current) {
        return;
      }
      this.current = anim;
      anims[anim].reset();
    }
  }, {
    key: "stop",
    value: function stop() {
      this.current = null;
    }
  }]);

  return AnimManager;
}();

exports.default = AnimManager;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Container2 = require("./Container.js");

var _Container3 = _interopRequireDefault(_Container2);

var _math = require("./utils/math.js");

var _math2 = _interopRequireDefault(_math);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Camera = function (_Container) {
  _inherits(Camera, _Container);

  function Camera(subject, viewport) {
    var worldSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : viewport;

    _classCallCheck(this, Camera);

    var _this = _possibleConstructorReturn(this, (Camera.__proto__ || Object.getPrototypeOf(Camera)).call(this));

    _this.w = viewport.w;
    _this.h = viewport.h;
    _this.worldSize = worldSize;
    _this.setSubject(subject);
    return _this;
  }

  _createClass(Camera, [{
    key: "setSubject",
    value: function setSubject(e) {
      this.subject = e ? e.pos || e : this.pos;
      this.offset = { x: 0, y: 0 };

      // Center on the entity
      if (e && e.w) {
        this.offset.x += e.w / 2;
        this.offset.y += e.h / 2;
      }
      if (e && e.anchor) {
        this.offset.x -= e.anchor.x;
        this.offset.y -= e.anchor.y;
      }
      this.focus();
    }
  }, {
    key: "focus",
    value: function focus() {
      var pos = this.pos,
          w = this.w,
          h = this.h,
          worldSize = this.worldSize,
          subject = this.subject,
          offset = this.offset;


      var centeredX = subject.x + offset.x - w / 2;
      var maxX = worldSize.w - w;
      var x = -_math2.default.clamp(centeredX, 0, maxX);

      var centeredY = subject.y + offset.y - h / 2;
      var maxY = worldSize.h - h;
      var y = -_math2.default.clamp(centeredY, 0, maxY);

      pos.x = x;
      pos.y = y;
    }
  }, {
    key: "update",
    value: function update(dt, t) {
      _get(Camera.prototype.__proto__ || Object.getPrototypeOf(Camera.prototype), "update", this).call(this, dt, t);

      if (this.subject) {
        this.focus();
      }
    }
  }]);

  return Camera;
}(_Container3.default);

exports.default = Camera;

},{"./Container.js":3,"./utils/math.js":15}],3:[function(require,module,exports){
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
    key: "map",
    value: function map(f) {
      return this.children.map(f);
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

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Container = require("./Container.js");

var _Container2 = _interopRequireDefault(_Container);

var _CanvasRenderer = require("./renderer/CanvasRenderer.js");

var _CanvasRenderer2 = _interopRequireDefault(_CanvasRenderer);

var _screenCapture = require("./utils/screenCapture.js");

var _screenCapture2 = _interopRequireDefault(_screenCapture);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var STEP = 1 / 60;
var MAX_FRAME = STEP * 5;

var Game = function () {
  function Game(w, h) {
    var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "#board";

    _classCallCheck(this, Game);

    this.w = w;
    this.h = h;
    this.renderer = new _CanvasRenderer2.default(w, h);
    document.querySelector(parent).appendChild(this.renderer.view);
    (0, _screenCapture2.default)(this.renderer.view);

    this.scene = new _Container2.default();
  }

  _createClass(Game, [{
    key: "run",
    value: function run() {
      var _this = this;

      var gameUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

      var dt = 0;
      var last = 0;
      var loopy = function loopy(ms) {
        requestAnimationFrame(loopy);

        var t = ms / 1000; // Let's work in seconds
        dt = Math.min(t - last, MAX_FRAME);
        last = t;

        _this.scene.update(dt, t);
        gameUpdate(dt, t);
        _this.renderer.render(_this.scene);
      };
      requestAnimationFrame(loopy);
    }
  }]);

  return Game;
}();

exports.default = Game;

},{"./Container.js":3,"./renderer/CanvasRenderer.js":13,"./utils/screenCapture.js":16}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sprite = function Sprite(texture) {
  _classCallCheck(this, Sprite);

  this.texture = texture;
  this.pos = { x: 0, y: 0 };
  this.anchor = { x: 0, y: 0 };
  this.scale = { x: 1, y: 1 };
  this.pivot = { x: 0, y: 0 };
  this.rotation = 0;
};

exports.default = Sprite;

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Container2 = require("./Container.js");

var _Container3 = _interopRequireDefault(_Container2);

var _TileSprite = require("./TileSprite.js");

var _TileSprite2 = _interopRequireDefault(_TileSprite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TileMap = function (_Container) {
  _inherits(TileMap, _Container);

  function TileMap(tiles, mapW, mapH, tileW, tileH, texture) {
    _classCallCheck(this, TileMap);

    var _this = _possibleConstructorReturn(this, (TileMap.__proto__ || Object.getPrototypeOf(TileMap)).call(this));

    _this.mapW = mapW;
    _this.mapH = mapH;
    _this.tileW = tileW;
    _this.tileH = tileH;
    _this.w = mapW * tileW;
    _this.h = mapH * tileH;

    // Add all tile sprites
    _this.children = tiles.map(function (frame, i) {
      var s = new _TileSprite2.default(texture, tileW, tileH);
      s.frame = frame;
      s.pos.x = i % mapW * tileW;
      s.pos.y = Math.floor(i / mapW) * tileH;
      return s;
    });
    return _this;
  }

  _createClass(TileMap, [{
    key: "pixelToMapPos",
    value: function pixelToMapPos(pos) {
      var tileW = this.tileW,
          tileH = this.tileH;

      return {
        x: Math.floor(pos.x / tileW),
        y: Math.floor(pos.y / tileH)
      };
    }
  }, {
    key: "mapToPixelPos",
    value: function mapToPixelPos(mapPos) {
      var tileW = this.tileW,
          tileH = this.tileH;

      return {
        x: mapPos.x * tileW,
        y: mapPos.y * tileH
      };
    }
  }, {
    key: "tileAtMapPos",
    value: function tileAtMapPos(mapPos) {
      return this.children[mapPos.y * this.mapW + mapPos.x];
    }
  }, {
    key: "tileAtPixelPos",
    value: function tileAtPixelPos(pos) {
      return this.tileAtMapPos(this.pixelToMapPos(pos));
    }
  }, {
    key: "setFrameAtMapPos",
    value: function setFrameAtMapPos(mapPos, frame) {
      var tile = this.tileAtMapPos(mapPos);
      tile.frame = frame;
      return tile;
    }
  }, {
    key: "setFrameAtPixelPos",
    value: function setFrameAtPixelPos(pos, frame) {
      return this.setFrameAtMapPos(this.pixelToMapPos(pos), frame);
    }
  }]);

  return TileMap;
}(_Container3.default);

exports.default = TileMap;

},{"./Container.js":3,"./TileSprite.js":9}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Sprite2 = require("./Sprite.js");

var _Sprite3 = _interopRequireDefault(_Sprite2);

var _AnimManager = require("./AnimManager.js");

var _AnimManager2 = _interopRequireDefault(_AnimManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TileSprite = function (_Sprite) {
  _inherits(TileSprite, _Sprite);

  function TileSprite(texture, w, h) {
    _classCallCheck(this, TileSprite);

    var _this = _possibleConstructorReturn(this, (TileSprite.__proto__ || Object.getPrototypeOf(TileSprite)).call(this, texture));

    _this.tileW = w;
    _this.tileH = h;
    _this.frame = { x: 0, y: 0 };
    _this.anims = new _AnimManager2.default(_this);
    return _this;
  }

  _createClass(TileSprite, [{
    key: "update",
    value: function update(dt) {
      this.anims.update(dt);
    }
  }, {
    key: "w",
    get: function get() {
      return this.tileW * Math.abs(this.scale.x);
    }
  }, {
    key: "h",
    get: function get() {
      return this.tileH * Math.abs(this.scale.y);
    }
  }]);

  return TileSprite;
}(_Sprite3.default);

exports.default = TileSprite;

},{"./AnimManager.js":1,"./Sprite.js":5}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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
      var xr = el.width / el.clientWidth;
      var yr = el.height / el.clientHeight;
      pos.x = (clientX - rect.left) * xr;
      pos.y = (clientY - rect.top) * yr;
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

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Camera = require("./Camera.js");

var _Camera2 = _interopRequireDefault(_Camera);

var _CanvasRenderer = require("./renderer/CanvasRenderer.js");

var _CanvasRenderer2 = _interopRequireDefault(_CanvasRenderer);

var _Container = require("./Container.js");

var _Container2 = _interopRequireDefault(_Container);

var _entity = require("./utils/entity.js");

var _entity2 = _interopRequireDefault(_entity);

var _Game = require("./Game.js");

var _Game2 = _interopRequireDefault(_Game);

var _KeyControls = require("./controls/KeyControls.js");

var _KeyControls2 = _interopRequireDefault(_KeyControls);

var _math = require("./utils/math.js");

var _math2 = _interopRequireDefault(_math);

var _MouseControls = require("./controls/MouseControls.js");

var _MouseControls2 = _interopRequireDefault(_MouseControls);

var _Sprite = require("./Sprite.js");

var _Sprite2 = _interopRequireDefault(_Sprite);

var _Text = require("./Text.js");

var _Text2 = _interopRequireDefault(_Text);

var _Texture = require("./Texture.js");

var _Texture2 = _interopRequireDefault(_Texture);

var _TileMap = require("./TileMap.js");

var _TileMap2 = _interopRequireDefault(_TileMap);

var _TileSprite = require("./TileSprite.js");

var _TileSprite2 = _interopRequireDefault(_TileSprite);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Camera: _Camera2.default,
  CanvasRenderer: _CanvasRenderer2.default,
  Container: _Container2.default,
  entity: _entity2.default,
  Game: _Game2.default,
  KeyControls: _KeyControls2.default,
  math: _math2.default,
  MouseControls: _MouseControls2.default,
  Sprite: _Sprite2.default,
  Text: _Text2.default,
  Texture: _Texture2.default,
  TileMap: _TileMap2.default,
  TileSprite: _TileSprite2.default
};

},{"./Camera.js":2,"./Container.js":3,"./Game.js":4,"./Sprite.js":5,"./Text.js":6,"./Texture.js":7,"./TileMap.js":8,"./TileSprite.js":9,"./controls/KeyControls.js":10,"./controls/MouseControls.js":11,"./renderer/CanvasRenderer.js":13,"./utils/entity.js":14,"./utils/math.js":15}],13:[function(require,module,exports){
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
          if (child.anchor) ctx.translate(child.anchor.x, child.anchor.y);
          if (child.scale) ctx.scale(child.scale.x, child.scale.y);
          if (child.rotation) {
            var px = child.pivot ? child.pivot.x : 0;
            var py = child.pivot ? child.pivot.y : 0;
            ctx.translate(px, py);
            ctx.rotate(child.rotation);
            ctx.translate(-px, -py);
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
            var img = child.texture.img;
            if (child.tileW) {
              ctx.drawImage(img, child.frame.x * child.tileW, child.frame.y * child.tileH, child.tileW, child.tileH, 0, 0, child.tileW, child.tileH);
            } else {
              ctx.drawImage(img, 0, 0);
            }
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

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _math = require("./math.js");

var _math2 = _interopRequireDefault(_math);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function center(entity) {
  var pos = entity.pos,
      w = entity.w,
      h = entity.h;

  return {
    x: pos.x + w / 2,
    y: pos.y + h / 2
  };
}

function distance(a, b) {
  return _math2.default.distance(center(a), center(b));
}

exports.default = {
  center: center,
  distance: distance
};

},{"./math.js":15}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function clamp(x, min, max) {
  return Math.max(min, Math.min(x, max));
}

function distance(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;

  return Math.sqrt(dx * dx + dy * dy);
}

function rand(min, max) {
  return Math.floor(randf(min, max));
}

function randf(min, max) {
  if (max == null) {
    max = min || 1;
    min = 0;
  }
  return Math.random() * (max - min) + min;
}

function randOneFrom(items) {
  return items[rand(items.length)];
}

function randOneIn() {
  var max = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;

  return rand(0, max) === 0;
}

exports.default = {
  clamp: clamp,
  distance: distance,
  rand: rand,
  randf: randf,
  randOneFrom: randOneFrom,
  randOneIn: randOneIn
};

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var screenCapture = function screenCapture(canvas) {
  document.addEventListener("keydown", function (_ref) {
    var which = _ref.which;

    if (which === 192 /* ~ key */) {
        var img = new Image();
        img.src = canvas.toDataURL("image/png");
        img.style.width = "150px";
        img.style.height = "100px";
        document.body.appendChild(img);
      }
  }, false);
};

exports.default = screenCapture;

},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("../pop/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TileMap = _index2.default.TileMap,
    Texture = _index2.default.Texture,
    math = _index2.default.math;


var texture = new Texture("res/images/tiles.png");

var Level = function (_TileMap) {
  _inherits(Level, _TileMap);

  function Level(w, h) {
    _classCallCheck(this, Level);

    var tileSize = 32;
    var mapW = Math.ceil(w / tileSize);
    var mapH = Math.ceil(h / tileSize);

    var level = [];
    var totalFreeSpots = 0;
    for (var i = 0; i < mapW * mapH; i++) {
      var isTopOrBottom = i < mapW || Math.floor(i / mapW) === mapH - 1;
      var isLeft = i % mapW === 0;
      var isRight = i % mapW === mapW - 1;
      var isSecondRow = (i / mapW | 0) === 1;

      if (isTopOrBottom) {
        level.push({ x: 2, y: 1 });
      } else if (isLeft) {
        level.push({ x: 1, y: 1 });
      } else if (isRight) {
        level.push({ x: 3, y: 1 });
      } else if (isSecondRow) {
        level.push({ x: 4, y: 1 });
      } else {
        // Random ground tile
        level.push({ x: math.rand(1, 5), y: 0 });
        totalFreeSpots++;
      }
    }

    var _this = _possibleConstructorReturn(this, (Level.__proto__ || Object.getPrototypeOf(Level)).call(this, level, mapW, mapH, tileSize, tileSize, texture));

    _this.bounds = {
      left: tileSize,
      right: w - tileSize * 2,
      top: tileSize * 2,
      bottom: h - tileSize * 2
    };

    _this.totalFreeSpots = totalFreeSpots;
    _this.blank = { x: 0, y: 0 };
    _this.lastTile = null;
    return _this;
  }

  _createClass(Level, [{
    key: "getRandomPos",
    value: function getRandomPos() {
      var w = this.w,
          h = this.h,
          blank = this.blank,
          bounds = this.bounds;

      var found = false;
      var x = void 0,
          y = void 0;

      while (!found) {
        x = math.rand(w);
        y = math.rand(h);
        var isCleared = this.tileAtPixelPos({ x: x, y: y }).frame === blank;
        var inBounds = x > bounds.left && x < bounds.right && y > bounds.top && y < bounds.bottom;

        if (inBounds && !isCleared) {
          found = true;
        }
      }
      return this.mapToPixelPos(this.pixelToMapPos({ x: x, y: y }));
    }
  }, {
    key: "checkGround",
    value: function checkGround(pos) {
      var blank = this.blank,
          lastTile = this.lastTile;

      var tile = this.tileAtPixelPos(pos);
      if (lastTile === tile) {
        return "checked";
      }
      this.lastTile = tile;
      if (tile.frame !== blank) {
        this.setFrameAtPixelPos(pos, blank);
        return "solid";
      }
      return "cleared";
    }
  }]);

  return Level;
}(TileMap);

exports.default = Level;

},{"../pop/index.js":12}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("../../pop/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TileSprite = _index2.default.TileSprite,
    Texture = _index2.default.Texture;


var texture = new Texture("res/images/baddie-walk.png");

var Baddie = function (_TileSprite) {
  _inherits(Baddie, _TileSprite);

  function Baddie() {
    var xSpeed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
    var ySpeed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, Baddie);

    var _this = _possibleConstructorReturn(this, (Baddie.__proto__ || Object.getPrototypeOf(Baddie)).call(this, texture, 32, 32));

    _this.xSpeed = xSpeed;
    _this.ySpeed = ySpeed;
    if (xSpeed !== 0) {
      _this.frame.x = xSpeed < 0 ? 2 : 0;
    } else {
      _this.frame.x = ySpeed < 0 ? 3 : 1;
    }
    return _this;
  }

  _createClass(Baddie, [{
    key: "update",
    value: function update(dt) {
      var pos = this.pos,
          xSpeed = this.xSpeed,
          ySpeed = this.ySpeed;

      pos.x += xSpeed * dt;
      pos.y += ySpeed * dt;
    }
  }]);

  return Baddie;
}(TileSprite);

exports.default = Baddie;

},{"../../pop/index.js":12}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("../../pop/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var math = _index2.default.math,
    Sprite = _index2.default.Sprite,
    Texture = _index2.default.Texture;


var texture = new Texture("res/images/cloud.png");

var Cloud = function (_Sprite) {
  _inherits(Cloud, _Sprite);

  function Cloud(pos) {
    var life = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    _classCallCheck(this, Cloud);

    var _this = _possibleConstructorReturn(this, (Cloud.__proto__ || Object.getPrototypeOf(Cloud)).call(this, texture));

    _this.life = life;
    _this.pos.x = pos.x - 16;
    _this.pos.y = pos.y - 16;
    return _this;
  }

  _createClass(Cloud, [{
    key: "update",
    value: function update(dt) {
      // Jiggle!
      this.pos.x += math.randf(-1, 1);
      this.pos.y += math.randf(-1, 1);

      if ((this.life -= dt) < 0) {
        this.dead = true;
      }
    }
  }]);

  return Cloud;
}(Sprite);

exports.default = Cloud;

},{"../../pop/index.js":12}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = require("../../pop/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var math = _index2.default.math,
    TileSprite = _index2.default.TileSprite,
    Texture = _index2.default.Texture;


var BONUS_WORD = "jackpots";
var texture = new Texture("res/images/jackpots.png");

var Jackpot = function (_TileSprite) {
  _inherits(Jackpot, _TileSprite);

  function Jackpot() {
    _classCallCheck(this, Jackpot);

    var _this = _possibleConstructorReturn(this, (Jackpot.__proto__ || Object.getPrototypeOf(Jackpot)).call(this, texture, 32, 32));

    _this.name = BONUS_WORD;
    _this.letter = math.randOneFrom(BONUS_WORD.split(""));
    _this.frame.x = BONUS_WORD.indexOf(_this.letter);
    return _this;
  }

  return Jackpot;
}(TileSprite);

Jackpot.BONUS_WORD = BONUS_WORD;

exports.default = Jackpot;

},{"../../pop/index.js":12}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("../../pop/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TileSprite = _index2.default.TileSprite,
    Texture = _index2.default.Texture;


var texture = new Texture("res/images/pickups.png");

var pickups = {
  bomb: { frames: [[3, 0], [3, 1]], life: 10 },
  death: { frames: [[0, 0], [1, 0]], life: 30 },
  shoes: { frames: [[1, 1]], life: 10 }
};

var Pickup = function (_TileSprite) {
  _inherits(Pickup, _TileSprite);

  function Pickup(name) {
    _classCallCheck(this, Pickup);

    var _this = _possibleConstructorReturn(this, (Pickup.__proto__ || Object.getPrototypeOf(Pickup)).call(this, texture, 32, 32));

    _this.name = name;
    _this.frames = pickups[name].frames.map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          x = _ref2[0],
          y = _ref2[1];

      return { x: x, y: y };
    });
    _this.liveForever = false;
    _this.life = pickups[name].life;
    _this.speed = 100;
    return _this;
  }

  _createClass(Pickup, [{
    key: "update",
    value: function update(dt, t) {
      var frames = this.frames,
          speed = this.speed,
          liveForever = this.liveForever;

      this.frame = frames[Math.floor(t / speed) % frames.length];

      if (liveForever) return;
      var life = this.life -= dt;
      if (life < 2) {
        this.visible = (t / 0.1 | 0) % 2;
      }
      if (life < 0) {
        this.dead = true;
      }
    }
  }]);

  return Pickup;
}(TileSprite);

Pickup.pickups = Object.keys(pickups);

exports.default = Pickup;

},{"../../pop/index.js":12}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _index = require("../../pop/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TileSprite = _index2.default.TileSprite,
    Texture = _index2.default.Texture;


var texture = new Texture("res/images/player-walk.png");

var Squizz = function (_TileSprite) {
  _inherits(Squizz, _TileSprite);

  function Squizz(controls) {
    _classCallCheck(this, Squizz);

    var _this = _possibleConstructorReturn(this, (Squizz.__proto__ || Object.getPrototypeOf(Squizz)).call(this, texture, 32, 32));

    _this.controls = controls;

    var anims = _this.anims;

    anims.add("walk", [0, 1, 2, 3].map(function (x) {
      return { x: x, y: 0 };
    }), 0.1);
    anims.add("power", [0, 1, 2, 3].map(function (x) {
      return { x: x, y: 1 };
    }), 0.07);

    _this.minSpeed = 0.5;
    _this.reset();

    _this.speed = _this.minSpeed;
    _this.dir = {
      x: 1,
      y: 0
    };
    _this.nextCell = _this.speed;
    return _this;
  }

  _createClass(Squizz, [{
    key: "reset",
    value: function reset() {
      this.speed = this.minSpeed * 5;
      this.powerupTime = 0;
      this.fastTime = 0;
      this.anims.play("walk");
    }
  }, {
    key: "powerUpFor",
    value: function powerUpFor() {
      var seconds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;

      this.powerupTime = seconds;
      this.anims.play("power");
    }
  }, {
    key: "update",
    value: function update(dt, t) {
      _get(Squizz.prototype.__proto__ || Object.getPrototypeOf(Squizz.prototype), "update", this).call(this, dt, t);
      var pos = this.pos,
          controls = this.controls,
          anims = this.anims,
          minSpeed = this.minSpeed,
          dir = this.dir;

      var speed = this.speed;

      if ((this.nextCell -= dt) <= 0) {
        this.nextCell += speed;
        var x = controls.x,
            y = controls.y;

        if (x && x !== dir.x) {
          dir.x = x;
          dir.y = 0;
          pos.y = Math.round(pos.y / 32) * 32;
        } else if (y && y !== dir.y) {
          dir.x = 0;
          dir.y = y;
          pos.x = Math.round(pos.x / 32) * 32;
        }
      }

      // Speed adjustments
      if (this.speed > minSpeed) {
        this.speed -= dt;
      }
      if ((this.fastTime -= dt) > 0) {
        speed /= 1.33;
      }

      pos.x += dir.x * dt * (32 / speed);
      pos.y += dir.y * dt * (32 / speed);

      // Powerball blink mode!
      this.visible = true;
      if (this.powerupTime > 0) {
        var time = this.powerupTime -= dt;
        // Blink when nearly done
        if (time < 1.5) {
          this.visible = t / 0.1 % 2 | 0;
        }
        if (time < 0) {
          anims.play("walk");
        }
      }
    }
  }, {
    key: "isPoweredUp",
    get: function get() {
      return this.powerupTime > 0;
    }
  }]);

  return Squizz;
}(TileSprite);

exports.default = Squizz;

},{"../../pop/index.js":12}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var highscore = {
  bestScore: 0,
  bestComplete: 0
};

exports.default = highscore;

},{}],24:[function(require,module,exports){
"use strict";

var _index = require("../pop/index.js");

var _index2 = _interopRequireDefault(_index);

var _LogoScreen = require("./screens/LogoScreen.js");

var _LogoScreen2 = _interopRequireDefault(_LogoScreen);

var _TitleScreen = require("./screens/TitleScreen.js");

var _TitleScreen2 = _interopRequireDefault(_TitleScreen);

var _GameScreen = require("./screens/GameScreen.js");

var _GameScreen2 = _interopRequireDefault(_GameScreen);

var _GameOverScreen = require("./screens/GameOverScreen.js");

var _GameOverScreen2 = _interopRequireDefault(_GameOverScreen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Game = _index2.default.Game,
    KeyControls = _index2.default.KeyControls;


var game = new Game(640, 480);
var controls = new KeyControls();

function titleScreen() {
  game.scene = new _TitleScreen2.default(game, controls, newGame);
}

function gameOverScreen(result) {
  game.scene = new _GameOverScreen2.default(game, controls, result, titleScreen);
}

function newGame() {
  game.scene = new _GameScreen2.default(game, controls, gameOverScreen);
}

game.scene = new _LogoScreen2.default(game, titleScreen);
game.run();

},{"../pop/index.js":12,"./screens/GameOverScreen.js":25,"./screens/GameScreen.js":26,"./screens/LogoScreen.js":27,"./screens/TitleScreen.js":28}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _index = require("../../pop/index.js");

var _index2 = _interopRequireDefault(_index);

var _hiscore = require("../hiscore.js");

var _hiscore2 = _interopRequireDefault(_hiscore);

var _Level = require("../Level.js");

var _Level2 = _interopRequireDefault(_Level);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Container = _index2.default.Container,
    Text = _index2.default.Text;

var GameOverScreen = function (_Container) {
  _inherits(GameOverScreen, _Container);

  function GameOverScreen(game, controls, stats, onStart) {
    _classCallCheck(this, GameOverScreen);

    var _this = _possibleConstructorReturn(this, (GameOverScreen.__proto__ || Object.getPrototypeOf(GameOverScreen)).call(this));

    _this.onStart = onStart;
    _this.controls = controls;
    controls.reset();

    var drawText = function drawText(msg, pos) {
      var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 24;

      var font = size + "pt 'VT323', monospace";
      var text = new Text(msg, { font: font, fill: "#111", align: "center" });
      text.pos = pos;
      _this.add(text);
    };

    _this.add(new _Level2.default(game.w, game.h));

    var complete = (stats.pellets / stats.maxPellets * 100).toFixed(1);
    if (stats.score > _hiscore2.default.bestScore) {
      _hiscore2.default.bestScore = stats.score;
    }
    if (complete > _hiscore2.default.bestComplete) {
      _hiscore2.default.bestComplete = complete;
    }

    drawText("GAME OVER", { x: game.w / 2, y: 120 }, 44);
    drawText("Completed: " + complete + "%", { x: game.w / 2, y: 230 }, 30);
    drawText("best: " + _hiscore2.default.bestComplete + "%", { x: game.w / 2, y: 260 });
    drawText("Score: " + stats.score, { x: game.w / 2, y: 310 }, 30);
    drawText("best: " + _hiscore2.default.bestScore, { x: game.w / 2, y: 340 });
    return _this;
  }

  _createClass(GameOverScreen, [{
    key: "update",
    value: function update(dt, t) {
      _get(GameOverScreen.prototype.__proto__ || Object.getPrototypeOf(GameOverScreen.prototype), "update", this).call(this, dt, t);

      if (this.controls.action) {
        this.onStart();
      }
    }
  }]);

  return GameOverScreen;
}(Container);

exports.default = GameOverScreen;

},{"../../pop/index.js":12,"../Level.js":17,"../hiscore.js":23}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _index = require("../../pop/index.js");

var _index2 = _interopRequireDefault(_index);

var _Level = require("../Level.js");

var _Level2 = _interopRequireDefault(_Level);

var _Squizz = require("../entities/Squizz.js");

var _Squizz2 = _interopRequireDefault(_Squizz);

var _Baddie = require("../entities/Baddie.js");

var _Baddie2 = _interopRequireDefault(_Baddie);

var _Pickup = require("../entities/Pickup.js");

var _Pickup2 = _interopRequireDefault(_Pickup);

var _Cloud = require("../entities/Cloud.js");

var _Cloud2 = _interopRequireDefault(_Cloud);

var _Jackpot = require("../entities/Jackpot.js");

var _Jackpot2 = _interopRequireDefault(_Jackpot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Camera = _index2.default.Camera,
    Container = _index2.default.Container,
    Text = _index2.default.Text,
    Texture = _index2.default.Texture,
    TileSprite = _index2.default.TileSprite,
    math = _index2.default.math,
    entity = _index2.default.entity;


var SCORE_BADDIES = 999;
var SCORE_PELLET = 8;
var SCORE_JACKPOT = 51;
var SCORE_POWERBALL = 42;

var textures = {
  jackpots: new Texture("res/images/jackpots.png"),
  squizz: new Texture("res/images/player-walk.png")
};

var GameScreen = function (_Container) {
  _inherits(GameScreen, _Container);

  function GameScreen(game, controls, gameOver) {
    _classCallCheck(this, GameScreen);

    var _this = _possibleConstructorReturn(this, (GameScreen.__proto__ || Object.getPrototypeOf(GameScreen)).call(this));

    _this.gameOver = gameOver;

    var level = new _Level2.default(game.w * 3, game.h * 2);
    var squizz = new _Squizz2.default(controls);
    squizz.pos = {
      x: level.w / 2 | 0,
      y: level.h / 2 | 0
    };

    var camera = _this.add(new Camera(squizz, { w: game.w, h: game.h }, { w: level.w, h: level.h }, 0.08));

    // Add roaming baddies
    _this.baddies = _this.addBaddies(level);

    // Refueling power-ups
    _this.pickups = new Container();
    _this.lastPickupAt = 0;

    // Add it all to the game camera
    camera.add(level);
    camera.add(_this.pickups);
    camera.add(_this.baddies);
    camera.add(squizz);

    // Add static graphic elements
    _this.gui = _this.createGUI(game);
    _this.letters = _this.createBonusLetters();

    _this.stats = {
      pellets: 0,
      maxPellets: level.totalFreeSpots,
      lives: 3,
      score: 0,
      lettersHave: ""
    };

    _this.updateLivesIcons();

    // Keep references to things we need in "update"
    _this.level = level;
    _this.camera = camera;
    _this.squizz = squizz;
    return _this;
  }

  _createClass(GameScreen, [{
    key: "addBaddies",
    value: function addBaddies(level) {
      var baddies = new Container();
      for (var i = 0; i < 5; i++) {
        var b = baddies.add(new _Baddie2.default(200, 0));
        b.pos.y = (level.h / 5 | 0) * i + level.tileH * 2;
      }
      for (var _i = 0; _i < 10; _i++) {
        var _b = baddies.add(new _Baddie2.default(0, 200));
        _b.pos.x = (level.w / 10 | 0) * _i + level.tileW;
      }
      return baddies;
    }
  }, {
    key: "addScore",
    value: function addScore(score) {
      var stats = this.stats,
          gui = this.gui;

      var complete = stats.pellets / stats.maxPellets * 100;

      stats.score += score;
      gui.score.text = stats.score;
      gui.complete.text = complete.toFixed(1) + "%";
    }
  }, {
    key: "createGUI",
    value: function createGUI(game) {
      var _this2 = this;

      var font = { font: "28pt 'VT323', monospace", fill: "#5f0" };
      var complete = this.add(new Text("", font));
      var score = this.add(new Text("", Object.assign({ align: "center" }, font)));
      complete.pos = { x: 20, y: 20 };
      score.pos = { x: game.w / 2, y: 20 };

      this.livesIcons = Array.from(new Array(4), function (_, i) {
        var icon = _this2.add(new TileSprite(textures.squizz, 32, 32));
        icon.pos = {
          x: game.w - 48,
          y: i * 48 + 180
        };
        return icon;
      });

      return {
        complete: complete,
        score: score
      };
    }
  }, {
    key: "createBonusLetters",
    value: function createBonusLetters() {
      var _this3 = this;

      return _Jackpot2.default.BONUS_WORD.split("").map(function (ch, i) {
        var letter = _this3.add(new TileSprite(textures.jackpots, 32, 32));
        letter.frame.x = i;
        letter.pos = { x: 10, y: i * 32 + 128 };
        letter.scale = { x: 0.75, y: 0.75 };
        letter.visible = false;
        return letter;
      });
    }
  }, {
    key: "updateLivesIcons",
    value: function updateLivesIcons() {
      var _this4 = this;

      this.livesIcons.forEach(function (icon, i) {
        icon.visible = i < _this4.stats.lives - 1;
      });
    }
  }, {
    key: "loseLife",
    value: function loseLife() {
      var squizz = this.squizz,
          stats = this.stats;


      squizz.reset();
      this.addCloud(squizz.pos);

      if (--stats.lives === 0) {
        this.gameOver(stats);
      }
      this.updateLivesIcons();
    }
  }, {
    key: "addCloud",
    value: function addCloud(pos) {
      var camera = this.camera;

      camera.add(new _Cloud2.default(pos));
    }
  }, {
    key: "addPickup",
    value: function addPickup() {
      var stats = this.stats,
          level = this.level,
          pickups = this.pickups;

      var pickup = math.randOneFrom(_Pickup2.default.pickups);
      var p = pickups.add(new _Pickup2.default(pickup));
      if (pickup === "death") {
        // One less cell that user can possibly fill
        stats.maxPellets--;
        p.life *= 3; // death stays for a long time.
      }
      p.pos = level.getRandomPos();
    }
  }, {
    key: "addBonusLetter",
    value: function addBonusLetter() {
      var level = this.level,
          pickups = this.pickups;

      var p = pickups.add(new _Jackpot2.default());
      p.pos = level.getRandomPos();
    }
  }, {
    key: "pickupBonusLetter",
    value: function pickupBonusLetter(letter) {
      var stats = this.stats,
          letters = this.letters;

      if (stats.lettersHave.indexOf(letter) !== -1) {
        // Already have this letter
        return;
      }
      stats.lettersHave += letter;
      letters[_Jackpot2.default.BONUS_WORD.indexOf(letter)].visible = true;
      if (stats.lettersHave.length === _Jackpot2.default.BONUS_WORD.length) {
        // FREE LIFE!
        stats.lives += 1;
        stats.lettersHave = "";
        letters.forEach(function (l) {
          return l.visible = false;
        });
        this.updateLivesIcons();
      }
    }
  }, {
    key: "update",
    value: function update(dt, t) {
      _get(GameScreen.prototype.__proto__ || Object.getPrototypeOf(GameScreen.prototype), "update", this).call(this, dt, t);
      var squizz = this.squizz,
          level = this.level,
          stats = this.stats;

      // Make this game harder the longer you play

      squizz.minSpeed -= 0.005 * dt;
      squizz.speed -= 0.004 * dt;

      // Update game containers
      this.updatePickups(t);
      this.updateBaddies();

      // Confine player to the level bounds
      var pos = squizz.pos;
      var _level$bounds = level.bounds,
          top = _level$bounds.top,
          bottom = _level$bounds.bottom,
          left = _level$bounds.left,
          right = _level$bounds.right;

      pos.x = math.clamp(pos.x, left, right);
      pos.y = math.clamp(pos.y, top, bottom);

      // See if we're on new ground
      var ground = level.checkGround(entity.center(squizz));
      if (ground === "solid") {
        stats.pellets++;
        this.addScore(SCORE_PELLET);
      }
      if (ground === "cleared" && !squizz.isPoweredUp) {
        this.loseLife();
      }
      // Flash the background if in powerup mode
      level.blank.y = squizz.isPoweredUp && t / 100 % 2 | 0 ? 1 : 0;
    }
  }, {
    key: "updatePickups",
    value: function updatePickups(t) {
      var _this5 = this;

      var squizz = this.squizz,
          lastPickupAt = this.lastPickupAt;

      // Check for collisions

      this.pickups.map(function (p) {
        if (entity.distance(squizz, p) < 32) {
          switch (p.name) {
            case "jackpots":
              _this5.pickupBonusLetter(p.letter);
              _this5.addScore(SCORE_JACKPOT);
              break;
            case "bomb":
              squizz.powerUpFor(4);
              _this5.addScore(SCORE_POWERBALL);
              break;
            case "shoes":
              squizz.fastTime = 3;
              break;
            case "death":
              _this5.loseLife();
          }
          p.dead = true;
        }
      });

      // Add new pickup item
      if (t - lastPickupAt > 1) {
        this.lastPickupAt = t;
        this.addPickup();
        // ... and maybe a bonus letter
        if (math.randOneIn(3)) {
          this.addBonusLetter();
        }
      }
    }
  }, {
    key: "updateBaddies",
    value: function updateBaddies() {
      var _this6 = this;

      var squizz = this.squizz,
          level = this.level;


      this.baddies.map(function (b) {
        var pos = b.pos;

        if (entity.distance(squizz, b) < 32) {
          // A hit!
          _this6.addCloud(pos);
          _this6.addScore(SCORE_BADDIES);

          if (!squizz.isPoweredUp) {
            _this6.loseLife();
          }

          // Send off screen for a bit
          if (b.xSpeed) pos.x = -level.w;else pos.y = -level.h;
        }

        // Screen wrap
        if (pos.x > level.w) pos.x = -32;
        if (pos.y > level.h) pos.y = -32;
      });
    }
  }]);

  return GameScreen;
}(Container);

exports.default = GameScreen;

},{"../../pop/index.js":12,"../Level.js":17,"../entities/Baddie.js":18,"../entities/Cloud.js":19,"../entities/Jackpot.js":20,"../entities/Pickup.js":21,"../entities/Squizz.js":22}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _index = require("../../pop/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Container = _index2.default.Container,
    Sprite = _index2.default.Sprite,
    Texture = _index2.default.Texture;

var texture = new Texture("res/images/logo-mompop.png");

var LogoScreen = function (_Container) {
  _inherits(LogoScreen, _Container);

  function LogoScreen(game, onStart) {
    _classCallCheck(this, LogoScreen);

    var _this = _possibleConstructorReturn(this, (LogoScreen.__proto__ || Object.getPrototypeOf(LogoScreen)).call(this));

    _this.onStart = onStart;
    _this.life = 2;

    var logo = _this.logo = _this.add(new Sprite(texture));
    logo.pos = { x: 220, y: 130 };
    return _this;
  }

  _createClass(LogoScreen, [{
    key: "update",
    value: function update(dt, t) {
      _get(LogoScreen.prototype.__proto__ || Object.getPrototypeOf(LogoScreen.prototype), "update", this).call(this, dt, t);
      this.life -= dt;

      var logo = this.logo,
          life = this.life;

      if (life < 0) {
        this.onStart();
      }
      if (life < 0.4) {
        logo.pos.y -= 1000 * dt;
      }
    }
  }]);

  return LogoScreen;
}(Container);

exports.default = LogoScreen;

},{"../../pop/index.js":12}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _index = require("../../pop/index.js");

var _index2 = _interopRequireDefault(_index);

var _Squizz = require("../entities/Squizz.js");

var _Squizz2 = _interopRequireDefault(_Squizz);

var _Pickup = require("../entities/Pickup.js");

var _Pickup2 = _interopRequireDefault(_Pickup);

var _Level = require("../Level.js");

var _Level2 = _interopRequireDefault(_Level);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Container = _index2.default.Container,
    Text = _index2.default.Text;

var TitleScreen = function (_Container) {
  _inherits(TitleScreen, _Container);

  function TitleScreen(game, controls, onStart) {
    _classCallCheck(this, TitleScreen);

    var _this = _possibleConstructorReturn(this, (TitleScreen.__proto__ || Object.getPrototypeOf(TitleScreen)).call(this));

    _this.onStart = onStart;
    _this.controls = controls;
    controls.reset();

    var drawText = function drawText(msg, pos) {
      var size = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 24;

      var font = size + "pt 'VT323', monospace";
      var text = new Text(msg, { font: font, fill: "#111" });
      text.pos = pos;
      return _this.add(text);
    };

    var addIcon = function addIcon(type, x, y) {
      var icon = _this.add(new _Pickup2.default(type));
      icon.liveForever = true;
      icon.pos.x = x;
      icon.pos.y = y;
    };

    _this.add(new _Level2.default(game.w, game.h));

    _this.title = drawText("SQUIZZBALL", { x: 230, y: 100 }, 40);

    drawText("Fill up the screen!", { x: 220, y: 200 });
    drawText("Shoes go fast, and...", { x: 220, y: 250 });
    drawText("Star is power, but...", { x: 220, y: 300 });
    drawText("Avoid death at all cost.", { x: 220, y: 350 });

    var fakeControls = {
      x: 0,
      y: 0,
      action: false
    };
    var squizz = _this.add(new _Squizz2.default(fakeControls));
    squizz.update = function () {};
    squizz.pos = { x: 140, y: 200 };

    addIcon("shoes", 140, 250);
    addIcon("bomb", 140, 300);
    addIcon("death", 140, 350);
    return _this;
  }

  _createClass(TitleScreen, [{
    key: "update",
    value: function update(dt, t) {
      _get(TitleScreen.prototype.__proto__ || Object.getPrototypeOf(TitleScreen.prototype), "update", this).call(this, dt, t);
      var title = this.title,
          controls = this.controls;

      title.pos.y += Math.sin(t / 0.3) * 0.3;
      title.pos.x += Math.cos(t / 0.25) * 0.3;
      if (controls.action) {
        this.onStart();
      }
    }
  }]);

  return TitleScreen;
}(Container);

exports.default = TitleScreen;

},{"../../pop/index.js":12,"../Level.js":17,"../entities/Pickup.js":21,"../entities/Squizz.js":22}]},{},[24]);
