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

},{"./Container.js":3,"./utils/math.js":19}],3:[function(require,module,exports){
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

},{"./Container.js":3,"./renderer/CanvasRenderer.js":17,"./utils/screenCapture.js":20}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Rect = function Rect(w, h) {
  var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { fill: "#333" };

  _classCallCheck(this, Rect);

  this.pos = { x: 0, y: 0 };
  this.w = w;
  this.h = h;
  this.style = style;
};

exports.default = Rect;

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var State = function () {
  function State(state) {
    _classCallCheck(this, State);

    this.set(state);
  }

  _createClass(State, [{
    key: "set",
    value: function set(state) {
      this.last = this.state;
      this.state = state;
      this.time = 0;
      this.justSetState = true;
      this.first = true;
    }
  }, {
    key: "get",
    value: function get() {
      return this.state;
    }
  }, {
    key: "update",
    value: function update(dt) {
      this.first = this.justSetState;
      this.time += this.first ? 0 : dt;
      this.justSetState = false;
    }
  }, {
    key: "is",
    value: function is(state) {
      return this.state === state;
    }
  }, {
    key: "isIn",
    value: function isIn() {
      var _this = this;

      for (var _len = arguments.length, states = Array(_len), _key = 0; _key < _len; _key++) {
        states[_key] = arguments[_key];
      }

      return states.some(function (s) {
        return _this.is(s);
      });
    }
  }]);

  return State;
}();

exports.default = State;

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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
  }, {
    key: "tilesAtCorners",
    value: function tilesAtCorners(bounds) {
      var _this2 = this;

      var xo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var yo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

      return [[bounds.x, bounds.y], // Top-left
      [bounds.x + bounds.w, bounds.y], // Top-right
      [bounds.x, bounds.y + bounds.h], // Bottom-left
      [bounds.x + bounds.w, bounds.y + bounds.h] // Bottom-right
      ].map(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            x = _ref2[0],
            y = _ref2[1];

        return _this2.tileAtPixelPos({
          x: x + xo,
          y: y + yo
        });
      });
    }
  }]);

  return TileMap;
}(_Container3.default);

exports.default = TileMap;

},{"./Container.js":3,"./TileSprite.js":11}],11:[function(require,module,exports){
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

},{"./AnimManager.js":1,"./Sprite.js":6}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

var _deadInTracks = require("./movement/deadInTracks.js");

var _deadInTracks2 = _interopRequireDefault(_deadInTracks);

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

var _Rect = require("./Rect.js");

var _Rect2 = _interopRequireDefault(_Rect);

var _Sprite = require("./Sprite.js");

var _Sprite2 = _interopRequireDefault(_Sprite);

var _State = require("./State.js");

var _State2 = _interopRequireDefault(_State);

var _Text = require("./Text.js");

var _Text2 = _interopRequireDefault(_Text);

var _Texture = require("./Texture.js");

var _Texture2 = _interopRequireDefault(_Texture);

var _TileMap = require("./TileMap.js");

var _TileMap2 = _interopRequireDefault(_TileMap);

var _TileSprite = require("./TileSprite.js");

var _TileSprite2 = _interopRequireDefault(_TileSprite);

var _wallslide = require("./movement/wallslide.js");

var _wallslide2 = _interopRequireDefault(_wallslide);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Camera: _Camera2.default,
  CanvasRenderer: _CanvasRenderer2.default,
  Container: _Container2.default,
  deadInTracks: _deadInTracks2.default,
  entity: _entity2.default,
  Game: _Game2.default,
  KeyControls: _KeyControls2.default,
  math: _math2.default,
  MouseControls: _MouseControls2.default,
  Rect: _Rect2.default,
  Sprite: _Sprite2.default,
  State: _State2.default,
  Text: _Text2.default,
  Texture: _Texture2.default,
  TileMap: _TileMap2.default,
  TileSprite: _TileSprite2.default,
  wallslide: _wallslide2.default
};

},{"./Camera.js":2,"./Container.js":3,"./Game.js":4,"./Rect.js":5,"./Sprite.js":6,"./State.js":7,"./Text.js":8,"./Texture.js":9,"./TileMap.js":10,"./TileSprite.js":11,"./controls/KeyControls.js":12,"./controls/MouseControls.js":13,"./movement/deadInTracks.js":15,"./movement/wallslide.js":16,"./renderer/CanvasRenderer.js":17,"./utils/entity.js":18,"./utils/math.js":19}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _entity = require("../utils/entity.js");

var _entity2 = _interopRequireDefault(_entity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function deadInTracks(ent, map) {
  var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  var bounds = _entity2.default.bounds(ent);
  var tiles = map.tilesAtCorners(bounds, x, y);
  var walks = tiles.map(function (t) {
    return t && t.frame.walkable;
  });
  var blocked = walks.some(function (w) {
    return !w;
  });
  if (blocked) {
    x = 0;
    y = 0;
  }
  return { x: x, y: y };
}

exports.default = deadInTracks;

},{"../utils/entity.js":18}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _entity = require("../utils/entity.js");

var _entity2 = _interopRequireDefault(_entity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function wallslide(ent, map) {
  var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  var tiles = void 0;
  var tileEdge = void 0;
  var bounds = _entity2.default.bounds(ent);

  // Final amounts of movement to allow
  var xo = x;
  var yo = y;

  // Check vertical movement
  if (y !== 0) {
    tiles = map.tilesAtCorners(bounds, 0, yo);

    var _tiles$map = tiles.map(function (t) {
      return t && t.frame.walkable;
    }),
        _tiles$map2 = _slicedToArray(_tiles$map, 4),
        tl = _tiles$map2[0],
        tr = _tiles$map2[1],
        bl = _tiles$map2[2],
        br = _tiles$map2[3];

    // Hit your head


    if (y < 0 && !(tl && tr)) {
      tileEdge = tiles[0].pos.y + tiles[0].h;
      yo = tileEdge - bounds.y;
    }
    // Hit your feet
    if (y > 0 && !(bl && br)) {
      tileEdge = tiles[2].pos.y - 1;
      yo = tileEdge - (bounds.y + bounds.h);
    }
  }

  // Check horizontal movement
  if (x !== 0) {
    tiles = map.tilesAtCorners(bounds, xo, yo);

    var _tiles$map3 = tiles.map(function (t) {
      return t && t.frame.walkable;
    }),
        _tiles$map4 = _slicedToArray(_tiles$map3, 4),
        _tl = _tiles$map4[0],
        _tr = _tiles$map4[1],
        _bl = _tiles$map4[2],
        _br = _tiles$map4[3];

    // Hit left edge


    if (x < 0 && !(_tl && _bl)) {
      tileEdge = tiles[0].pos.x + tiles[0].w;
      xo = tileEdge - bounds.x;
    }
    // Hit right edge
    if (x > 0 && !(_tr && _br)) {
      tileEdge = tiles[1].pos.x - 1;
      xo = tileEdge - (bounds.x + bounds.w);
    }
  }
  // xo & yo contain the amount we're allowed to move by.
  return { x: xo, y: yo };
}

exports.default = wallslide;

},{"../utils/entity.js":18}],17:[function(require,module,exports){
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
          } else if (child.style && child.w && child.h) {
            ctx.fillStyle = child.style.fill;
            ctx.fillRect(0, 0, child.w, child.h);
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

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _math = require("./math.js");

var _math2 = _interopRequireDefault(_math);

var _Rect = require("../Rect.js");

var _Rect2 = _interopRequireDefault(_Rect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addDebug(e) {
  e.children = e.children || [];
  var bb = new _Rect2.default(e.w, e.h, { fill: "rgba(255, 0, 0, 0.3)" });
  e.children.push(bb);
  if (e.hitBox) {
    var _e$hitBox = e.hitBox,
        x = _e$hitBox.x,
        y = _e$hitBox.y,
        w = _e$hitBox.w,
        h = _e$hitBox.h;

    var hb = new _Rect2.default(w, h, { fill: "rgba(255, 0, 0, 0.5)" });
    hb.pos.x = x;
    hb.pos.y = y;
    e.children.push(hb);
  }
  return e;
}

function angle(a, b) {
  return _math2.default.angle(center(a), center(b));
}

function bounds(entity) {
  var w = entity.w,
      h = entity.h,
      pos = entity.pos,
      hitBox = entity.hitBox;

  var hit = hitBox || { x: 0, y: 0, w: w, h: h };
  return {
    x: hit.x + pos.x,
    y: hit.y + pos.y,
    w: hit.w - 1,
    h: hit.h - 1
  };
}

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

function hit(e1, e2) {
  var a = bounds(e1);
  var b = bounds(e2);
  return a.x + a.w >= b.x && a.x <= b.x + b.w && a.y + a.h >= b.y && a.y <= b.y + b.h;
}

function hits(entity, container, hitCallback) {
  var a = bounds(entity);
  container.map(function (e2) {
    var b = bounds(e2);
    if (a.x + a.w >= b.x && a.x <= b.x + b.w && a.y + a.h >= b.y && a.y <= b.y + b.h) {
      hitCallback(e2);
    }
  });
}

exports.default = {
  addDebug: addDebug,
  angle: angle,
  bounds: bounds,
  center: center,
  distance: distance,
  hit: hit,
  hits: hits
};

},{"../Rect.js":5,"./math.js":19}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function angle(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  var angle = Math.atan2(dy, dx);

  return angle;
}

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
  angle: angle,
  clamp: clamp,
  distance: distance,
  rand: rand,
  randf: randf,
  randOneFrom: randOneFrom,
  randOneIn: randOneIn
};

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _index = require("../pop/index.js");

var _index2 = _interopRequireDefault(_index);

var _Level = require("./Level.js");

var _Level2 = _interopRequireDefault(_Level);

var _Player = require("./entities/Player.js");

var _Player2 = _interopRequireDefault(_Player);

var _Pickup = require("./entities/Pickup.js");

var _Pickup2 = _interopRequireDefault(_Pickup);

var _Bat = require("./entities/Bat.js");

var _Bat2 = _interopRequireDefault(_Bat);

var _Totem = require("./entities/Totem.js");

var _Totem2 = _interopRequireDefault(_Totem);

var _Ghost = require("./entities/Ghost.js");

var _Ghost2 = _interopRequireDefault(_Ghost);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Container = _index2.default.Container,
    entity = _index2.default.entity,
    math = _index2.default.math,
    State = _index2.default.State,
    Text = _index2.default.Text;

var GameScreen = function (_Container) {
  _inherits(GameScreen, _Container);

  function GameScreen(game, controls, onGameOver) {
    _classCallCheck(this, GameScreen);

    var _this = _possibleConstructorReturn(this, (GameScreen.__proto__ || Object.getPrototypeOf(GameScreen)).call(this));

    _this.w = game.w;
    _this.h = game.h;
    _this.controls = controls;
    _this.onGameOver = onGameOver;
    var map = new _Level2.default(game.w, game.h);
    var player = new _Player2.default(controls, map);
    player.pos = map.findFreeSpot();
    player.pos.y -= 1;

    _this.state = new State("READY");

    _this.map = _this.add(map);
    _this.pickups = _this.add(new Container());
    _this.player = _this.add(player);

    var baddies = new Container();
    for (var i = 0; i < 3; i++) {
      _this.randoBat(baddies.add(new _Bat2.default(player)));
    }
    _this.baddies = _this.add(baddies);

    // Add a couple of Top-Hat Totems
    for (var _i = 0; _i < 2; _i++) {
      var t = _this.add(new _Totem2.default(player, function (b) {
        return baddies.add(b);
      }));

      var _map$findFreeSpot = map.findFreeSpot(false),
          x = _map$findFreeSpot.x,
          y = _map$findFreeSpot.y; // `false` means "NOT free"


      t.pos.x = x;
      t.pos.y = y;
    }

    var ghost = _this.add(new _Ghost2.default(player, map));
    ghost.pos.x = 100;
    ghost.pos.y = 100;
    ghost.findPath();
    _this.ghost = ghost;

    _this.populate();
    _this.score = 0;
    _this.scoreText = _this.add(new Text("0", {
      font: "40pt 'Luckiest Guy', san-serif",
      fill: "#fff",
      align: "center"
    }));
    _this.scoreText.pos = { x: game.w / 2, y: game.h / 2 - 40 };
    return _this;
  }

  _createClass(GameScreen, [{
    key: "populate",
    value: function populate() {
      var pickups = this.pickups,
          map = this.map;

      for (var i = 0; i < 5; i++) {
        var p = pickups.add(new _Pickup2.default());
        p.pos = map.findFreeSpot();
      }
    }
  }, {
    key: "randoBat",
    value: function randoBat(bat) {
      var w = this.w,
          h = this.h;

      var angle = math.randf(Math.PI * 2);
      bat.pos.x = Math.cos(angle) * 300 + w / 2;
      bat.pos.y = Math.sin(angle) * 300 + h / 2;
      bat.speed = math.rand(70, 150);
      return bat;
    }
  }, {
    key: "update",
    value: function update(dt, t) {
      var controls = this.controls,
          player = this.player,
          state = this.state;


      switch (state.get()) {
        case "READY":
          if (state.first) {
            this.scoreText.text = "GET READY";
          }
          if (state.time > 2) {
            this.scoreText.text = "0";
            state.set("PLAYING");
          }
          break;

        case "PLAYING":
          _get(GameScreen.prototype.__proto__ || Object.getPrototypeOf(GameScreen.prototype), "update", this).call(this, dt, t);
          this.updatePlaying();
          break;

        case "GAMEOVER":
          if (state.first) {
            player.gameOver = true;
            this.scoreText.text = "DEAD. Score: " + this.score;
          }
          _get(GameScreen.prototype.__proto__ || Object.getPrototypeOf(GameScreen.prototype), "update", this).call(this, dt, t);

          // If player dead, wait for space bar
          if (player.gameOver && controls.action) {
            this.onGameOver();
          }
          break;
      }

      state.update(dt);
    }
  }, {
    key: "updatePlaying",
    value: function updatePlaying() {
      var _this2 = this;

      var baddies = this.baddies,
          player = this.player,
          ghost = this.ghost,
          pickups = this.pickups,
          state = this.state;

      baddies.map(function (baddie) {
        if (entity.hit(player, baddie)) {
          state.set("GAMEOVER");
          baddie.dead = true;
        }
      });

      if (entity.hit(player, ghost)) {
        player.gameOver = true;
        state.set("GAMEOVER");
      }

      // Collect pickup!
      entity.hits(player, pickups, function (p) {
        p.dead = true;
        _this2.score++;
        if (pickups.children.length === 1) {
          _this2.populate();
          _this2.score += 5;
        }
        _this2.scoreText.text = _this2.score;
      });
    }
  }]);

  return GameScreen;
}(Container);

exports.default = GameScreen;

},{"../pop/index.js":14,"./Level.js":22,"./entities/Bat.js":23,"./entities/Ghost.js":25,"./entities/Pickup.js":26,"./entities/Player.js":27,"./entities/Totem.js":28}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("../pop/index.js");

var _index2 = _interopRequireDefault(_index);

var _easystar = require("../vendor/easystar-0.4.2.js");

var _easystar2 = _interopRequireDefault(_easystar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TileMap = _index2.default.TileMap,
    Texture = _index2.default.Texture,
    math = _index2.default.math;
// import EasyStar from "easystarjs";
// Using local version for native module support.

var texture = new Texture("res/images/bravedigger-tiles.png");

var Level = function (_TileMap) {
  _inherits(Level, _TileMap);

  function Level(w, h) {
    _classCallCheck(this, Level);

    var tileSize = 48;
    var mapW = Math.floor(w / tileSize);
    var mapH = Math.floor(h / tileSize);

    var tileIndexes = [{ id: "empty", x: 0, y: 2, walkable: true }, { id: "wall", x: 2, y: 2 }, { id: "wall3D", x: 3, y: 2 }, { id: "empty_fancy", x: 1, y: 2, walkable: true }];
    var getTile = function getTile(id) {
      return tileIndexes.find(function (t) {
        return t.id == id;
      });
    };
    var getIdx = function getIdx(id) {
      return tileIndexes.indexOf(getTile(id));
    };

    // Make a random dungeon
    var level = Array(mapW * mapH).fill(getIdx("empty"));
    for (var y = 0; y < mapH; y++) {
      for (var x = 0; x < mapW; x++) {
        if (math.randOneIn(10)) {
          level[y * mapW + x] = getIdx("empty_fancy"); // Fancy rock
        }
        // Map borders
        if (y === 0 || x === 0 || y === mapH - 1 || x === mapW - 1) {
          level[y * mapW + x] = getIdx("wall");
          continue;
        }
        // Grid points - randomly skip some to make "rooms"
        if (y % 2 || x % 2 || math.randOneIn(4)) {
          continue;
        }
        level[y * mapW + x] = 1;
        // Side walls - pick a random direction

        var _math$randOneFrom = math.randOneFrom([[1, 0], [0, 1], [0, -1], [-1, 0]]),
            _math$randOneFrom2 = _slicedToArray(_math$randOneFrom, 2),
            xo = _math$randOneFrom2[0],
            yo = _math$randOneFrom2[1];

        level[(y + yo) * mapW + (x + xo)] = 1;
      }
    }

    // faux 3D look
    for (var _y = 0; _y < mapH - 1; _y++) {
      for (var _x = 0; _x < mapW; _x++) {
        var below = level[(_y + 1) * mapW + _x];
        var me = level[_y * mapW + _x];
        if (me === getIdx("wall") && below !== getIdx("wall")) {
          level[_y * mapW + _x] = getIdx("wall3D");
        }
      }
    }

    // Translate the one-dimensional level into path-finder 2d array
    var _this = _possibleConstructorReturn(this, (Level.__proto__ || Object.getPrototypeOf(Level)).call(this, level.map(function (i) {
      return tileIndexes[i];
    }), mapW, mapH, tileSize, tileSize, texture));

    var grid = [];
    for (var i = 0; i < level.length; i += mapW) {
      grid.push(level.slice(i, i + mapW));
    }

    // Create a path finding thing
    var path = new _easystar2.default.js();
    path.setGrid(grid);
    // Get the walkable tile indexes
    var walkables = tileIndexes.map(function (_ref, i) {
      var walkable = _ref.walkable;
      return walkable ? i : -1;
    }).filter(function (i) {
      return i !== -1;
    });
    path.setAcceptableTiles(walkables);

    _this.path = path;
    return _this;
  }

  _createClass(Level, [{
    key: "findFreeSpot",
    value: function findFreeSpot() {
      var isFree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var mapW = this.mapW,
          mapH = this.mapH;

      var found = false;
      var x = void 0,
          y = void 0;
      while (!found) {
        x = math.rand(mapW);
        y = math.rand(mapH);

        var _tileAtMapPos = this.tileAtMapPos({ x: x, y: y }),
            frame = _tileAtMapPos.frame;

        if (!!frame.walkable == isFree) {
          found = true;
        }
      }
      return this.mapToPixelPos({ x: x, y: y });
    }
  }]);

  return Level;
}(TileMap);

exports.default = Level;

},{"../pop/index.js":14,"../vendor/easystar-0.4.2.js":30}],23:[function(require,module,exports){
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

var Texture = _index2.default.Texture,
    TileSprite = _index2.default.TileSprite,
    entity = _index2.default.entity,
    math = _index2.default.math,
    State = _index2.default.State;


var texture = new Texture("res/images/bravedigger-tiles.png");

var states = {
  ATTACK: 0,
  EVADE: 1,
  WANDER: 2
};

var Bat = function (_TileSprite) {
  _inherits(Bat, _TileSprite);

  function Bat(target) {
    _classCallCheck(this, Bat);

    var _this = _possibleConstructorReturn(this, (Bat.__proto__ || Object.getPrototypeOf(Bat)).call(this, texture, 48, 48));

    _this.hitBox = {
      x: 6,
      y: 6,
      w: 30,
      h: 26
    };
    _this.frame.x = 3;
    _this.frame.y = 1;
    _this.speed = 100;
    _this.target = target;
    _this.waypoint = null;

    _this.state = new State(states.ATTACK);
    return _this;
  }

  _createClass(Bat, [{
    key: "update",
    value: function update(dt, t) {
      var pos = this.pos,
          frame = this.frame,
          speed = this.speed,
          target = this.target,
          waypoint = this.waypoint,
          state = this.state;


      var angle = entity.angle(target, this);
      var distance = entity.distance(target, this);
      var xo = 0;
      var yo = 0;
      var waypointAngle = void 0;
      var waypointDistance = void 0;

      switch (state.get()) {
        case states.ATTACK:
          xo = Math.cos(angle) * speed * dt;
          yo = Math.sin(angle) * speed * dt;
          if (distance < 60) {
            state.set(states.EVADE);
          }
          break;
        case states.EVADE:
          xo = -Math.cos(angle) * speed * dt;
          yo = -Math.sin(angle) * speed * dt;
          if (distance > 120) {
            if (math.randOneIn(2)) {
              state.set(states.WANDER);
              this.waypoint = {
                x: pos.x + math.rand(-200, 200),
                y: pos.y + math.rand(-200, 200)
              };
            } else {
              state.set(states.ATTACK);
            }
          }
          break;
        case states.WANDER:
          waypointAngle = math.angle(waypoint, pos);
          waypointDistance = math.distance(pos, waypoint);

          xo = Math.cos(waypointAngle) * speed * dt;
          yo = Math.sin(waypointAngle) * speed * dt;
          if (waypointDistance < 60) {
            state.set(states.EVADE);
          }
          break;
      }
      pos.x += xo;
      pos.y += yo;

      frame.x = (t / 0.1 | 0) % 2 + 3;
      state.update(dt);
    }
  }]);

  return Bat;
}(TileSprite);

exports.default = Bat;

},{"../../pop/index.js":14}],24:[function(require,module,exports){
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

var Texture = _index2.default.Texture,
    TileSprite = _index2.default.TileSprite,
    math = _index2.default.math;


var texture = new Texture("res/images/bravedigger-tiles.png");

var Bullet = function (_TileSprite) {
  _inherits(Bullet, _TileSprite);

  function Bullet(dir) {
    var speed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

    _classCallCheck(this, Bullet);

    var _this = _possibleConstructorReturn(this, (Bullet.__proto__ || Object.getPrototypeOf(Bullet)).call(this, texture, 48, 48));

    _this.hitBox = {
      x: 24,
      y: 12,
      w: 24,
      h: 26
    };
    _this.frame.x = 4;
    _this.frame.y = 2;
    _this.pivot.x = 24;
    _this.pivot.y = 24;
    _this.speed = speed;
    _this.dir = dir;
    _this.life = 3;
    _this.rotation = math.angle(dir, { x: 0, y: 0 });
    return _this;
  }

  _createClass(Bullet, [{
    key: "update",
    value: function update(dt) {
      var pos = this.pos,
          speed = this.speed,
          dir = this.dir;

      // Move in the direction of the path

      pos.x += speed * dt * dir.x;
      pos.y += speed * dt * dir.y;

      //this.rotation += Math.PI * 2 * dt;
      this.rotation += math.randf(-Math.PI, Math.PI) * dt;

      if ((this.life -= dt) < 0) {
        this.dead = true;
      }
    }
  }]);

  return Bullet;
}(TileSprite);

exports.default = Bullet;

},{"../../pop/index.js":14}],25:[function(require,module,exports){
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

var Texture = _index2.default.Texture,
    TileSprite = _index2.default.TileSprite,
    entity = _index2.default.entity;


var texture = new Texture("res/images/bravedigger-tiles.png");

var Ghost = function (_TileSprite) {
  _inherits(Ghost, _TileSprite);

  function Ghost(target, map) {
    _classCallCheck(this, Ghost);

    var _this = _possibleConstructorReturn(this, (Ghost.__proto__ || Object.getPrototypeOf(Ghost)).call(this, texture, 48, 48));

    _this.hitBox = {
      x: 6,
      y: 3,
      w: 32,
      h: 32
    };
    _this.frame.x = 5;
    _this.frame.y = 1;
    _this.speed = 100;
    _this.target = target;
    _this.waypoint = null;
    _this.map = map;
    return _this;
  }

  _createClass(Ghost, [{
    key: "findPath",
    value: function findPath() {
      var _this2 = this;

      // Calculate the path-finding path
      var map = this.map,
          target = this.target;

      var s = map.pixelToMapPos(entity.center(this));
      var d = map.pixelToMapPos(entity.center(target));
      var start = performance.now();
      var s2 = Date.now();
      map.path.findPath(s.x, s.y, d.x, d.y, function (path) {
        _this2.path = path || [];
        var end = performance.now();
        console.log("Pathfinding took " + (end - start) + " ms", Date.now() - s2);
        // Pathfinding took 13.8799999999992 ms
      });
      map.path.calculate();
    }
  }, {
    key: "followPath",
    value: function followPath(dt) {
      var map = this.map,
          speed = this.speed,
          path = this.path,
          pos = this.pos,
          hitBox = this.hitBox;
      // Move along the path

      if (!path.length) {
        return;
      }

      var cell = this.path[0];
      // Move in the direction of the path
      var xo = cell.x * map.tileW - (pos.x - hitBox.x);
      var yo = cell.y * map.tileH - (pos.y - hitBox.y);

      var closeX = Math.abs(xo) <= 2;
      var closeY = Math.abs(yo) <= 2;
      if (!closeX) pos.x += Math.sign(xo) * speed * dt;
      if (!closeY) pos.y += Math.sign(yo) * speed * dt;

      // If you made it, move to the next path element
      if (closeX && closeY) {
        this.path = path.slice(1);
        if (this.path.length === 0) {
          this.findPath();
        }
      }
    }
  }, {
    key: "update",
    value: function update(dt, t) {
      var pos = this.pos;

      this.followPath(dt);
      // Bob spookily
      pos.y += Math.sin(t / 0.1) * 0.5;
    }
  }]);

  return Ghost;
}(TileSprite);

exports.default = Ghost;

},{"../../pop/index.js":14}],26:[function(require,module,exports){
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

var Texture = _index2.default.Texture,
    TileSprite = _index2.default.TileSprite;


var texture = new Texture("res/images/bravedigger-tiles.png");

var Pickup = function (_TileSprite) {
  _inherits(Pickup, _TileSprite);

  function Pickup() {
    _classCallCheck(this, Pickup);

    var _this = _possibleConstructorReturn(this, (Pickup.__proto__ || Object.getPrototypeOf(Pickup)).call(this, texture, 48, 48));

    _this.hitBox = {
      x: 2,
      y: 22,
      w: 44,
      h: 26
    };
    _this.frame.x = 5;
    _this.frame.y = 2;
    return _this;
  }

  return Pickup;
}(TileSprite);

exports.default = Pickup;

},{"../../pop/index.js":14}],27:[function(require,module,exports){
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

var Texture = _index2.default.Texture,
    TileSprite = _index2.default.TileSprite,
    wallslide = _index2.default.wallslide;


var texture = new Texture("res/images/bravedigger-tiles.png");

var Player = function (_TileSprite) {
  _inherits(Player, _TileSprite);

  function Player(controls, map) {
    _classCallCheck(this, Player);

    var _this = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, texture, 48, 48));

    _this.controls = controls;
    _this.map = map;
    _this.hitBox = {
      x: 8,
      y: 10,
      w: 28,
      h: 38
    };
    _this.speed = 210;
    _this.anchor = { x: 0, y: 0 };
    _this.frame.x = 4;
    return _this;
  }

  _createClass(Player, [{
    key: "update",
    value: function update(dt, t) {
      var pos = this.pos,
          controls = this.controls,
          map = this.map,
          speed = this.speed,
          gameOver = this.gameOver;


      if (gameOver) {
        this.rotation += dt * 5;
        this.pivot.y = 24;
        this.pivot.x = 24;
        return;
      }

      var x = controls.x,
          y = controls.y;

      var xo = x * dt * speed;
      var yo = y * dt * speed;
      var r = wallslide(this, map, xo, yo);
      if (r.x !== 0 && r.y !== 0) {
        r.x /= Math.sqrt(2);
        r.y /= Math.sqrt(2);
      }
      pos.x += r.x;
      pos.y += r.y;

      // Animate!
      if (r.x || r.y) {
        this.frame.x = (t / 0.08 | 0) % 4;
        if (r.x < 0) {
          this.scale.x = -1;
          this.anchor.x = 48;
        }
        if (r.x > 0) {
          this.scale.x = 1;
          this.anchor.x = 0;
        }
      } else {
        this.frame.x = (t / 0.2 | 0) % 2 + 4;
      }
    }
  }]);

  return Player;
}(TileSprite);

exports.default = Player;

},{"../../pop/index.js":14}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("../../pop/index.js");

var _index2 = _interopRequireDefault(_index);

var _Bullet = require("./Bullet.js");

var _Bullet2 = _interopRequireDefault(_Bullet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var entity = _index2.default.entity,
    Texture = _index2.default.Texture,
    TileSprite = _index2.default.TileSprite,
    math = _index2.default.math,
    State = _index2.default.State;


var texture = new Texture("res/images/bravedigger-tiles.png");

var Totem = function (_TileSprite) {
  _inherits(Totem, _TileSprite);

  function Totem(target, onFire) {
    _classCallCheck(this, Totem);

    var _this = _possibleConstructorReturn(this, (Totem.__proto__ || Object.getPrototypeOf(Totem)).call(this, texture, 48, 48));

    _this.frame.x = 0;
    _this.frame.y = 1;
    _this.target = target;
    _this.onFire = onFire;
    _this.fireIn = 0;
    _this.state = new State("IDLE");
    return _this;
  }

  _createClass(Totem, [{
    key: "update",
    value: function update(dt, t) {
      var state = this.state,
          frame = this.frame,
          target = this.target;


      var distance = void 0;
      switch (state.get()) {
        case "IDLE":
          distance = entity.distance(target, this);
          frame.x = distance < 300 ? 1 : 2;
          if (distance < 300 && math.randOneIn(200)) {
            state.set("WINDUP");
          }
          break;
        case "WINDUP":
          frame.x = [0, 1][(t / 0.1 | 0) % 2];
          if (state.time > 1) {
            this.fireAtTarget();
            state.set("IDLE");
          }
          break;
      }
      state.update(dt);
    }
  }, {
    key: "fireAtTarget",
    value: function fireAtTarget() {
      var target = this.target,
          onFire = this.onFire;

      var totemPos = entity.center(this);
      var targetPos = entity.center(target);
      var angle = math.angle(targetPos, totemPos);

      var x = Math.cos(angle);
      var y = Math.sin(angle);

      var bullet = new _Bullet2.default({ x: x, y: y }, 300);
      bullet.pos.x = totemPos.x - bullet.w / 2;
      bullet.pos.y = totemPos.y - bullet.h / 2;

      onFire(bullet);
    }
  }]);

  return Totem;
}(TileSprite);

exports.default = Totem;

},{"../../pop/index.js":14,"./Bullet.js":24}],29:[function(require,module,exports){
"use strict";

var _index = require("../pop/index.js");

var _index2 = _interopRequireDefault(_index);

var _GameScreen = require("./GameScreen.js");

var _GameScreen2 = _interopRequireDefault(_GameScreen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Game = _index2.default.Game,
    KeyControls = _index2.default.KeyControls;


var game = new Game(48 * 19, 48 * 11);
var keys = new KeyControls();
function startGame() {
  game.scene = new _GameScreen2.default(game, keys, startGame);
}
startGame();
game.run();

},{"../pop/index.js":14,"./GameScreen.js":21}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
	Note! Modified version of EasyStar to work with JavaScript native modules.
	Last line of the file is `export default EasyStar;`.
	If you need to update this lib: don't forget to export it!
*/

var EasyStar =
/******/function (modules) {
	// webpackBootstrap
	/******/ // The module cache
	/******/var installedModules = {};

	/******/ // The require function
	/******/function __webpack_require__(moduleId) {

		/******/ // Check if module is in cache
		/******/if (installedModules[moduleId])
			/******/return installedModules[moduleId].exports;

		/******/ // Create a new module (and put it into the cache)
		/******/var module = installedModules[moduleId] = {
			/******/exports: {},
			/******/id: moduleId,
			/******/loaded: false
			/******/ };

		/******/ // Execute the module function
		/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

		/******/ // Flag the module as loaded
		/******/module.loaded = true;

		/******/ // Return the exports of the module
		/******/return module.exports;
		/******/
	}

	/******/ // expose the modules object (__webpack_modules__)
	/******/__webpack_require__.m = modules;

	/******/ // expose the module cache
	/******/__webpack_require__.c = installedModules;

	/******/ // __webpack_public_path__
	/******/__webpack_require__.p = "";

	/******/ // Load entry module and return exports
	/******/return __webpack_require__(0);
	/******/
}(
/************************************************************************/
/******/[
/* 0 */
/***/function (module, exports, __webpack_require__) {

	/**
 *   EasyStar.js
 *   github.com/prettymuchbryce/EasyStarJS
 *   Licensed under the MIT license.
 *
 *   Implementation By Bryce Neal (@prettymuchbryce)
 **/

	var EasyStar = {};
	var Instance = __webpack_require__(1);
	var Node = __webpack_require__(2);
	var Heap = __webpack_require__(3);

	var CLOSED_LIST = 0;
	var OPEN_LIST = 1;

	module.exports = EasyStar;

	var nextInstanceId = 1;

	EasyStar.js = function () {
		var STRAIGHT_COST = 1.0;
		var DIAGONAL_COST = 1.4;
		var syncEnabled = false;
		var pointsToAvoid = {};
		var collisionGrid;
		var costMap = {};
		var pointsToCost = {};
		var directionalConditions = {};
		var allowCornerCutting = true;
		var iterationsSoFar;
		var instances = {};
		var instanceQueue = [];
		var iterationsPerCalculation = Number.MAX_VALUE;
		var acceptableTiles;
		var diagonalsEnabled = false;

		/**
  * Sets the collision grid that EasyStar uses.
  *
  * @param {Array|Number} tiles An array of numbers that represent
  * which tiles in your grid should be considered
  * acceptable, or "walkable".
  **/
		this.setAcceptableTiles = function (tiles) {
			if (tiles instanceof Array) {
				// Array
				acceptableTiles = tiles;
			} else if (!isNaN(parseFloat(tiles)) && isFinite(tiles)) {
				// Number
				acceptableTiles = [tiles];
			}
		};

		/**
  * Enables sync mode for this EasyStar instance..
  * if you're into that sort of thing.
  **/
		this.enableSync = function () {
			syncEnabled = true;
		};

		/**
  * Disables sync mode for this EasyStar instance.
  **/
		this.disableSync = function () {
			syncEnabled = false;
		};

		/**
   * Enable diagonal pathfinding.
   */
		this.enableDiagonals = function () {
			diagonalsEnabled = true;
		};

		/**
   * Disable diagonal pathfinding.
   */
		this.disableDiagonals = function () {
			diagonalsEnabled = false;
		};

		/**
  * Sets the collision grid that EasyStar uses.
  *
  * @param {Array} grid The collision grid that this EasyStar instance will read from.
  * This should be a 2D Array of Numbers.
  **/
		this.setGrid = function (grid) {
			collisionGrid = grid;

			//Setup cost map
			for (var y = 0; y < collisionGrid.length; y++) {
				for (var x = 0; x < collisionGrid[0].length; x++) {
					if (!costMap[collisionGrid[y][x]]) {
						costMap[collisionGrid[y][x]] = 1;
					}
				}
			}
		};

		/**
  * Sets the tile cost for a particular tile type.
  *
  * @param {Number} The tile type to set the cost for.
  * @param {Number} The multiplicative cost associated with the given tile.
  **/
		this.setTileCost = function (tileType, cost) {
			costMap[tileType] = cost;
		};

		/**
  * Sets the an additional cost for a particular point.
  * Overrides the cost from setTileCost.
  *
  * @param {Number} x The x value of the point to cost.
  * @param {Number} y The y value of the point to cost.
  * @param {Number} The multiplicative cost associated with the given point.
  **/
		this.setAdditionalPointCost = function (x, y, cost) {
			if (pointsToCost[y] === undefined) {
				pointsToCost[y] = {};
			}
			pointsToCost[y][x] = cost;
		};

		/**
  * Remove the additional cost for a particular point.
  *
  * @param {Number} x The x value of the point to stop costing.
  * @param {Number} y The y value of the point to stop costing.
  **/
		this.removeAdditionalPointCost = function (x, y) {
			if (pointsToCost[y] !== undefined) {
				delete pointsToCost[y][x];
			}
		};

		/**
  * Remove all additional point costs.
  **/
		this.removeAllAdditionalPointCosts = function () {
			pointsToCost = {};
		};

		/**
  * Sets a directional condition on a tile
  *
  * @param {Number} x The x value of the point.
  * @param {Number} y The y value of the point.
  * @param {Array.<String>} allowedDirections A list of all the allowed directions that can access
  * the tile.
  **/
		this.setDirectionalCondition = function (x, y, allowedDirections) {
			if (directionalConditions[y] === undefined) {
				directionalConditions[y] = {};
			}
			directionalConditions[y][x] = allowedDirections;
		};

		/**
  * Remove all directional conditions
  **/
		this.removeAllDirectionalConditions = function () {
			directionalConditions = {};
		};

		/**
  * Sets the number of search iterations per calculation.
  * A lower number provides a slower result, but more practical if you
  * have a large tile-map and don't want to block your thread while
  * finding a path.
  *
  * @param {Number} iterations The number of searches to prefrom per calculate() call.
  **/
		this.setIterationsPerCalculation = function (iterations) {
			iterationsPerCalculation = iterations;
		};

		/**
  * Avoid a particular point on the grid,
  * regardless of whether or not it is an acceptable tile.
  *
  * @param {Number} x The x value of the point to avoid.
  * @param {Number} y The y value of the point to avoid.
  **/
		this.avoidAdditionalPoint = function (x, y) {
			if (pointsToAvoid[y] === undefined) {
				pointsToAvoid[y] = {};
			}
			pointsToAvoid[y][x] = 1;
		};

		/**
  * Stop avoiding a particular point on the grid.
  *
  * @param {Number} x The x value of the point to stop avoiding.
  * @param {Number} y The y value of the point to stop avoiding.
  **/
		this.stopAvoidingAdditionalPoint = function (x, y) {
			if (pointsToAvoid[y] !== undefined) {
				delete pointsToAvoid[y][x];
			}
		};

		/**
  * Enables corner cutting in diagonal movement.
  **/
		this.enableCornerCutting = function () {
			allowCornerCutting = true;
		};

		/**
  * Disables corner cutting in diagonal movement.
  **/
		this.disableCornerCutting = function () {
			allowCornerCutting = false;
		};

		/**
  * Stop avoiding all additional points on the grid.
  **/
		this.stopAvoidingAllAdditionalPoints = function () {
			pointsToAvoid = {};
		};

		/**
  * Find a path.
  *
  * @param {Number} startX The X position of the starting point.
  * @param {Number} startY The Y position of the starting point.
  * @param {Number} endX The X position of the ending point.
  * @param {Number} endY The Y position of the ending point.
  * @param {Function} callback A function that is called when your path
  * is found, or no path is found.
  * @return {Number} A numeric, non-zero value which identifies the created instance. This value can be passed to cancelPath to cancel the path calculation.
  *
  **/
		this.findPath = function (startX, startY, endX, endY, callback) {
			// Wraps the callback for sync vs async logic
			var callbackWrapper = function callbackWrapper(result) {
				if (syncEnabled) {
					callback(result);
				} else {
					setTimeout(function () {
						callback(result);
					});
				}
			};

			// No acceptable tiles were set
			if (acceptableTiles === undefined) {
				throw new Error("You can't set a path without first calling setAcceptableTiles() on EasyStar.");
			}
			// No grid was set
			if (collisionGrid === undefined) {
				throw new Error("You can't set a path without first calling setGrid() on EasyStar.");
			}

			// Start or endpoint outside of scope.
			if (startX < 0 || startY < 0 || endX < 0 || endY < 0 || startX > collisionGrid[0].length - 1 || startY > collisionGrid.length - 1 || endX > collisionGrid[0].length - 1 || endY > collisionGrid.length - 1) {
				throw new Error("Your start or end point is outside the scope of your grid.");
			}

			// Start and end are the same tile.
			if (startX === endX && startY === endY) {
				callbackWrapper([]);
				return;
			}

			// End point is not an acceptable tile.
			var endTile = collisionGrid[endY][endX];
			var isAcceptable = false;
			for (var i = 0; i < acceptableTiles.length; i++) {
				if (endTile === acceptableTiles[i]) {
					isAcceptable = true;
					break;
				}
			}

			if (isAcceptable === false) {
				callbackWrapper(null);
				return;
			}

			// Create the instance
			var instance = new Instance();
			instance.openList = new Heap(function (nodeA, nodeB) {
				return nodeA.bestGuessDistance() - nodeB.bestGuessDistance();
			});
			instance.isDoneCalculating = false;
			instance.nodeHash = {};
			instance.startX = startX;
			instance.startY = startY;
			instance.endX = endX;
			instance.endY = endY;
			instance.callback = callbackWrapper;

			instance.openList.push(coordinateToNode(instance, instance.startX, instance.startY, null, STRAIGHT_COST));

			var instanceId = nextInstanceId++;
			instances[instanceId] = instance;
			instanceQueue.push(instanceId);
			return instanceId;
		};

		/**
   * Cancel a path calculation.
   *
   * @param {Number} instanceId The instance ID of the path being calculated
   * @return {Boolean} True if an instance was found and cancelled.
   *
   **/
		this.cancelPath = function (instanceId) {
			if (instanceId in instances) {
				delete instances[instanceId];
				// No need to remove it from instanceQueue
				return true;
			}
			return false;
		};

		/**
  * This method steps through the A* Algorithm in an attempt to
  * find your path(s). It will search 4-8 tiles (depending on diagonals) for every calculation.
  * You can change the number of calculations done in a call by using
  * easystar.setIteratonsPerCalculation().
  **/
		this.calculate = function () {
			if (instanceQueue.length === 0 || collisionGrid === undefined || acceptableTiles === undefined) {
				return;
			}
			for (iterationsSoFar = 0; iterationsSoFar < iterationsPerCalculation; iterationsSoFar++) {
				if (instanceQueue.length === 0) {
					return;
				}

				if (syncEnabled) {
					// If this is a sync instance, we want to make sure that it calculates synchronously.
					iterationsSoFar = 0;
				}

				var instanceId = instanceQueue[0];
				var instance = instances[instanceId];
				if (typeof instance == 'undefined') {
					// This instance was cancelled
					instanceQueue.shift();
					continue;
				}

				// Couldn't find a path.
				if (instance.openList.size() === 0) {
					instance.callback(null);
					delete instances[instanceId];
					instanceQueue.shift();
					continue;
				}

				var searchNode = instance.openList.pop();

				// Handles the case where we have found the destination
				if (instance.endX === searchNode.x && instance.endY === searchNode.y) {
					var path = [];
					path.push({ x: searchNode.x, y: searchNode.y });
					var parent = searchNode.parent;
					while (parent != null) {
						path.push({ x: parent.x, y: parent.y });
						parent = parent.parent;
					}
					path.reverse();
					var ip = path;
					instance.callback(ip);
					delete instances[instanceId];
					instanceQueue.shift();
					continue;
				}

				searchNode.list = CLOSED_LIST;

				if (searchNode.y > 0) {
					checkAdjacentNode(instance, searchNode, 0, -1, STRAIGHT_COST * getTileCost(searchNode.x, searchNode.y - 1));
				}
				if (searchNode.x < collisionGrid[0].length - 1) {
					checkAdjacentNode(instance, searchNode, 1, 0, STRAIGHT_COST * getTileCost(searchNode.x + 1, searchNode.y));
				}
				if (searchNode.y < collisionGrid.length - 1) {
					checkAdjacentNode(instance, searchNode, 0, 1, STRAIGHT_COST * getTileCost(searchNode.x, searchNode.y + 1));
				}
				if (searchNode.x > 0) {
					checkAdjacentNode(instance, searchNode, -1, 0, STRAIGHT_COST * getTileCost(searchNode.x - 1, searchNode.y));
				}
				if (diagonalsEnabled) {
					if (searchNode.x > 0 && searchNode.y > 0) {

						if (allowCornerCutting || isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y - 1, searchNode) && isTileWalkable(collisionGrid, acceptableTiles, searchNode.x - 1, searchNode.y, searchNode)) {

							checkAdjacentNode(instance, searchNode, -1, -1, DIAGONAL_COST * getTileCost(searchNode.x - 1, searchNode.y - 1));
						}
					}
					if (searchNode.x < collisionGrid[0].length - 1 && searchNode.y < collisionGrid.length - 1) {

						if (allowCornerCutting || isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y + 1, searchNode) && isTileWalkable(collisionGrid, acceptableTiles, searchNode.x + 1, searchNode.y, searchNode)) {

							checkAdjacentNode(instance, searchNode, 1, 1, DIAGONAL_COST * getTileCost(searchNode.x + 1, searchNode.y + 1));
						}
					}
					if (searchNode.x < collisionGrid[0].length - 1 && searchNode.y > 0) {

						if (allowCornerCutting || isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y - 1, searchNode) && isTileWalkable(collisionGrid, acceptableTiles, searchNode.x + 1, searchNode.y, searchNode)) {

							checkAdjacentNode(instance, searchNode, 1, -1, DIAGONAL_COST * getTileCost(searchNode.x + 1, searchNode.y - 1));
						}
					}
					if (searchNode.x > 0 && searchNode.y < collisionGrid.length - 1) {

						if (allowCornerCutting || isTileWalkable(collisionGrid, acceptableTiles, searchNode.x, searchNode.y + 1, searchNode) && isTileWalkable(collisionGrid, acceptableTiles, searchNode.x - 1, searchNode.y, searchNode)) {

							checkAdjacentNode(instance, searchNode, -1, 1, DIAGONAL_COST * getTileCost(searchNode.x - 1, searchNode.y + 1));
						}
					}
				}
			}
		};

		// Private methods follow
		var checkAdjacentNode = function checkAdjacentNode(instance, searchNode, x, y, cost) {
			var adjacentCoordinateX = searchNode.x + x;
			var adjacentCoordinateY = searchNode.y + y;

			if ((pointsToAvoid[adjacentCoordinateY] === undefined || pointsToAvoid[adjacentCoordinateY][adjacentCoordinateX] === undefined) && isTileWalkable(collisionGrid, acceptableTiles, adjacentCoordinateX, adjacentCoordinateY, searchNode)) {
				var node = coordinateToNode(instance, adjacentCoordinateX, adjacentCoordinateY, searchNode, cost);

				if (node.list === undefined) {
					node.list = OPEN_LIST;
					instance.openList.push(node);
				} else if (searchNode.costSoFar + cost < node.costSoFar) {
					node.costSoFar = searchNode.costSoFar + cost;
					node.parent = searchNode;
					instance.openList.updateItem(node);
				}
			}
		};

		// Helpers
		var isTileWalkable = function isTileWalkable(collisionGrid, acceptableTiles, x, y, sourceNode) {
			var directionalCondition = directionalConditions[y] && directionalConditions[y][x];
			if (directionalCondition) {
				var direction = calculateDirection(sourceNode.x - x, sourceNode.y - y);
				var directionIncluded = function directionIncluded() {
					for (var i = 0; i < directionalCondition.length; i++) {
						if (directionalCondition[i] === direction) return true;
					}
					return false;
				};
				if (!directionIncluded()) return false;
			}
			for (var i = 0; i < acceptableTiles.length; i++) {
				if (collisionGrid[y][x] === acceptableTiles[i]) {
					return true;
				}
			}

			return false;
		};

		/**
   * -1, -1 | 0, -1  | 1, -1
   * -1,  0 | SOURCE | 1,  0
   * -1,  1 | 0,  1  | 1,  1
   */
		var calculateDirection = function calculateDirection(diffX, diffY) {
			if (diffX === 0 && diffY === -1) return EasyStar.TOP;else if (diffX === 1 && diffY === -1) return EasyStar.TOP_RIGHT;else if (diffX === 1 && diffY === 0) return EasyStar.RIGHT;else if (diffX === 1 && diffY === 1) return EasyStar.BOTTOM_RIGHT;else if (diffX === 0 && diffY === 1) return EasyStar.BOTTOM;else if (diffX === -1 && diffY === 1) return EasyStar.BOTTOM_LEFT;else if (diffX === -1 && diffY === 0) return EasyStar.LEFT;else if (diffX === -1 && diffY === -1) return EasyStar.TOP_LEFT;
			throw new Error('These differences are not valid: ' + diffX + ', ' + diffY);
		};

		var getTileCost = function getTileCost(x, y) {
			return pointsToCost[y] && pointsToCost[y][x] || costMap[collisionGrid[y][x]];
		};

		var coordinateToNode = function coordinateToNode(instance, x, y, parent, cost) {
			if (instance.nodeHash[y] !== undefined) {
				if (instance.nodeHash[y][x] !== undefined) {
					return instance.nodeHash[y][x];
				}
			} else {
				instance.nodeHash[y] = {};
			}
			var simpleDistanceToTarget = getDistance(x, y, instance.endX, instance.endY);
			if (parent !== null) {
				var costSoFar = parent.costSoFar + cost;
			} else {
				costSoFar = 0;
			}
			var node = new Node(parent, x, y, costSoFar, simpleDistanceToTarget);
			instance.nodeHash[y][x] = node;
			return node;
		};

		var getDistance = function getDistance(x1, y1, x2, y2) {
			if (diagonalsEnabled) {
				// Octile distance
				var dx = Math.abs(x1 - x2);
				var dy = Math.abs(y1 - y2);
				if (dx < dy) {
					return DIAGONAL_COST * dx + dy;
				} else {
					return DIAGONAL_COST * dy + dx;
				}
			} else {
				// Manhattan distance
				var dx = Math.abs(x1 - x2);
				var dy = Math.abs(y1 - y2);
				return dx + dy;
			}
		};
	};

	EasyStar.TOP = 'TOP';
	EasyStar.TOP_RIGHT = 'TOP_RIGHT';
	EasyStar.RIGHT = 'RIGHT';
	EasyStar.BOTTOM_RIGHT = 'BOTTOM_RIGHT';
	EasyStar.BOTTOM = 'BOTTOM';
	EasyStar.BOTTOM_LEFT = 'BOTTOM_LEFT';
	EasyStar.LEFT = 'LEFT';
	EasyStar.TOP_LEFT = 'TOP_LEFT';

	/***/
},
/* 1 */
/***/function (module, exports) {

	/**
  * Represents a single instance of EasyStar.
  * A path that is in the queue to eventually be found.
  */
	module.exports = function () {
		this.pointsToAvoid = {};
		this.startX;
		this.callback;
		this.startY;
		this.endX;
		this.endY;
		this.nodeHash = {};
		this.openList;
	};

	/***/
},
/* 2 */
/***/function (module, exports) {

	/**
 * A simple Node that represents a single tile on the grid.
 * @param {Object} parent The parent node.
 * @param {Number} x The x position on the grid.
 * @param {Number} y The y position on the grid.
 * @param {Number} costSoFar How far this node is in moves*cost from the start.
 * @param {Number} simpleDistanceToTarget Manhatten distance to the end point.
 **/
	module.exports = function (parent, x, y, costSoFar, simpleDistanceToTarget) {
		this.parent = parent;
		this.x = x;
		this.y = y;
		this.costSoFar = costSoFar;
		this.simpleDistanceToTarget = simpleDistanceToTarget;

		/**
  * @return {Number} Best guess distance of a cost using this node.
  **/
		this.bestGuessDistance = function () {
			return this.costSoFar + this.simpleDistanceToTarget;
		};
	};

	/***/
},
/* 3 */
/***/function (module, exports, __webpack_require__) {

	module.exports = __webpack_require__(4);

	/***/
},
/* 4 */
/***/function (module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__; // Generated by CoffeeScript 1.8.0
	(function () {
		var Heap, defaultCmp, floor, heapify, heappop, heappush, heappushpop, heapreplace, insort, min, nlargest, nsmallest, updateItem, _siftdown, _siftup;

		floor = Math.floor, min = Math.min;

		/*
  Default comparison function to be used
   */

		defaultCmp = function defaultCmp(x, y) {
			if (x < y) {
				return -1;
			}
			if (x > y) {
				return 1;
			}
			return 0;
		};

		/*
  Insert item x in list a, and keep it sorted assuming a is sorted.
   If x is already in a, insert it to the right of the rightmost x.
   Optional args lo (default 0) and hi (default a.length) bound the slice
  of a to be searched.
   */

		insort = function insort(a, x, lo, hi, cmp) {
			var mid;
			if (lo == null) {
				lo = 0;
			}
			if (cmp == null) {
				cmp = defaultCmp;
			}
			if (lo < 0) {
				throw new Error('lo must be non-negative');
			}
			if (hi == null) {
				hi = a.length;
			}
			while (lo < hi) {
				mid = floor((lo + hi) / 2);
				if (cmp(x, a[mid]) < 0) {
					hi = mid;
				} else {
					lo = mid + 1;
				}
			}
			return [].splice.apply(a, [lo, lo - lo].concat(x)), x;
		};

		/*
  Push item onto heap, maintaining the heap invariant.
   */

		heappush = function heappush(array, item, cmp) {
			if (cmp == null) {
				cmp = defaultCmp;
			}
			array.push(item);
			return _siftdown(array, 0, array.length - 1, cmp);
		};

		/*
  Pop the smallest item off the heap, maintaining the heap invariant.
   */

		heappop = function heappop(array, cmp) {
			var lastelt, returnitem;
			if (cmp == null) {
				cmp = defaultCmp;
			}
			lastelt = array.pop();
			if (array.length) {
				returnitem = array[0];
				array[0] = lastelt;
				_siftup(array, 0, cmp);
			} else {
				returnitem = lastelt;
			}
			return returnitem;
		};

		/*
  Pop and return the current smallest value, and add the new item.
   This is more efficient than heappop() followed by heappush(), and can be
  more appropriate when using a fixed size heap. Note that the value
  returned may be larger than item! That constrains reasonable use of
  this routine unless written as part of a conditional replacement:
      if item > array[0]
        item = heapreplace(array, item)
   */

		heapreplace = function heapreplace(array, item, cmp) {
			var returnitem;
			if (cmp == null) {
				cmp = defaultCmp;
			}
			returnitem = array[0];
			array[0] = item;
			_siftup(array, 0, cmp);
			return returnitem;
		};

		/*
  Fast version of a heappush followed by a heappop.
   */

		heappushpop = function heappushpop(array, item, cmp) {
			var _ref;
			if (cmp == null) {
				cmp = defaultCmp;
			}
			if (array.length && cmp(array[0], item) < 0) {
				_ref = [array[0], item], item = _ref[0], array[0] = _ref[1];
				_siftup(array, 0, cmp);
			}
			return item;
		};

		/*
  Transform list into a heap, in-place, in O(array.length) time.
   */

		heapify = function heapify(array, cmp) {
			var i, _i, _j, _len, _ref, _ref1, _results, _results1;
			if (cmp == null) {
				cmp = defaultCmp;
			}
			_ref1 = function () {
				_results1 = [];
				for (var _j = 0, _ref = floor(array.length / 2); 0 <= _ref ? _j < _ref : _j > _ref; 0 <= _ref ? _j++ : _j--) {
					_results1.push(_j);
				}
				return _results1;
			}.apply(this).reverse();
			_results = [];
			for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
				i = _ref1[_i];
				_results.push(_siftup(array, i, cmp));
			}
			return _results;
		};

		/*
  Update the position of the given item in the heap.
  This function should be called every time the item is being modified.
   */

		updateItem = function updateItem(array, item, cmp) {
			var pos;
			if (cmp == null) {
				cmp = defaultCmp;
			}
			pos = array.indexOf(item);
			if (pos === -1) {
				return;
			}
			_siftdown(array, 0, pos, cmp);
			return _siftup(array, pos, cmp);
		};

		/*
  Find the n largest elements in a dataset.
   */

		nlargest = function nlargest(array, n, cmp) {
			var elem, result, _i, _len, _ref;
			if (cmp == null) {
				cmp = defaultCmp;
			}
			result = array.slice(0, n);
			if (!result.length) {
				return result;
			}
			heapify(result, cmp);
			_ref = array.slice(n);
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				elem = _ref[_i];
				heappushpop(result, elem, cmp);
			}
			return result.sort(cmp).reverse();
		};

		/*
  Find the n smallest elements in a dataset.
   */

		nsmallest = function nsmallest(array, n, cmp) {
			var elem, i, los, result, _i, _j, _len, _ref, _ref1, _results;
			if (cmp == null) {
				cmp = defaultCmp;
			}
			if (n * 10 <= array.length) {
				result = array.slice(0, n).sort(cmp);
				if (!result.length) {
					return result;
				}
				los = result[result.length - 1];
				_ref = array.slice(n);
				for (_i = 0, _len = _ref.length; _i < _len; _i++) {
					elem = _ref[_i];
					if (cmp(elem, los) < 0) {
						insort(result, elem, 0, null, cmp);
						result.pop();
						los = result[result.length - 1];
					}
				}
				return result;
			}
			heapify(array, cmp);
			_results = [];
			for (i = _j = 0, _ref1 = min(n, array.length); 0 <= _ref1 ? _j < _ref1 : _j > _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
				_results.push(heappop(array, cmp));
			}
			return _results;
		};

		_siftdown = function _siftdown(array, startpos, pos, cmp) {
			var newitem, parent, parentpos;
			if (cmp == null) {
				cmp = defaultCmp;
			}
			newitem = array[pos];
			while (pos > startpos) {
				parentpos = pos - 1 >> 1;
				parent = array[parentpos];
				if (cmp(newitem, parent) < 0) {
					array[pos] = parent;
					pos = parentpos;
					continue;
				}
				break;
			}
			return array[pos] = newitem;
		};

		_siftup = function _siftup(array, pos, cmp) {
			var childpos, endpos, newitem, rightpos, startpos;
			if (cmp == null) {
				cmp = defaultCmp;
			}
			endpos = array.length;
			startpos = pos;
			newitem = array[pos];
			childpos = 2 * pos + 1;
			while (childpos < endpos) {
				rightpos = childpos + 1;
				if (rightpos < endpos && !(cmp(array[childpos], array[rightpos]) < 0)) {
					childpos = rightpos;
				}
				array[pos] = array[childpos];
				pos = childpos;
				childpos = 2 * pos + 1;
			}
			array[pos] = newitem;
			return _siftdown(array, startpos, pos, cmp);
		};

		Heap = function () {
			Heap.push = heappush;

			Heap.pop = heappop;

			Heap.replace = heapreplace;

			Heap.pushpop = heappushpop;

			Heap.heapify = heapify;

			Heap.updateItem = updateItem;

			Heap.nlargest = nlargest;

			Heap.nsmallest = nsmallest;

			function Heap(cmp) {
				this.cmp = cmp != null ? cmp : defaultCmp;
				this.nodes = [];
			}

			Heap.prototype.push = function (x) {
				return heappush(this.nodes, x, this.cmp);
			};

			Heap.prototype.pop = function () {
				return heappop(this.nodes, this.cmp);
			};

			Heap.prototype.peek = function () {
				return this.nodes[0];
			};

			Heap.prototype.contains = function (x) {
				return this.nodes.indexOf(x) !== -1;
			};

			Heap.prototype.replace = function (x) {
				return heapreplace(this.nodes, x, this.cmp);
			};

			Heap.prototype.pushpop = function (x) {
				return heappushpop(this.nodes, x, this.cmp);
			};

			Heap.prototype.heapify = function () {
				return heapify(this.nodes, this.cmp);
			};

			Heap.prototype.updateItem = function (x) {
				return updateItem(this.nodes, x, this.cmp);
			};

			Heap.prototype.clear = function () {
				return this.nodes = [];
			};

			Heap.prototype.empty = function () {
				return this.nodes.length === 0;
			};

			Heap.prototype.size = function () {
				return this.nodes.length;
			};

			Heap.prototype.clone = function () {
				var heap;
				heap = new Heap();
				heap.nodes = this.nodes.slice(0);
				return heap;
			};

			Heap.prototype.toArray = function () {
				return this.nodes.slice(0);
			};

			Heap.prototype.insert = Heap.prototype.push;

			Heap.prototype.top = Heap.prototype.peek;

			Heap.prototype.front = Heap.prototype.peek;

			Heap.prototype.has = Heap.prototype.contains;

			Heap.prototype.copy = Heap.prototype.clone;

			return Heap;
		}();

		(function (root, factory) {
			if (true) {
				return !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = factory, __WEBPACK_AMD_DEFINE_RESULT__ = typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
			} else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
				return module.exports = factory();
			} else {
				return root.Heap = factory();
			}
		})(this, function () {
			return Heap;
		});
	}).call(this);

	/***/
}]
/******/);

exports.default = EasyStar;

},{}]},{},[29]);
