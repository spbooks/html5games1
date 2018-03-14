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
var cache = {};
var readyListeners = [];
var progressListeners = [];

var completed = false;
var remaining = 0;
var total = 0;

function done() {
  completed = true;
  readyListeners.forEach(function (cb) {
    return cb();
  });
}

// Called when a queued asset is ready to use
function onAssetLoad(e) {
  if (completed) {
    console.warn("Warning: asset defined after preload.", e.target);
    return;
  }

  remaining--;
  progressListeners.forEach(function (cb) {
    return cb(total - remaining, total);
  });
  if (remaining === 0) {
    // We're done loading
    done();
  }
}

// Helper function for queuing assets
function load(url, maker) {
  var cacheKey = url;
  while (cacheKey.startsWith("../")) {
    cacheKey = url.slice(3);
  }
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }
  var asset = maker(url, onAssetLoad);
  remaining++;
  total++;

  cache[cacheKey] = asset;
  return asset;
}

var Assets = {
  get completed() {
    return completed;
  },

  onReady: function onReady(cb) {
    if (completed) {
      return cb();
    }

    readyListeners.push(cb);
    // No assets to load
    if (remaining === 0) {
      done();
    }
  },
  onProgress: function onProgress(cb) {
    progressListeners.push(cb);
  },
  image: function image(url) {
    return load(url, function (url, onAssetLoad) {
      var img = new Image();
      img.src = url;
      img.addEventListener("load", onAssetLoad, false);
      return img;
    });
  },
  sound: function sound(url) {
    return load(url, function (url, onAssetLoad) {
      var audio = new Audio();
      audio.src = url;
      var onLoad = function onLoad(e) {
        audio.removeEventListener("canplay", onLoad);
        onAssetLoad(e);
      };
      audio.addEventListener("canplay", onLoad, false);
      return audio;
    }).cloneNode();
  },
  soundBuffer: function soundBuffer(url, ctx) {
    return load(url, function (url, onAssetLoad) {
      return fetch(url).then(function (r) {
        return r.arrayBuffer();
      }).then(function (ab) {
        return new Promise(function (success) {
          ctx.decodeAudioData(ab, function (buffer) {
            onAssetLoad(url);
            success(buffer);
          });
        });
      });
    });
  },
  json: function json(url) {
    return load(url, function (url, onAssetLoad) {
      return fetch(url).then(function (res) {
        return res.json();
      }).then(function (json) {
        onAssetLoad(url);
        return json;
      });
    });
  }
};

exports.default = Assets;

},{}],3:[function(require,module,exports){
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

var _Vec = require("./utils/Vec.js");

var _Vec2 = _interopRequireDefault(_Vec);

var _Rect = require("./Rect.js");

var _Rect2 = _interopRequireDefault(_Rect);

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

    _this.pos = new _Vec2.default();
    _this.w = viewport.w;
    _this.h = viewport.h;
    _this.worldSize = worldSize;

    _this.shakePower = 0;
    _this.shakeDecay = 0;
    _this.shakeLast = new _Vec2.default();

    _this.flashTime = 0;
    _this.flashDuration = 0;
    _this.flashRect = null;

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
      this.focus(1);
    }
  }, {
    key: "shake",
    value: function shake() {
      var power = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;
      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;

      this.shakePower = power;
      this.shakeDecay = power / duration;
    }
  }, {
    key: "_shake",
    value: function _shake(dt) {
      var pos = this.pos,
          shakePower = this.shakePower,
          shakeLast = this.shakeLast;

      if (shakePower <= 0) {
        shakeLast.set(0, 0);
        return;
      }
      shakeLast.set(_math2.default.randf(-shakePower, shakePower), _math2.default.randf(-shakePower, shakePower));

      pos.add(shakeLast);
      this.shakePower -= this.shakeDecay * dt;
    }
  }, {
    key: "_unShake",
    value: function _unShake() {
      var pos = this.pos,
          shakeLast = this.shakeLast;

      pos.subtract(shakeLast);
    }
  }, {
    key: "flash",
    value: function flash() {
      var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.3;
      var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "#fff";

      if (!this.flashRect) {
        var w = this.w,
            h = this.h;

        this.flashRect = this.add(new _Rect2.default(w, h, { fill: color }));
      }
      this.flashRect.style.fill = color;
      this.flashDuration = duration;
      this.flashTime = duration;
    }
  }, {
    key: "_flash",
    value: function _flash(dt) {
      var flashRect = this.flashRect,
          flashDuration = this.flashDuration,
          pos = this.pos;

      if (!flashRect) {
        return;
      }

      var time = this.flashTime -= dt;
      if (time <= 0) {
        this.remove(flashRect);
        this.flashRect = null;
      } else {
        flashRect.alpha = time / flashDuration;
        flashRect.pos = _Vec2.default.from(pos).multiply(-1);
      }
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


      var target = subject || pos;

      var centeredX = target.x + offset.x - w / 2;
      var maxX = worldSize.w - w;
      var x = -_math2.default.clamp(centeredX, 0, maxX);

      var centeredY = target.y + offset.y - h / 2;
      var maxY = worldSize.h - h;
      var y = -_math2.default.clamp(centeredY, 0, maxY);

      pos.set(x, y);
    }
  }, {
    key: "update",
    value: function update(dt, t) {
      _get(Camera.prototype.__proto__ || Object.getPrototypeOf(Camera.prototype), "update", this).call(this, dt, t);
      this._unShake();
      if (this.subject) {
        this.focus();
      }
      this._shake(dt);
      this._flash(dt);
    }
  }]);

  return Camera;
}(_Container3.default);

exports.default = Camera;

},{"./Container.js":4,"./Rect.js":6,"./utils/Vec.js":21,"./utils/math.js":23}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Assets = require("./Assets.js");

var _Assets2 = _interopRequireDefault(_Assets);

var _Container = require("./Container.js");

var _Container2 = _interopRequireDefault(_Container);

var _CanvasRenderer = require("./renderer/CanvasRenderer.js");

var _CanvasRenderer2 = _interopRequireDefault(_CanvasRenderer);

var _screenCapture = require("./utils/screenCapture.js");

var _screenCapture2 = _interopRequireDefault(_screenCapture);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var STEP = 1 / 60;
var MULTIPLIER = 1;
var SPEED = STEP * MULTIPLIER;
var MAX_FRAME = SPEED * 5;

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


      _Assets2.default.onReady(function () {
        var dt = 0;
        var last = 0;
        var loopy = function loopy(ms) {
          requestAnimationFrame(loopy);

          var t = ms / 1000; // Let's work in seconds
          dt += Math.min(t - last, MAX_FRAME);
          last = t;

          while (dt >= SPEED) {
            _this.scene.update(STEP, t / MULTIPLIER);
            gameUpdate(STEP, t / MULTIPLIER);
            dt -= SPEED;
          }
          _this.renderer.render(_this.scene);
        };
        requestAnimationFrame(loopy);
      });
    }
  }]);

  return Game;
}();

exports.default = Game;

},{"./Assets.js":2,"./Container.js":4,"./renderer/CanvasRenderer.js":17,"./utils/screenCapture.js":25}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Vec = require("./utils/Vec.js");

var _Vec2 = _interopRequireDefault(_Vec);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Rect = function Rect(w, h) {
  var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { fill: "#333" };

  _classCallCheck(this, Rect);

  this.pos = new _Vec2.default();
  this.w = w;
  this.h = h;
  this.style = style;
};

exports.default = Rect;

},{"./utils/Vec.js":21}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Vec = require("./utils/Vec.js");

var _Vec2 = _interopRequireDefault(_Vec);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sprite = function Sprite(texture) {
  _classCallCheck(this, Sprite);

  this.texture = texture;
  this.pos = new _Vec2.default();
  this.anchor = { x: 0, y: 0 };
  this.scale = { x: 1, y: 1 };
  this.pivot = { x: 0, y: 0 };
  this.rotation = 0;
};

exports.default = Sprite;

},{"./utils/Vec.js":21}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Vec = require("./utils/Vec.js");

var _Vec2 = _interopRequireDefault(_Vec);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Text = function Text() {
  var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  _classCallCheck(this, Text);

  this.pos = new _Vec2.default();
  this.text = text;
  this.style = style;
};

exports.default = Text;

},{"./utils/Vec.js":21}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Assets = require("./Assets.js");

var _Assets2 = _interopRequireDefault(_Assets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Texture = function () {
  function Texture(url) {
    _classCallCheck(this, Texture);

    this.img = _Assets2.default.image(url);
  }

  _createClass(Texture, [{
    key: "w",
    get: function get() {
      return this.img.width;
    }
  }, {
    key: "h",
    get: function get() {
      return this.img.height;
    }
  }]);

  return Texture;
}();

exports.default = Texture;

},{"./Assets.js":2}],11:[function(require,module,exports){
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
    value: function tilesAtCorners(bounds, xo, yo) {
      var _this2 = this;

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

},{"./Container.js":4,"./TileSprite.js":12}],12:[function(require,module,exports){
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

},{"./AnimManager.js":1,"./Sprite.js":7}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Assets = require("./Assets.js");

var _Assets2 = _interopRequireDefault(_Assets);

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

var _physics = require("./utils/physics.js");

var _physics2 = _interopRequireDefault(_physics);

var _Rect = require("./Rect.js");

var _Rect2 = _interopRequireDefault(_Rect);

var _Sound = require("./sound/Sound.js");

var _Sound2 = _interopRequireDefault(_Sound);

var _SoundGroup = require("./sound/SoundGroup.js");

var _SoundGroup2 = _interopRequireDefault(_SoundGroup);

var _SoundPool = require("./sound/SoundPool.js");

var _SoundPool2 = _interopRequireDefault(_SoundPool);

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

var _Vec = require("./utils/Vec.js");

var _Vec2 = _interopRequireDefault(_Vec);

var _wallslide = require("./movement/wallslide.js");

var _wallslide2 = _interopRequireDefault(_wallslide);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  Assets: _Assets2.default,
  Camera: _Camera2.default,
  CanvasRenderer: _CanvasRenderer2.default,
  Container: _Container2.default,
  entity: _entity2.default,
  Game: _Game2.default,
  KeyControls: _KeyControls2.default,
  math: _math2.default,
  MouseControls: _MouseControls2.default,
  physics: _physics2.default,
  Rect: _Rect2.default,
  Sound: _Sound2.default,
  SoundGroup: _SoundGroup2.default,
  SoundPool: _SoundPool2.default,
  Sprite: _Sprite2.default,
  State: _State2.default,
  Text: _Text2.default,
  Texture: _Texture2.default,
  TileMap: _TileMap2.default,
  TileSprite: _TileSprite2.default,
  Vec: _Vec2.default,
  wallslide: _wallslide2.default
};

},{"./Assets.js":2,"./Camera.js":3,"./Container.js":4,"./Game.js":5,"./Rect.js":6,"./Sprite.js":7,"./State.js":8,"./Text.js":9,"./Texture.js":10,"./TileMap.js":11,"./TileSprite.js":12,"./controls/KeyControls.js":13,"./controls/MouseControls.js":14,"./movement/wallslide.js":16,"./renderer/CanvasRenderer.js":17,"./sound/Sound.js":18,"./sound/SoundGroup.js":19,"./sound/SoundPool.js":20,"./utils/Vec.js":21,"./utils/entity.js":22,"./utils/math.js":23,"./utils/physics.js":24}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _entity = require("../utils/entity.js");

var _entity2 = _interopRequireDefault(_entity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  Expects:
  * an entity (with pos vector, w & h)
  * a Pop TileMap
  * The x and y amount *requesting* to move (no checks if 0)
*/

function wallslide(ent, map) {
  var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  var tiles = void 0;
  var tileEdge = void 0;
  var bounds = _entity2.default.bounds(ent);
  var hits = { up: false, down: false, left: false, right: false };

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
      hits.up = true;
      tileEdge = tiles[0].pos.y + tiles[0].h;
      yo = tileEdge - bounds.y;
    }
    // Hit your feet
    if (y > 0 && !(bl && br)) {
      hits.down = true;
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

    // Hit left tile


    if (x < 0 && !(_tl && _bl)) {
      hits.left = true;
      tileEdge = tiles[0].pos.x + tiles[0].w;
      xo = tileEdge - bounds.x;
    }
    // Hit right tile
    if (x > 0 && !(_tr && _br)) {
      hits.right = true;
      tileEdge = tiles[1].pos.x - 1;
      xo = tileEdge - (bounds.x + bounds.w);
    }
  }

  // xo & yo contain the amount we're allowed to move by, and any hit tiles
  return { x: xo, y: yo, hits: hits };
}

exports.default = wallslide;

},{"../utils/entity.js":22}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

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
        if (container.visible === false || container.alpha === 0) {
          return;
        }
        if (container.alpha) {
          ctx.save();
          ctx.globalAlpha = container.alpha;
        }

        // Render the container children
        container.children.forEach(function (child) {
          if (child.visible == false || child.alpha === 0) {
            return;
          }
          ctx.save();
          if (child.alpha) {
            ctx.globalAlpha = child.alpha;
          }

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
          } else if (child.path) {
            var _child$path = _toArray(child.path),
                head = _child$path[0],
                tail = _child$path.slice(1);

            if (child.path.length > 1) {
              ctx.fillStyle = child.style.fill || "#fff";
              ctx.beginPath();
              ctx.moveTo(head.x, head.y);
              tail.forEach(function (_ref) {
                var x = _ref.x,
                    y = _ref.y;
                return ctx.lineTo(x, y);
              });
              ctx.closePath();
              ctx.fill();
            }
          }

          // Render any child sub-nodes
          if (child.children) {
            renderRec(child);
          }
          ctx.restore();
        });

        if (container.alpha) {
          ctx.restore();
        }
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Assets = require("../Assets.js");

var _Assets2 = _interopRequireDefault(_Assets);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sound = function () {
  function Sound(src) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Sound);

    this.playing = false;
    this.src = src;
    this.options = Object.assign({ volume: 1 }, options);

    // Configure audio element
    var audio = _Assets2.default.sound(src);
    if (options.loop) {
      audio.loop = true;
    }
    audio.addEventListener("error", function () {
      throw Error("Error loading audio: " + src);
    }, false);
    audio.addEventListener("ended", function () {
      _this.playing = false;
    }, false);
    this.audio = audio;
  }

  _createClass(Sound, [{
    key: "play",
    value: function play(overrides) {
      var audio = this.audio,
          options = this.options;

      var opts = Object.assign({ time: 0 }, options, overrides);
      audio.volume = opts.volume;
      audio.currentTime = opts.time;
      audio.play();
      this.playing = true;
    }
  }, {
    key: "stop",
    value: function stop() {
      this.audio.pause();
      this.playing = false;
    }
  }, {
    key: "volume",
    get: function get() {
      return this.audio.volume;
    },
    set: function set(volume) {
      this.options.volume = this.audio.volume = volume;
    }
  }]);

  return Sound;
}();

exports.default = Sound;

},{"../Assets.js":2}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _math = require("../utils/math.js");

var _math2 = _interopRequireDefault(_math);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SoundGroup = function () {
  function SoundGroup(sounds) {
    _classCallCheck(this, SoundGroup);

    this.sounds = sounds;
  }

  // play one of the audio group (random)


  _createClass(SoundGroup, [{
    key: "play",
    value: function play(opts) {
      var sounds = this.sounds;

      _math2.default.randOneFrom(sounds).play(opts);
    }

    // stop ALL audio instance of the group

  }, {
    key: "stop",
    value: function stop() {
      this.sounds.forEach(function (sound) {
        return sound.stop();
      });
    }
  }]);

  return SoundGroup;
}();

exports.default = SoundGroup;

},{"../utils/math.js":23}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Sound = require("./Sound.js");

var _Sound2 = _interopRequireDefault(_Sound);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SoundPool = function () {
  function SoundPool(src) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var poolSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;

    _classCallCheck(this, SoundPool);

    this.count = 0;
    this.sounds = [].concat(_toConsumableArray(Array(poolSize))).map(function () {
      return new _Sound2.default(src, options);
    });
  }

  // play one of audio instance of the pool


  _createClass(SoundPool, [{
    key: "play",
    value: function play(options) {
      var sounds = this.sounds;

      var index = this.count++ % sounds.length;
      sounds[index].play(options);
    }

    // stop ALL audio instance of the pool

  }, {
    key: "stop",
    value: function stop() {
      this.sounds.forEach(function (sound) {
        return sound.stop();
      });
    }
  }]);

  return SoundPool;
}();

exports.default = SoundPool;

},{"./Sound.js":18}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vec = function () {
  _createClass(Vec, null, [{
    key: "from",
    value: function from(v) {
      return new Vec().copy(v);
    }
  }]);

  function Vec() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    _classCallCheck(this, Vec);

    this.set(x, y);
  }

  _createClass(Vec, [{
    key: "set",
    value: function set(x, y) {
      this.x = x;
      this.y = y;
      return this;
    }
  }, {
    key: "copy",
    value: function copy(_ref) {
      var x = _ref.x,
          y = _ref.y;

      this.x = x;
      this.y = y;
      return this;
    }
  }, {
    key: "clone",
    value: function clone() {
      return Vec.from(this);
    }
  }, {
    key: "add",
    value: function add(_ref2) {
      var x = _ref2.x,
          y = _ref2.y;

      this.x += x;
      this.y += y;
      return this;
    }
  }, {
    key: "subtract",
    value: function subtract(_ref3) {
      var x = _ref3.x,
          y = _ref3.y;

      this.x -= x;
      this.y -= y;
      return this;
    }
  }, {
    key: "multiply",
    value: function multiply(s) {
      this.x *= s;
      this.y *= s;
      return this;
    }
  }, {
    key: "divide",
    value: function divide(s) {
      this.x /= s;
      this.y /= s;
      return this;
    }
  }, {
    key: "mag",
    value: function mag() {
      var x = this.x,
          y = this.y;

      return Math.sqrt(x * x + y * y);
    }
  }, {
    key: "normalize",
    value: function normalize() {
      var mag = this.mag();
      if (mag > 0) {
        this.x /= mag;
        this.y /= mag;
      }
      return this;
    }
  }, {
    key: "dot",
    value: function dot(_ref4) {
      var x = _ref4.x,
          y = _ref4.y;

      return this.x * x + this.y * y;
    }
  }, {
    key: "toString",
    value: function toString() {
      return "(" + this.x + "," + this.y + ")";
    }
  }]);

  return Vec;
}();

exports.default = Vec;

},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _math = require("./math.js");

var _math2 = _interopRequireDefault(_math);

var _Rect = require("../Rect.js");

var _Rect2 = _interopRequireDefault(_Rect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addDebug(entity) {
  entity.children = entity.children || [];
  entity.children.push(new _Rect2.default(entity.w, entity.h, { fill: "rgba(255, 0, 0, 0.3)" }));
  if (entity.hitBox) {
    var _entity$hitBox = entity.hitBox,
        x = _entity$hitBox.x,
        y = _entity$hitBox.y,
        w = _entity$hitBox.w,
        h = _entity$hitBox.h;

    var hb = new _Rect2.default(w, h, { fill: "rgba(255, 0, 0, 0.5)" });
    hb.pos.x = x;
    hb.pos.y = y;
    entity.children.push(hb);
  }
  return entity;
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

},{"../Rect.js":6,"./math.js":23}],23:[function(require,module,exports){
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

var random = Math.random;
function randf(min, max) {
  if (max == null) {
    max = min || 1;
    min = 0;
  }
  return random() * (max - min) + min;
}

function randOneIn(max) {
  return rand(0, max) === 0;
}

function randOneFrom(items) {
  return items[rand(0, items.length)];
}

var seed = 42;
function randomSeed(s) {
  if (!isNaN(s)) {
    seed = s;
  }
  return seed;
}

function randomSeeded() {
  // https://en.wikipedia.org/wiki/Linear_congruential_generator
  seed = (seed * 16807 + 0) % 2147483647;
  return seed / 2147483647;
}

function useSeededRandom() {
  var blnUse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

  randomSeeded();
  random = blnUse ? randomSeeded : Math.random;
}

exports.default = {
  angle: angle,
  clamp: clamp,
  distance: distance,
  rand: rand,
  randf: randf,
  randOneIn: randOneIn,
  randOneFrom: randOneFrom,
  randomSeed: randomSeed,
  useSeededRandom: useSeededRandom
};

},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function applyForce(e, force) {
  var acc = e.acc,
      _e$mass = e.mass,
      mass = _e$mass === undefined ? 1 : _e$mass;

  acc.x += force.x / mass;
  acc.y += force.y / mass;
}

function applyFriction(e, amount) {
  var friction = e.vel.clone().multiply(-1).normalize().multiply(amount);
  applyForce(e, friction);
}

function applyHorizontalFriction(e, amount) {
  var friction = e.vel.clone().multiply(-1).normalize().multiply(amount);
  applyForce(e, { x: friction.x, y: 0 });
}

function applyImpulse(e, force, dt) {
  applyForce(e, { x: force.x / dt, y: force.y / dt });
}

function integrate(e, dt) {
  var vel = e.vel,
      acc = e.acc;

  var vx = vel.x + acc.x * dt;
  var vy = vel.y + acc.y * dt;
  var x = (vel.x + vx) / 2 * dt;
  var y = (vel.y + vy) / 2 * dt;
  vel.set(vx, vy);
  acc.set(0, 0);
  return { x: x, y: y };
}

function integratePos(e, dt) {
  var dis = integrate(e, dt);
  e.pos.add(dis);
  return dis;
}

function speed(_ref) {
  var vel = _ref.vel;

  return Math.sqrt(vel.x * vel.x + vel.y * vel.y);
}

exports.default = {
  applyForce: applyForce,
  applyFriction: applyFriction,
  applyHorizontalFriction: applyHorizontalFriction,
  applyImpulse: applyImpulse,
  integrate: integrate,
  integratePos: integratePos,
  speed: speed
};

},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = require("../pop/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TileMap = _index2.default.TileMap,
    Texture = _index2.default.Texture,
    math = _index2.default.math;


var texture = new Texture("res/images/bravedigger-tiles.png");

var Level = function (_TileMap) {
  _inherits(Level, _TileMap);

  function Level() {
    _classCallCheck(this, Level);

    var tileSize = 48;
    var tileIndexes = [{ id: "empty", x: 0, y: 2, walkable: true }, { id: "wall", x: 1, y: 3 }, { id: "wall3D", x: 3, y: 3 }];

    var ascii = "\n#########################\n#####                ####\n###                B  ###\n##                 ##  ##\n#       ########       ##\n#   ##       ###        #\n#B            ####      #\n###             ##      T\n####   ##T##    ####    #\n#####                  ##\n###                  ####\n##    ##                #\n#   #####        ########\n# ########    T##########\n#X          #############\n#########################";

    var spawns = {
      player: null,
      totems: [],
      bats: [],
      pickups: []
    };

    // Turn the ascii into cells
    var cells = ascii.split("\n").slice(1).map(function (row) {
      return row.split("");
    });
    var mapH = cells.length;
    var mapW = cells.reduce(function (max, row) {
      return Math.max(max, row.length);
    }, 0);

    // "pad out" the rows so they are all the same length
    var padded = cells.map(function (row) {
      var extra = mapW - row.length;
      return [].concat(_toConsumableArray(row), _toConsumableArray(Array(extra).fill(" ")));
    });

    // Find spawns, and replace with correct tiles
    var level = padded.map(function (row, y) {
      return row.map(function (cell, x) {
        switch (cell) {
          case "#":
            return 1;
          case "T":
            spawns.totems.push({ x: x, y: y });
            return 1;
          case "B":
            spawns.bats.push({ x: x, y: y });
            return 0;
          case "X":
            spawns.player = { x: x, y: y };
            return 0;
          default:
            return 0;
        }
      });
    }).reduce(function (ac, el) {
      return [].concat(_toConsumableArray(ac), _toConsumableArray(el));
    });

    // "3d-ify" if no wall below a tile
    for (var y = 1; y < mapH; y++) {
      for (var x = 0; x < mapW; x++) {
        var above = level[(y - 1) * mapW + x];
        var me = level[y * mapW + x];
        if (me === 1 && tileIndexes[above].walkable) {
          level[y * mapW + x] = 2;
        }
      }
    }

    // Map spawn points to pixel locations
    var _this = _possibleConstructorReturn(this, (Level.__proto__ || Object.getPrototypeOf(Level)).call(this, level.map(function (i) {
      return tileIndexes[i];
    }), mapW, mapH, tileSize, tileSize, texture));

    _this.spawns = {
      player: _this.mapToPixelPos(spawns.player),
      bats: spawns.bats.map(function (b) {
        return _this.mapToPixelPos(b);
      }),
      totems: spawns.totems.map(function (t) {
        return _this.mapToPixelPos(t);
      }),
      pickups: spawns.pickups.map(function (p) {
        return _this.mapToPixelPos(p);
      })
    };
    return _this;
  }

  _createClass(Level, [{
    key: "findFreeSpot",
    value: function findFreeSpot() {
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

        if (frame.walkable) {
          found = true;
        }
      }
      return this.mapToPixelPos({ x: x, y: y });
    }
  }]);

  return Level;
}(TileMap);

exports.default = Level;

},{"../pop/index.js":15}],27:[function(require,module,exports){
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

      // Bob spookily
      pos.y += Math.sin(t / 0.1) * 0.5;

      frame.x = (t / 0.1 | 0) % 2 + 3;
      state.update(dt);
    }
  }]);

  return Bat;
}(TileSprite);

exports.default = Bat;

},{"../../pop/index.js":15}],28:[function(require,module,exports){
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

      this.rotation += math.randf(-Math.PI, Math.PI) * dt * 0.5;

      if ((this.life -= dt) < 0) {
        this.dead = true;
      }
    }
  }]);

  return Bullet;
}(TileSprite);

exports.default = Bullet;

},{"../../pop/index.js":15}],29:[function(require,module,exports){
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

},{"../../pop/index.js":15}],30:[function(require,module,exports){
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

var entity = _index2.default.entity,
    Texture = _index2.default.Texture,
    TileSprite = _index2.default.TileSprite,
    wallslide = _index2.default.wallslide,
    physics = _index2.default.physics,
    Vec = _index2.default.Vec;


var texture = new Texture("res/images/bravedigger-tiles.png");

var GRAVITY = 2900;
var JUMP_IMPULSE = 780;
var STEER_FORCE = 2000;
var MAX_VEL = 300;
var MIN_VEL = 200;
var FRICTION_GROUND = 1800;

var Player = function (_TileSprite) {
  _inherits(Player, _TileSprite);

  function Player(controls, map) {
    _classCallCheck(this, Player);

    var _this = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, texture, 48, 48));

    _this.type = "player";
    _this.controls = controls;
    _this.map = map;
    _this.frame.x = 4;
    _this.hitBox = {
      x: 8,
      y: 10,
      w: 28,
      h: 38
    };
    _this.anchor = {
      x: 0,
      y: 0
    };
    _this.vel = new Vec();
    _this.acc = new Vec();

    _this.jumpedAt = 0;
    _this.falling = true;
    _this.fallingTimer = 0;

    _this.dir = -1;
    return _this;
  }

  _createClass(Player, [{
    key: "update",
    value: function update(dt, t) {
      var pos = this.pos,
          controls = this.controls,
          map = this.map,
          gameOver = this.gameOver,
          vel = this.vel,
          falling = this.falling;

      if (gameOver) {
        this.rotation += dt * 5;
        this.pivot.y = 24;
        this.pivot.x = 24;
        return;
      }

      var keys = controls.keys;
      var x = keys.x,
          jump = keys.action;

      if (x) {
        this.dir = x;
      }

      if (jump && !falling) {
        physics.applyImpulse(this, { x: 0, y: -JUMP_IMPULSE }, dt);
        this.falling = true;
      }

      if (this.falling) {
        physics.applyForce(this, { x: 0, y: GRAVITY });
      }

      // So you can jump and change dir (even though moving fast)
      var changingDirection = x > 0 && vel.x < 0 || x < 0 && vel.x > 0;

      //Instant speed up.
      if (x != 0 && Math.abs(vel.x) < MIN_VEL) {
        physics.applyForce(this, { x: x * STEER_FORCE * 2, y: 0 }, dt);
      } else if (changingDirection || x && vel.mag() < MAX_VEL) {
        physics.applyForce(this, { x: x * STEER_FORCE, y: 0 }, dt);
      }
      physics.applyHorizontalFriction(this, FRICTION_GROUND);

      var r = physics.integrate(this, dt);
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
      }

      if (r.hits.up) {
        vel.y = 0;
      }

      if (r.hits.left || r.hits.right) {
        vel.x = 0;
      }

      // Check if falling
      if (!this.falling && !r.hits.down) {
        // check if UNDER current is empty...
        var e = entity.bounds(this);
        var leftFoot = map.pixelToMapPos({ x: e.x, y: e.y + e.h + 1 });
        var rightFoot = map.pixelToMapPos({ x: e.x + e.w, y: e.y + e.h + 1 });
        var left = map.tileAtMapPos(leftFoot);
        var right = map.tileAtMapPos(rightFoot);
        if (left.frame.walkable && right.frame.walkable) {
          this.falling = true;
        }
      }

      // Animations
      if (x && !this.falling) {
        this.frame.x = (t / 0.1 | 0) % 4;
        if (x > 0) {
          this.anchor.x = 0;
          this.scale.x = 1;
        } else if (x < 0) {
          this.anchor.x = this.w;
          this.scale.x = -1;
        }
      }
    }
  }]);

  return Player;
}(TileSprite);

exports.default = Player;

},{"../../pop/index.js":15}],31:[function(require,module,exports){
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

    _this.type = "Totem";
    _this.frame.x = 2;
    _this.frame.y = 1;
    _this.target = target;
    _this.onFire = onFire;
    _this.fireIn = 0;
    _this.state = new State("IDLE");
    _this.hp = 8;
    return _this;
  }

  _createClass(Totem, [{
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
  }, {
    key: "update",
    value: function update(dt, t) {
      var state = this.state,
          frame = this.frame;

      switch (state.get()) {
        case "IDLE":
          if (state.first) {
            frame.x = 2;
          }
          if (math.randOneIn(250)) {
            state.set("WINDUP");
          }
          break;
        case "WINDUP":
          frame.x = [1, 0][(t / 0.1 | 0) % 2];
          if (state.time > 1) {
            this.fireAtTarget();
            state.set("IDLE");
          }
          break;
      }
      state.update(dt);
    }
  }]);

  return Totem;
}(TileSprite);

exports.default = Totem;

},{"../../pop/index.js":15,"./Bullet.js":28}],32:[function(require,module,exports){
"use strict";

var _index = require("../pop/index.js");

var _index2 = _interopRequireDefault(_index);

var _GameScreen = require("./screens/GameScreen.js");

var _GameScreen2 = _interopRequireDefault(_GameScreen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Game = _index2.default.Game,
    KeyControls = _index2.default.KeyControls;


var game = new Game(48 * 25, 48 * 16);
var controls = {
  keys: new KeyControls()
};

function startGame() {
  game.scene = new _GameScreen2.default(game, controls, startGame);
}
startGame();
game.run();

},{"../pop/index.js":15,"./screens/GameScreen.js":33}],33:[function(require,module,exports){
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

var _Player = require("../entities/Player.js");

var _Player2 = _interopRequireDefault(_Player);

var _Pickup = require("../entities/Pickup.js");

var _Pickup2 = _interopRequireDefault(_Pickup);

var _Bat = require("../entities/Bat.js");

var _Bat2 = _interopRequireDefault(_Bat);

var _Totem = require("../entities/Totem.js");

var _Totem2 = _interopRequireDefault(_Totem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Camera = _index2.default.Camera,
    Container = _index2.default.Container,
    entity = _index2.default.entity,
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
    _this.state = new State("READY");

    // Map, player, camera
    var map = new _Level2.default(game.w, game.h);
    var player = new _Player2.default(controls, map);
    player.pos.x = map.spawns.player.x;
    player.pos.y = map.spawns.player.y;

    var camera = new Camera(player, { w: game.w, h: game.h }, { w: map.w, h: map.h });
    _this.camera = _this.add(camera);
    _this.map = camera.add(map);
    _this.pickups = camera.add(new Container());
    _this.player = camera.add(player);

    // Bats
    var baddies = new Container();
    map.spawns.bats.forEach(function (_ref) {
      var x = _ref.x,
          y = _ref.y;

      var bat = baddies.add(new _Bat2.default(player));
      bat.pos.x = x;
      bat.pos.y = y;
    });
    _this.baddies = camera.add(baddies);

    // Totems
    map.spawns.totems.forEach(function (_ref2) {
      var x = _ref2.x,
          y = _ref2.y;

      var t = camera.add(new _Totem2.default(player, function (b) {
        return baddies.add(b);
      }));
      t.pos.x = x;
      t.pos.y = y;
    });

    // Pickups
    _this.populate();

    // Score
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
    key: "gotPickup",
    value: function gotPickup(pickup) {
      var camera = this.camera,
          pickups = this.pickups;

      this.score++;
      pickup.dead = true;

      camera.shake();
      camera.flash();

      if (pickups.children.length === 1) {
        this.populate();
        this.score += 5;
      }
      this.scoreText.text = this.score;
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
          }
          _get(GameScreen.prototype.__proto__ || Object.getPrototypeOf(GameScreen.prototype), "update", this).call(this, dt, t);

          // If player dead, wait for space bar
          if (player.gameOver && controls.keys.action) {
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
          pickups = this.pickups,
          state = this.state;

      baddies.map(function (b) {
        // Unkillable while we test
        // if (entity.hit(player, b)) {
        //   state.set("GAMEOVER");
        // }
      });

      // Collect pickup!
      entity.hits(player, pickups, function (pickup) {
        return _this2.gotPickup(pickup);
      });
    }
  }]);

  return GameScreen;
}(Container);

exports.default = GameScreen;

},{"../../pop/index.js":15,"../Level.js":26,"../entities/Bat.js":27,"../entities/Pickup.js":29,"../entities/Player.js":30,"../entities/Totem.js":31}]},{},[32]);
