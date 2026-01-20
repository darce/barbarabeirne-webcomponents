function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _assertClassBrand(e, t, n) {
  if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
  throw new TypeError("Private element is not present on this object");
}
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _checkPrivateRedeclaration(e, t) {
  if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _classPrivateFieldGet2(s, a) {
  return s.get(_assertClassBrand(s, a));
}
function _classPrivateFieldInitSpec(e, t, a) {
  _checkPrivateRedeclaration(e, t), t.set(e, a);
}
function _classPrivateFieldSet2(s, a, r) {
  return s.set(_assertClassBrand(s, a), r), r;
}
function _classPrivateMethodInitSpec(e, a) {
  _checkPrivateRedeclaration(e, a), a.add(e);
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: true,
      configurable: true
    }
  }), Object.defineProperty(t, "prototype", {
    writable: false
  }), e && _setPrototypeOf(t, e);
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function () {
    return !!t;
  })();
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = true,
      o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) ; else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = true, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == typeof e || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

/**
 * Module-level state store using WeakMaps for automatic garbage collection.
 * Private to this module - components access state via class methods.
 */
var stateMap = new WeakMap();
var refsMap = new WeakMap();

/**
 * BaseComponent mixin - provides common functionality for web components.
 *
 * Public API (for subclasses):
 *   State:      initComponent, getComponentState, setComponentState,
 *                getComponentRefs, setComponentRefs
 *   Styles:     initStyles (reads static styles/stylesId)
 *   DOM:        initShadow, initLightDOM, queryRefs, queryLightRefs
 *   Attributes: getNumberAttr, getBooleanAttr, getStringAttr
 *   Events:     addManagedListener
 *   Timers:     setManagedInterval, clearManagedInterval, setManagedTimeout, clearManagedTimeout
 *   Cleanup:    cleanup (call in disconnectedCallback)
 */
var BaseComponent = function BaseComponent() {
  var _listeners, _timers, _Class_brand;
  var Base = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : HTMLElement;
  return _listeners = /*#__PURE__*/new WeakMap(), _timers = /*#__PURE__*/new WeakMap(), _Class_brand = /*#__PURE__*/new WeakSet(), /*#__PURE__*/function (_Base) {
    function _class() {
      var _this;
      _classCallCheck(this, _class);
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      _this = _callSuper(this, _class, [].concat(args));
      _classPrivateMethodInitSpec(_this, _Class_brand);
      // Private fields
      _classPrivateFieldInitSpec(_this, _listeners, []);
      _classPrivateFieldInitSpec(_this, _timers, {
        intervals: [],
        timeouts: []
      });
      return _this;
    }
    _inherits(_class, _Base);
    return _createClass(_class, [{
      key: "initComponent",
      value:
      // ─────────────────────────────────────────────────────────────
      // State Management (Public API)
      // ─────────────────────────────────────────────────────────────

      function initComponent() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var refs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        stateMap.set(this, state);
        refsMap.set(this, refs);
      }
    }, {
      key: "getComponentState",
      value: function getComponentState() {
        return stateMap.get(this);
      }
    }, {
      key: "setComponentState",
      value: function setComponentState() {
        var updates = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var state = stateMap.get(this);
        if (!state) return;
        Object.assign(state, updates);
      }
    }, {
      key: "getComponentRefs",
      value: function getComponentRefs() {
        return refsMap.get(this);
      }
    }, {
      key: "setComponentRefs",
      value: function setComponentRefs() {
        var refs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        refsMap.set(this, refs);
      }
    }, {
      key: "initStyles",
      value:
      // ─────────────────────────────────────────────────────────────
      // Styles (Public API)
      // ─────────────────────────────────────────────────────────────

      /**
       * Inject component styles into document head.
       * Reads styles from static `styles` and `stylesId` properties.
       * Only injects once per unique ID.
       */
      function initStyles() {
        var _this$constructor = this.constructor,
          styles = _this$constructor.styles,
          stylesId = _this$constructor.stylesId;
        if (!styles || !stylesId) return;
        if (document.getElementById(stylesId)) return;
        var styleEl = document.createElement('style');
        styleEl.id = stylesId;
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
      }

      // ─────────────────────────────────────────────────────────────
      // DOM Initialization (Public API)
      // ─────────────────────────────────────────────────────────────
    }, {
      key: "initShadow",
      value: function initShadow(template) {
        var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'open';
        var shadow = this.attachShadow({
          mode: mode
        });
        shadow.appendChild(template.content.cloneNode(true));
        return shadow;
      }
    }, {
      key: "initLightDOM",
      value: function initLightDOM(template) {
        this.appendChild(template.content.cloneNode(true));
      }
    }, {
      key: "queryRefs",
      value: function queryRefs() {
        var selectors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var shadow = this.shadowRoot;
        if (!shadow) return {};
        var refs = {};
        Object.entries(selectors).forEach(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            selector = _ref2[1];
          refs[key] = shadow.querySelector(selector);
        });
        return refs;
      }
    }, {
      key: "queryLightRefs",
      value: function queryLightRefs() {
        var _this2 = this;
        var selectors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var refs = {};
        Object.entries(selectors).forEach(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
            key = _ref4[0],
            selector = _ref4[1];
          refs[key] = _this2.querySelector(selector);
        });
        return refs;
      }

      // ─────────────────────────────────────────────────────────────
      // Attribute Helpers (Public API)
      // ─────────────────────────────────────────────────────────────
    }, {
      key: "getNumberAttr",
      value: function getNumberAttr(name) {
        var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var value = this.getAttribute(name);
        return value !== null ? Number(value) : defaultValue;
      }
    }, {
      key: "getBooleanAttr",
      value: function getBooleanAttr(name) {
        return this.hasAttribute(name);
      }
    }, {
      key: "getStringAttr",
      value: function getStringAttr(name) {
        var _this$getAttribute;
        var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        return (_this$getAttribute = this.getAttribute(name)) !== null && _this$getAttribute !== void 0 ? _this$getAttribute : defaultValue;
      }

      // ─────────────────────────────────────────────────────────────
      // Event Listener Management (Public API + Private cleanup)
      // ─────────────────────────────────────────────────────────────
    }, {
      key: "addManagedListener",
      value: function addManagedListener(target, event, handler, options) {
        target.addEventListener(event, handler, options);
        _classPrivateFieldGet2(_listeners, this).push({
          target: target,
          event: event,
          handler: handler,
          options: options
        });
      }
    }, {
      key: "setManagedInterval",
      value:
      // ─────────────────────────────────────────────────────────────
      // Timer Management (Public API + Private cleanup)
      // ─────────────────────────────────────────────────────────────

      function setManagedInterval(callback, delay) {
        var id = setInterval(callback, delay);
        _classPrivateFieldGet2(_timers, this).intervals.push(id);
        return id;
      }
    }, {
      key: "clearManagedInterval",
      value: function clearManagedInterval(id) {
        clearInterval(id);
        _classPrivateFieldGet2(_timers, this).intervals = _classPrivateFieldGet2(_timers, this).intervals.filter(function (i) {
          return i !== id;
        });
      }
    }, {
      key: "setManagedTimeout",
      value: function setManagedTimeout(callback, delay) {
        var id = setTimeout(callback, delay);
        _classPrivateFieldGet2(_timers, this).timeouts.push(id);
        return id;
      }
    }, {
      key: "clearManagedTimeout",
      value: function clearManagedTimeout(id) {
        clearTimeout(id);
        _classPrivateFieldGet2(_timers, this).timeouts = _classPrivateFieldGet2(_timers, this).timeouts.filter(function (i) {
          return i !== id;
        });
      }
    }, {
      key: "cleanup",
      value:
      // ─────────────────────────────────────────────────────────────
      // Cleanup (Public API - call in disconnectedCallback)
      // ─────────────────────────────────────────────────────────────

      function cleanup() {
        _assertClassBrand(_Class_brand, this, _removeAllListeners).call(this);
        _assertClassBrand(_Class_brand, this, _clearAllTimers).call(this);
        _assertClassBrand(_Class_brand, this, _destroyComponent).call(this);
      }
    }]);
  }(Base);
  function _destroyComponent() {
    stateMap["delete"](this);
    refsMap["delete"](this);
  }
  function _removeAllListeners() {
    _classPrivateFieldGet2(_listeners, this).forEach(function (_ref5) {
      var target = _ref5.target,
        event = _ref5.event,
        handler = _ref5.handler,
        options = _ref5.options;
      target.removeEventListener(event, handler, options);
    });
    _classPrivateFieldSet2(_listeners, this, []);
  }
  function _clearAllTimers() {
    _classPrivateFieldGet2(_timers, this).intervals.forEach(function (id) {
      return clearInterval(id);
    });
    _classPrivateFieldGet2(_timers, this).timeouts.forEach(function (id) {
      return clearTimeout(id);
    });
    _classPrivateFieldSet2(_timers, this, {
      intervals: [],
      timeouts: []
    });
  }
};

var styles = "dax-carousel{display:block;position:relative;width:100%;height:100%;z-index:1;background-color:#000}dax-carousel .material-symbols-sharp{font-family:\"Material Symbols Sharp\"}dax-carousel>.dax-slides{width:100%;height:100%;margin:0;padding:0;list-style:none}dax-carousel .dax-slide{position:absolute;width:100%;height:inherit;opacity:0;visibility:hidden;transition:opacity .6s ease-in-out,visibility .6s ease-in-out}dax-carousel .dax-slide.dax-active{opacity:1;visibility:visible;cursor:pointer}dax-carousel .dax-slide figure{display:flex;align-items:center;justify-content:center;width:100%;height:100%}dax-carousel .dax-slide img{width:auto;max-width:100%;height:100%;max-height:100%;object-fit:contain;border:1px solid #000}dax-carousel .dax-slide figcaption{position:relative;display:block;box-sizing:border-box;max-height:33.33vh;overflow-y:auto;padding:16px;text-align:left;overflow-wrap:anywhere;margin:0;color:#000;background:#fff}dax-carousel .dax-slide figcaption .subject{font-weight:700;padding:0 10px 5px 0}dax-carousel .dax-slide figcaption .location{font-style:italic}dax-carousel .dax-slide figure{flex-direction:column}dax-carousel .dax-slide img{height:auto;max-height:calc(100% - 33.33vh)}@media(min-width: 811px){dax-carousel .dax-slide figure{flex-direction:row}dax-carousel .dax-slide img{height:100%;max-height:100%}dax-carousel .dax-slide figcaption{position:absolute;bottom:0;left:auto;right:0;max-height:none;width:50%;height:50%;background:hsla(0,0%,100%,.5);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}}dax-carousel .dax-control{display:flex;align-items:center;justify-content:center;border-radius:50%;cursor:pointer;transition:background .15s ease,color .15s ease;border:1px solid #000;background:#fff;color:#000;width:42px;height:42px;display:inline-flex;align-items:center;justify-content:center;font-size:24px}dax-carousel .dax-control--button:hover,dax-carousel .dax-control--button:active{background-color:#333;color:#fff}dax-carousel .dax-control--counter{font-size:14px;cursor:default;pointer-events:none}dax-carousel .dax-carousel-controls{display:flex;justify-content:flex-end;align-items:center;gap:12px;width:100%;position:absolute;padding:0 calc(24px*2);bottom:24px;pointer-events:none;opacity:0;transform:translateY(0);transition:opacity .15s ease,transform .3s ease-out;z-index:100}dax-carousel .dax-carousel-controls .dax-prev,dax-carousel .dax-carousel-controls .dax-next,dax-carousel .dax-carousel-controls .dax-play-pause{pointer-events:auto}dax-carousel.show-controls .dax-carousel-controls{opacity:1}dax-carousel.fullscreen{padding:0;position:fixed;inset:0;z-index:1;background:#000}dax-carousel.fullscreen .dax-slides{height:100%}dax-carousel.fullscreen .dax-slide{height:100%;display:flex;align-items:center;justify-content:center}dax-carousel.fullscreen .dax-slide img,dax-carousel.fullscreen .dax-slide picture{display:block;object-fit:cover;height:100vh;max-height:none;width:100vw}dax-carousel.fullscreen .dax-carousel-dots{display:none}dax-carousel.no-controls .dax-carousel-controls,dax-carousel.no-controls .dax-carousel-dots{display:none}dax-sidebar[data-nav-open=false]+main[data-gallery-context] dax-carousel .dax-carousel-controls{transform:translateY(100%);opacity:0;pointer-events:none}@media(max-width: 810px){dax-carousel .dax-carousel-controls{opacity:1;transform:translateY(0)}dax-sidebar[data-nav-open=false]+main[data-gallery-context] dax-carousel .dax-carousel-controls{opacity:1;transform:translateY(0)}}@media(min-width: 811px){dax-sidebar[data-nav-open=false]+main[data-gallery-context] dax-carousel figcaption{opacity:0;visibility:hidden;pointer-events:none}}.dax-carousel-controls--external{display:flex;justify-content:flex-end;align-items:center;gap:12px;padding:12px 16px;background:#fff;opacity:1;position:static;transform:none}.dax-carousel-controls--external .material-symbols-sharp{font-family:\"Material Symbols Sharp\"}.dax-carousel-controls--external .dax-control{margin:0}\n";

var DEFAULT_INTERVAL = 9995000;
var CONTROLS_FADE_INTERVAL = 9992500;
var CONTROLS_TEMPLATE = "\n    <nav class=\"dax-carousel-controls\" aria-label=\"Slideshow controls\">\n        <span class=\"dax-control dax-control--counter dax-image-counter\" aria-live=\"polite\"></span>\n        <button class=\"dax-control dax-control--button dax-prev\" type=\"button\" aria-label=\"Previous slide\">\n            <span class=\"material-symbols-sharp\">skip_previous</span>\n        </button>\n        <button class=\"dax-control dax-control--button dax-play-pause\" type=\"button\" aria-label=\"Stop slideshow\">\n            <span class=\"material-symbols-sharp\">stop</span>\n        </button>\n        <button class=\"dax-control dax-control--button dax-next\" type=\"button\" aria-label=\"Next slide\">\n            <span class=\"material-symbols-sharp\">skip_next</span>\n        </button>\n    </nav>\n";
var REF_SELECTORS = {
  prevButton: '.dax-prev',
  nextButton: '.dax-next',
  playPauseButton: '.dax-play-pause',
  buttonsContainer: '.dax-carousel-controls',
  imageCounter: '.dax-image-counter'
  // dotsContainer: '.dax-carousel-dots',
};
var _state = /*#__PURE__*/new WeakMap();
var _refs = /*#__PURE__*/new WeakMap();
var _DaxCarousel_brand = /*#__PURE__*/new WeakSet();
var DaxCarousel = /*#__PURE__*/function (_BaseComponent) {
  // Lifecycle methods
  function DaxCarousel() {
    var _this;
    _classCallCheck(this, DaxCarousel);
    _this = _callSuper(this, DaxCarousel);
    // Private methods
    _classPrivateMethodInitSpec(_this, _DaxCarousel_brand);
    // Private state
    _classPrivateFieldInitSpec(_this, _state, {
      intervalMs: DEFAULT_INTERVAL,
      autoplay: true,
      fullscreen: false,
      noControls: false,
      controlsTarget: null,
      currentIndex: 0,
      timer: null,
      controlsTimer: null,
      wheelLock: false,
      slides: [],
      listEl: null
    });
    _classPrivateFieldInitSpec(_this, _refs, {});
    _classPrivateFieldGet2(_state, _this).intervalMs = _this.getNumberAttr('interval', DEFAULT_INTERVAL);
    _classPrivateFieldGet2(_state, _this).autoplay = _this.getBooleanAttr('autoplay');
    _classPrivateFieldGet2(_state, _this).fullscreen = _this.hasAttribute('fullscreen');
    _classPrivateFieldGet2(_state, _this).noControls = _this.hasAttribute('no-controls');
    return _this;
  }
  _inherits(DaxCarousel, _BaseComponent);
  return _createClass(DaxCarousel, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      // Read controls-target at connect time to ensure attribute is available
      _classPrivateFieldGet2(_state, this).controlsTarget = this.getAttribute('controls-target');
      this.initStyles();
      if (_classPrivateFieldGet2(_state, this).fullscreen) {
        this.classList.add('fullscreen');
      }
      if (_classPrivateFieldGet2(_state, this).noControls) {
        this.classList.add('no-controls');
      }
      _assertClassBrand(_DaxCarousel_brand, this, _initControls).call(this);
      _assertClassBrand(_DaxCarousel_brand, this, _refreshSlides).call(this);
      _assertClassBrand(_DaxCarousel_brand, this, _attachEventListeners).call(this);
      if (_classPrivateFieldGet2(_state, this).autoplay) {
        _assertClassBrand(_DaxCarousel_brand, this, _start).call(this);
      }
      _assertClassBrand(_DaxCarousel_brand, this, _updatePlayPauseLabel).call(this);
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      this.cleanup();
    }
  }, {
    key: "attributeChangedCallback",
    value: function attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue) return;
      _assertClassBrand(_DaxCarousel_brand, this, _handleAttributeChange).call(this, name, newValue);
    }
  }]);
}(BaseComponent(HTMLElement));
function _initControls() {
  var template = document.createElement('template');
  template.innerHTML = CONTROLS_TEMPLATE;
  var controlsFragment = template.content.cloneNode(true);

  // Determine where to render controls
  var controlsContainer = null;
  var targetSelector = _classPrivateFieldGet2(_state, this).controlsTarget;
  if (targetSelector) {
    controlsContainer = document.querySelector(targetSelector);
    if (controlsContainer) {
      // Mark controls as external for styling
      var nav = controlsFragment.querySelector('.dax-carousel-controls');
      if (nav) {
        nav.classList.add('dax-carousel-controls--external');
      }
      controlsContainer.appendChild(controlsFragment);
    } else {
      // Fallback to internal if target not found
      this.appendChild(controlsFragment);
    }
  } else {
    this.appendChild(controlsFragment);
  }

  // Query from the correct container
  var queryRoot = controlsContainer || this;
  _classPrivateFieldSet2(_refs, this, {
    prevButton: queryRoot.querySelector(REF_SELECTORS.prevButton),
    nextButton: queryRoot.querySelector(REF_SELECTORS.nextButton),
    playPauseButton: queryRoot.querySelector(REF_SELECTORS.playPauseButton),
    buttonsContainer: queryRoot.querySelector(REF_SELECTORS.buttonsContainer),
    imageCounter: queryRoot.querySelector(REF_SELECTORS.imageCounter)
  });
}
function _refreshSlides() {
  var listEl = this.querySelector(':scope > ul, :scope > ol');
  if (!listEl) return;
  listEl.classList.add('dax-slides');
  _classPrivateFieldGet2(_state, this).listEl = listEl;
  var slides = Array.from(listEl.children).filter(function (el) {
    return el.nodeType === Node.ELEMENT_NODE;
  });
  slides.forEach(function (slideEl, idx) {
    slideEl.classList.add('dax-slide');
    slideEl.dataset.daxIndex = String(idx);
  });
  _classPrivateFieldGet2(_state, this).slides = slides;
  _assertClassBrand(_DaxCarousel_brand, this, _buildDots).call(this);

  // Check URL for initial slide
  var initialIndex = _assertClassBrand(_DaxCarousel_brand, this, _checkUrl).call(this);
  if (initialIndex !== -1) {
    _classPrivateFieldGet2(_state, this).currentIndex = initialIndex;
  }
  _assertClassBrand(_DaxCarousel_brand, this, _setActive).call(this, _classPrivateFieldGet2(_state, this).currentIndex);
}
function _checkUrl() {
  var hash = window.location.hash;
  if (!hash) return -1;

  // Expectations: #images/filename (no extension)
  var query = hash.replace(/^#/, '');
  if (!query) return -1;
  var index = _classPrivateFieldGet2(_state, this).slides.findIndex(function (slide) {
    var img = slide.querySelector('img');
    if (!img) return false;
    var src = img.getAttribute('src');
    if (!src) return false;

    // Remove extension from src for comparison
    // e.g. "images/pic.jpg" -> "images/pic"
    var srcNoExt = src.replace(/\.[^/.]+$/, '');
    return srcNoExt.endsWith(query);
  });
  return index;
}
function _updateUrl(index) {
  var slide = _classPrivateFieldGet2(_state, this).slides[index];
  if (!slide) return;
  var img = slide.querySelector('img');
  if (!img) return;
  var src = img.getAttribute('src');
  if (src) {
    // Remove extension for the hash
    var srcNoExt = src.replace(/\.[^/.]+$/, '');

    // Update hash without scrolling
    var hash = "#".concat(srcNoExt);
    if (window.location.hash !== hash) {
      // usage of replaceState prevents cluttering history if we are just browsing
      window.history.replaceState(null, '', hash);
    }
  }
}
function _buildDots() {
  var _this2 = this;
  var _classPrivateFieldGet2$1 = _classPrivateFieldGet2(_refs, this),
    dotsContainer = _classPrivateFieldGet2$1.dotsContainer;
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';
  _classPrivateFieldGet2(_state, this).slides.forEach(function (_, idx) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'dax-dot';
    dot.setAttribute('aria-label', "Go to slide ".concat(idx + 1));
    dot.setAttribute('role', 'tab');
    _this2.addManagedListener(dot, 'click', function () {
      return _assertClassBrand(_DaxCarousel_brand, _this2, _setActive).call(_this2, idx);
    });
    dotsContainer.appendChild(dot);
  });
}
function _setActive(index) {
  var _classPrivateFieldGet3 = _classPrivateFieldGet2(_state, this),
    slides = _classPrivateFieldGet3.slides,
    currentIndex = _classPrivateFieldGet3.currentIndex;
  if (!slides.length) return;
  var currentSlide = slides[currentIndex];
  var nextIndex = (index + slides.length) % slides.length;
  var nextSlide = slides[nextIndex];
  if (currentSlide) {
    currentSlide.classList.remove('dax-active');
    currentSlide.setAttribute('aria-hidden', 'true');
  }
  if (nextSlide) {
    nextSlide.classList.add('dax-active');
    nextSlide.setAttribute('aria-hidden', 'false');
    _assertClassBrand(_DaxCarousel_brand, this, _updateUrl).call(this, nextIndex);
    _assertClassBrand(_DaxCarousel_brand, this, _updateImageCounter).call(this, nextIndex);
  }

  // Update dots
  // const dots = Array.from(this.#refs.dotsContainer.children);
  // dots[currentIndex]?.classList.remove('active');
  // dots[nextIndex]?.classList.add('active');

  _classPrivateFieldGet2(_state, this).currentIndex = nextIndex;
}
function _attachEventListeners() {
  var _this3 = this;
  var _classPrivateFieldGet4 = _classPrivateFieldGet2(_refs, this),
    prevButton = _classPrivateFieldGet4.prevButton,
    nextButton = _classPrivateFieldGet4.nextButton,
    playPauseButton = _classPrivateFieldGet4.playPauseButton;
  this.addManagedListener(prevButton, 'click', function () {
    _assertClassBrand(_DaxCarousel_brand, _this3, _prev).call(_this3);
    if (_classPrivateFieldGet2(_state, _this3).timer) _assertClassBrand(_DaxCarousel_brand, _this3, _restartTimer).call(_this3);
  });
  this.addManagedListener(nextButton, 'click', function () {
    _assertClassBrand(_DaxCarousel_brand, _this3, _next).call(_this3);
    if (_classPrivateFieldGet2(_state, _this3).timer) _assertClassBrand(_DaxCarousel_brand, _this3, _restartTimer).call(_this3);
  });
  this.addManagedListener(playPauseButton, 'click', function () {
    if (_classPrivateFieldGet2(_state, _this3).timer) {
      _assertClassBrand(_DaxCarousel_brand, _this3, _stop).call(_this3);
    } else {
      // Advance to next slide then start autoplay
      _assertClassBrand(_DaxCarousel_brand, _this3, _next).call(_this3);
      _assertClassBrand(_DaxCarousel_brand, _this3, _start).call(_this3);
    }
  });

  // Show controls on mouse move, fade out after timeout
  this.addManagedListener(this, 'mousemove', function () {
    return _assertClassBrand(_DaxCarousel_brand, _this3, _showControls).call(_this3);
  });
  this.addManagedListener(this, 'mouseenter', function () {
    return _assertClassBrand(_DaxCarousel_brand, _this3, _showControls).call(_this3);
  });

  // Keyboard shortcuts
  this.addManagedListener(document, 'keydown', function (event) {
    if (event.key === 'ArrowLeft') {
      _assertClassBrand(_DaxCarousel_brand, _this3, _prev).call(_this3);
      _assertClassBrand(_DaxCarousel_brand, _this3, _showControls).call(_this3);
    }
    if (event.key === 'ArrowRight') {
      _assertClassBrand(_DaxCarousel_brand, _this3, _next).call(_this3);
      _assertClassBrand(_DaxCarousel_brand, _this3, _showControls).call(_this3);
    }
    if (event.key === ' ') {
      event.preventDefault();
      if (_classPrivateFieldGet2(_state, _this3).timer) {
        _assertClassBrand(_DaxCarousel_brand, _this3, _stop).call(_this3);
      } else {
        _assertClassBrand(_DaxCarousel_brand, _this3, _next).call(_this3);
        _assertClassBrand(_DaxCarousel_brand, _this3, _start).call(_this3);
      }
      _assertClassBrand(_DaxCarousel_brand, _this3, _showControls).call(_this3);
    }
  });

  // Scroll/wheel to advance slides
  this.addManagedListener(this, 'wheel', function (event) {
    _assertClassBrand(_DaxCarousel_brand, _this3, _handleWheel).call(_this3, event);
  }, {
    passive: false
  });

  // Click on slide to advance based on click zone
  this.addManagedListener(this, 'click', function (event) {
    // Only handle clicks on slides/images, not controls
    var slide = event.target.closest('.dax-slide');
    if (!slide || event.target.closest('.dax-carousel-controls')) {
      return;
    }
    var image = slide.querySelector('img');
    var imageRect = image === null || image === void 0 ? void 0 : image.getBoundingClientRect();
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    var clickX = event.clientX;
    var clickY = event.clientY;
    var didNavigate = false;
    if (imageRect) {
      var isInsideImage = clickX >= imageRect.left && clickX <= imageRect.right && clickY >= imageRect.top && clickY <= imageRect.bottom;
      var leftEdge = imageRect.left + imageRect.width * 0.4;
      if (isInsideImage && clickX <= leftEdge) {
        _assertClassBrand(_DaxCarousel_brand, _this3, _prev).call(_this3);
        didNavigate = true;
      }
    }
    if (!didNavigate && viewportWidth > 0 && clickX >= viewportWidth * 0.6) {
      _assertClassBrand(_DaxCarousel_brand, _this3, _next).call(_this3);
      didNavigate = true;
    }
    _assertClassBrand(_DaxCarousel_brand, _this3, _showControls).call(_this3);

    // Stop autoplay on manual navigation
    if (didNavigate && _classPrivateFieldGet2(_state, _this3).timer) {
      _assertClassBrand(_DaxCarousel_brand, _this3, _stop).call(_this3);
    }
  });

  // Show controls initially
  _assertClassBrand(_DaxCarousel_brand, this, _showControls).call(this);
}
function _showControls() {
  var _this4 = this;
  this.classList.add('show-controls');

  // Clear existing timer
  if (_classPrivateFieldGet2(_state, this).controlsTimer) {
    this.clearManagedTimeout(_classPrivateFieldGet2(_state, this).controlsTimer);
  }

  // Set new timer to hide controls
  _classPrivateFieldGet2(_state, this).controlsTimer = this.setManagedTimeout(function () {
    _this4.classList.remove('show-controls');
  }, CONTROLS_FADE_INTERVAL);
}
function _handleWheel(event) {
  var _this5 = this;
  // Prevent page scroll
  event.preventDefault();

  // Debounce to avoid rapid-fire advances
  if (_classPrivateFieldGet2(_state, this).wheelLock) return;
  var delta = event.deltaY;
  var threshold = 30; // Minimum scroll delta to trigger

  if (Math.abs(delta) < threshold) return;
  _classPrivateFieldGet2(_state, this).wheelLock = true;
  if (delta > 0) {
    // Scroll down = next
    _assertClassBrand(_DaxCarousel_brand, this, _next).call(this);
  } else {
    // Scroll up = previous
    _assertClassBrand(_DaxCarousel_brand, this, _prev).call(this);
  }
  _assertClassBrand(_DaxCarousel_brand, this, _showControls).call(this);

  // Stop autoplay on manual scroll
  if (_classPrivateFieldGet2(_state, this).timer) {
    _assertClassBrand(_DaxCarousel_brand, this, _stop).call(this);
  }

  // Release lock after delay
  this.setManagedTimeout(function () {
    _classPrivateFieldGet2(_state, _this5).wheelLock = false;
  }, 300);
}
function _next() {
  _assertClassBrand(_DaxCarousel_brand, this, _setActive).call(this, _classPrivateFieldGet2(_state, this).currentIndex + 1);
}
function _prev() {
  _assertClassBrand(_DaxCarousel_brand, this, _setActive).call(this, _classPrivateFieldGet2(_state, this).currentIndex - 1);
}
function _start() {
  var _this6 = this;
  if (_classPrivateFieldGet2(_state, this).timer) return;
  _classPrivateFieldGet2(_state, this).timer = this.setManagedInterval(function () {
    return _assertClassBrand(_DaxCarousel_brand, _this6, _next).call(_this6);
  }, _classPrivateFieldGet2(_state, this).intervalMs);
  _classPrivateFieldGet2(_state, this).autoplay = true;
  _assertClassBrand(_DaxCarousel_brand, this, _updatePlayPauseLabel).call(this);
}
function _stop() {
  if (!_classPrivateFieldGet2(_state, this).timer) return;
  this.clearManagedInterval(_classPrivateFieldGet2(_state, this).timer);
  _classPrivateFieldGet2(_state, this).timer = null;
  _classPrivateFieldGet2(_state, this).autoplay = false;
  _assertClassBrand(_DaxCarousel_brand, this, _updatePlayPauseLabel).call(this);
}
function _restartTimer() {
  if (!_classPrivateFieldGet2(_state, this).timer) return;
  _assertClassBrand(_DaxCarousel_brand, this, _stop).call(this);
  _assertClassBrand(_DaxCarousel_brand, this, _start).call(this);
}
function _updatePlayPauseLabel() {
  var _classPrivateFieldGet5 = _classPrivateFieldGet2(_refs, this),
    playPauseButton = _classPrivateFieldGet5.playPauseButton;
  if (!playPauseButton) return;
  var isPlaying = Boolean(_classPrivateFieldGet2(_state, this).timer);
  var icon = playPauseButton.querySelector('.material-symbols-sharp');
  if (icon) {
    icon.textContent = isPlaying ? 'stop' : 'play_arrow';
  }
  playPauseButton.setAttribute('aria-label', isPlaying ? 'Stop slideshow' : 'Start slideshow');
}
function _updateImageCounter(index) {
  var _classPrivateFieldGet6 = _classPrivateFieldGet2(_refs, this),
    imageCounter = _classPrivateFieldGet6.imageCounter;
  if (!imageCounter) return;
  var total = _classPrivateFieldGet2(_state, this).slides.length;
  imageCounter.textContent = "".concat(index + 1, "/").concat(total);
}
function _handleAttributeChange(name, newValue) {
  var _this7 = this;
  if (name === 'interval') {
    var parsedInterval = Number(newValue);
    var newInterval = Number.isFinite(parsedInterval) && parsedInterval > 0 ? parsedInterval : DEFAULT_INTERVAL;
    _classPrivateFieldGet2(_state, this).intervalMs = newInterval;
    if (_classPrivateFieldGet2(_state, this).timer) {
      this.clearManagedInterval(_classPrivateFieldGet2(_state, this).timer);
      _classPrivateFieldGet2(_state, this).timer = this.setManagedInterval(function () {
        return _assertClassBrand(_DaxCarousel_brand, _this7, _next).call(_this7);
      }, newInterval);
    }
  }
}
_defineProperty(DaxCarousel, "observedAttributes", ['interval', 'autoplay', 'fullscreen', 'no-controls', 'controls-target']);
_defineProperty(DaxCarousel, "styles", styles);
_defineProperty(DaxCarousel, "stylesId", 'dax-carousel-styles');
customElements.define('dax-carousel', DaxCarousel);

export { DaxCarousel as default };
//# sourceMappingURL=dax-carousel.js.map
