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

/**
 * BaseComponent mixin - provides common functionality for web components.
 *
 * Public API (for subclasses):
 *   Styles:     initStyles (reads static styles/stylesId)
 *   DOM:        initShadow
 *   Attributes: getNumberAttr, getBooleanAttr
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
      }
    }]);
  }(Base);
  function _removeAllListeners() {
    _classPrivateFieldGet2(_listeners, this).forEach(function (_ref) {
      var target = _ref.target,
        event = _ref.event,
        handler = _ref.handler,
        options = _ref.options;
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

var styles = ":root{--duration-fast: 0.15s;--duration-normal: 0.3s;--duration-slow: 0.5s;--duration-clip: 0.6s;--duration-fade: 0.6s;--ease-default: ease;--ease-in-out: ease-in-out;--ease-out: ease-out}@media(prefers-reduced-motion: reduce){:root{--duration-fast: 0s;--duration-normal: 0s;--duration-slow: 0s;--duration-clip: 0s;--duration-fade: 0s}}dax-carousel{display:block;position:relative;width:100%;height:100%;z-index:1;background-color:#000}dax-carousel .material-symbols-sharp{font-family:\"Material Symbols Sharp\"}dax-carousel>.dax-slides{width:100%;height:100%;margin:0;padding:0;list-style:none}dax-carousel .dax-slide{position:absolute;width:100%;height:inherit;z-index:0;opacity:0;visibility:hidden;pointer-events:none;transition:opacity var(--duration-fade) var(--ease-in-out),visibility var(--duration-fade) var(--ease-in-out)}dax-carousel .dax-slide figcaption,dax-carousel .dax-slide .dax-caption-close{pointer-events:none}dax-carousel .dax-slide.dax-active{z-index:1;opacity:1;visibility:visible;pointer-events:auto;cursor:pointer}dax-carousel .dax-slide.dax-active figcaption{pointer-events:auto}dax-carousel .dax-slide.dax-active .dax-caption-close{pointer-events:auto}dax-carousel .dax-slide figure{display:flex;align-items:center;justify-content:center;width:100%;height:100%}dax-carousel .dax-slide picture{display:contents}dax-carousel .dax-slide img{width:auto;max-width:100%;height:100%;max-height:100%;object-fit:contain}dax-carousel .dax-slide figcaption{position:relative;display:block;box-sizing:border-box;max-height:33.33vh;overflow-y:auto;overflow-x:hidden;padding:16px;text-align:left;overflow-wrap:anywhere;margin:0;color:#000;background:#fff;box-shadow:4px 4px 0 rgba(0,0,0,.2)}dax-carousel .dax-slide figcaption .subject{font-weight:700;padding:0 10px 5px 0}dax-carousel .dax-slide figcaption p{padding-right:calc(42px + 8px)}dax-carousel .dax-slide figcaption .location{font-style:italic}dax-carousel .dax-slide figcaption .dax-caption-close{position:absolute;top:0;right:0;z-index:1;display:flex;align-items:center;justify-content:center;background:#fff;border:none;cursor:pointer;padding:8px 6px;color:#000}dax-carousel .dax-slide figcaption .dax-caption-close:hover{background:#666;color:#fff}dax-carousel .dax-slide figcaption .dax-caption-close:focus-visible{outline:1px solid #000;outline-offset:-1px}dax-carousel .dax-slide figcaption .dax-caption-close .material-symbols-sharp{font-size:24px;font-family:\"Material Symbols Sharp\";font-weight:400;font-style:normal;font-variation-settings:\"FILL\" 0,\"wght\" 400,\"GRAD\" 0,\"opsz\" 48;display:inline-block}dax-carousel .dax-slide figure{flex-direction:row}dax-carousel .dax-slide img{height:100%;max-height:100%}dax-carousel .dax-slide figcaption{position:absolute;bottom:calc(42px + 24px*2);left:auto;right:24px;max-height:50%;width:50%;height:auto;background:hsla(0,0%,100%,.5);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}dax-carousel .dax-control{display:flex;align-items:center;justify-content:center;border-radius:50%;cursor:pointer;transition:background var(--duration-fast) var(--ease-default),color var(--duration-fast) var(--ease-default);border:1px solid #000;background:#fff;color:#000;width:42px;height:42px;display:inline-flex;align-items:center;justify-content:center;font-size:24px}dax-carousel .dax-control--button:hover,dax-carousel .dax-control--button:active{background-color:#333;color:#fff}dax-carousel .dax-control--counter{font-size:14px;cursor:default;pointer-events:none}dax-carousel .dax-carousel-controls{display:flex;justify-content:flex-end;align-items:center;gap:12px;width:100%;position:absolute;padding:0 calc(24px*2);bottom:24px;pointer-events:none;opacity:0;transform:translateY(0);transition:opacity var(--duration-fast) var(--ease-default),transform var(--duration-normal) var(--ease-out);z-index:100}dax-carousel .dax-carousel-controls .dax-prev,dax-carousel .dax-carousel-controls .dax-next,dax-carousel .dax-carousel-controls .dax-play-pause{pointer-events:auto}dax-carousel.show-controls .dax-carousel-controls{opacity:1}dax-carousel.fullscreen{padding:0;position:fixed;inset:0;z-index:1;background:#000}dax-carousel.fullscreen .dax-slides{height:100%}dax-carousel.fullscreen .dax-slide{height:100%;display:flex;align-items:center;justify-content:center}dax-carousel.fullscreen .dax-slide img,dax-carousel.fullscreen .dax-slide picture{display:block;object-fit:cover;height:100vh;max-height:none;width:100vw}dax-carousel.no-controls .dax-carousel-controls{display:none}dax-sidebar[data-nav-open=false]+main[data-gallery-context] dax-carousel .dax-carousel-controls{transform:translateY(100%);opacity:0;pointer-events:none}@media(max-width: 810px){[data-gallery-context] dax-carousel{flex:1;min-height:0;padding-top:0}dax-carousel .dax-carousel-controls,dax-carousel figcaption .dax-caption-close,.dax-caption-toggle{display:none}dax-carousel .dax-slide{display:flex;flex-direction:column;height:100%}dax-carousel .dax-slide figure{flex:1;min-height:0;display:flex;flex-direction:column;overflow:hidden}dax-carousel .dax-slide img{flex-shrink:1;min-height:0;width:100%;max-width:100%;height:auto;object-fit:contain}dax-carousel .dax-slide figcaption{position:relative;bottom:auto;right:auto;width:100%;max-width:100%;background:#fff;backdrop-filter:none;-webkit-backdrop-filter:none;box-shadow:none;flex:1 1 auto;min-height:0;max-height:40vh;overflow-y:auto;-webkit-overflow-scrolling:touch;padding-right:16px}}dax-carousel[data-caption-open=false] figcaption{opacity:0;visibility:hidden;pointer-events:none;transition:opacity var(--duration-fast) var(--ease-out),visibility var(--duration-fast) var(--ease-out)}dax-carousel[data-caption-open=true] figcaption{opacity:1;visibility:visible;pointer-events:auto;transition:opacity var(--duration-fast) var(--ease-out),visibility var(--duration-fast) var(--ease-out)}dax-carousel[data-caption-open=false] .dax-carousel-controls{opacity:0 !important;visibility:hidden;pointer-events:none}.dax-caption-toggle{position:absolute;bottom:24px;right:calc(24px*2);opacity:0;visibility:hidden;pointer-events:none;transition:opacity var(--duration-fast) var(--ease-out),visibility var(--duration-fast) var(--ease-out);z-index:100}.dax-caption-toggle.visible{opacity:1;visibility:visible;pointer-events:auto}\n";

var DEFAULT_INTERVAL = 4000;
var CONTROLS_FADE_INTERVAL = 2500;
var CAPTION_AUTO_HIDE_DELAY_MS = 5000;

// Swipe detection thresholds
var SWIPE_THRESHOLD_PX = 50; // Minimum distance for a swipe
var SWIPE_MAX_TIME_MS = 300; // Maximum time for a swipe gesture
var MOBILE_BREAKPOINT_PX = 810; // Match $breakpoint-nav

var CONTROLS_TEMPLATE = "\n    <nav class=\"dax-carousel-controls\" aria-label=\"Slideshow controls\">\n        <span class=\"dax-control dax-control--counter dax-image-counter\" aria-live=\"polite\"></span>\n        <button class=\"dax-control dax-control--button dax-prev\" type=\"button\" aria-label=\"Previous slide\">\n            <span class=\"material-symbols-sharp\">skip_previous</span>\n        </button>\n        <button class=\"dax-control dax-control--button dax-play-pause\" type=\"button\" aria-label=\"Stop slideshow\">\n            <span class=\"material-symbols-sharp\">stop</span>\n        </button>\n        <button class=\"dax-control dax-control--button dax-next\" type=\"button\" aria-label=\"Next slide\">\n            <span class=\"material-symbols-sharp\">skip_next</span>\n        </button>\n    </nav>\n";
var CAPTION_CLOSE_TEMPLATE = "\n    <button class=\"dax-caption-close\" type=\"button\" aria-label=\"Hide caption\">\n        <span class=\"material-symbols-sharp\">close</span>\n    </button>\n";
var CAPTION_TOGGLE_TEMPLATE = "\n    <button class=\"dax-caption-toggle dax-control dax-control--button\" type=\"button\" aria-label=\"Show caption\">\n        <span class=\"material-symbols-sharp\">info</span>\n    </button>\n";
var REF_SELECTORS = {
  prevButton: '.dax-prev',
  nextButton: '.dax-next',
  playPauseButton: '.dax-play-pause',
  imageCounter: '.dax-image-counter',
  captionToggleButton: '.dax-caption-toggle'
};
var _state = /*#__PURE__*/new WeakMap();
var _refs = /*#__PURE__*/new WeakMap();
var _DaxCarousel_brand = /*#__PURE__*/new WeakSet();
var DaxCarousel = /*#__PURE__*/function (_BaseComponent) {
  function DaxCarousel() {
    var _this;
    _classCallCheck(this, DaxCarousel);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, DaxCarousel, [].concat(args));
    // Private methods
    _classPrivateMethodInitSpec(_this, _DaxCarousel_brand);
    // Private state
    _classPrivateFieldInitSpec(_this, _state, {
      intervalMs: DEFAULT_INTERVAL,
      autoplay: true,
      fullscreen: false,
      noControls: false,
      currentIndex: 0,
      timer: null,
      controlsTimer: null,
      controlsVisible: false,
      wheelLock: false,
      slides: [],
      isCaptionOpen: true,
      captionToggleTimer: null,
      // Swipe tracking
      touchStartX: 0,
      touchStartY: 0,
      touchStartTime: 0
    });
    _classPrivateFieldInitSpec(_this, _refs, {});
    return _this;
  }
  _inherits(DaxCarousel, _BaseComponent);
  return _createClass(DaxCarousel, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      // Read attributes here (not constructor) per custom-elements spec
      _classPrivateFieldGet2(_state, this).intervalMs = this.getNumberAttr('interval', DEFAULT_INTERVAL);
      _classPrivateFieldGet2(_state, this).autoplay = this.getBooleanAttr('autoplay');
      _classPrivateFieldGet2(_state, this).fullscreen = this.hasAttribute('fullscreen');
      _classPrivateFieldGet2(_state, this).noControls = this.hasAttribute('no-controls');
      this.initStyles();
      if (_classPrivateFieldGet2(_state, this).fullscreen) {
        this.classList.add('fullscreen');
      }
      if (_classPrivateFieldGet2(_state, this).noControls) {
        this.classList.add('no-controls');
      }
      _assertClassBrand(_DaxCarousel_brand, this, _initControls).call(this);
      _assertClassBrand(_DaxCarousel_brand, this, _initCaptionToggle).call(this);
      _assertClassBrand(_DaxCarousel_brand, this, _refreshSlides).call(this);
      _assertClassBrand(_DaxCarousel_brand, this, _attachEventListeners).call(this);
      if (_classPrivateFieldGet2(_state, this).autoplay) {
        _assertClassBrand(_DaxCarousel_brand, this, _start).call(this, true); // isInitial = true, don't dispatch event
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
  this.appendChild(template.content.cloneNode(true));
  _classPrivateFieldSet2(_refs, this, {
    prevButton: this.querySelector(REF_SELECTORS.prevButton),
    nextButton: this.querySelector(REF_SELECTORS.nextButton),
    playPauseButton: this.querySelector(REF_SELECTORS.playPauseButton),
    imageCounter: this.querySelector(REF_SELECTORS.imageCounter)
  });
}
function _initCaptionToggle() {
  var _this2 = this;
  // Inject close button into each figcaption and bind listener immediately
  var figcaptions = this.querySelectorAll('figcaption');
  figcaptions.forEach(function (figcaption) {
    var closeTemplate = document.createElement('template');
    closeTemplate.innerHTML = CAPTION_CLOSE_TEMPLATE;
    var closeBtn = closeTemplate.content.firstElementChild;
    _this2.addManagedListener(closeBtn, 'click', function (e) {
      e.stopPropagation();
      _assertClassBrand(_DaxCarousel_brand, _this2, _setCaptionOpen).call(_this2, false);
    });
    figcaption.insertBefore(closeBtn, figcaption.firstChild);
  });

  // Add info toggle button to carousel (positioned same as controls)
  var toggleTemplate = document.createElement('template');
  toggleTemplate.innerHTML = CAPTION_TOGGLE_TEMPLATE;
  this.appendChild(toggleTemplate.content.cloneNode(true));
  _classPrivateFieldGet2(_refs, this).captionToggleButton = this.querySelector(REF_SELECTORS.captionToggleButton);
  if (_classPrivateFieldGet2(_refs, this).captionToggleButton) {
    this.addManagedListener(_classPrivateFieldGet2(_refs, this).captionToggleButton, 'click', function (e) {
      e.stopPropagation();
      _assertClassBrand(_DaxCarousel_brand, _this2, _setCaptionOpen).call(_this2, true);
    });
  }

  // Apply initial state (caption open by default)
  _assertClassBrand(_DaxCarousel_brand, this, _applyCaptionState).call(this);
}
function _setCaptionOpen(isOpen) {
  _classPrivateFieldGet2(_state, this).isCaptionOpen = isOpen;
  _assertClassBrand(_DaxCarousel_brand, this, _applyCaptionState).call(this);
  if (!isOpen) {
    // Caption closed - show the info toggle button with auto-hide timer
    _assertClassBrand(_DaxCarousel_brand, this, _showCaptionToggle).call(this);
  } else {
    // Caption open - hide info toggle button immediately
    _assertClassBrand(_DaxCarousel_brand, this, _hideCaptionToggle).call(this);
  }
}
function _applyCaptionState() {
  var isOpen = _classPrivateFieldGet2(_state, this).isCaptionOpen;
  this.setAttribute('data-caption-open', isOpen ? 'true' : 'false');
}
function _showCaptionToggle() {
  var _classPrivateFieldGet2$1 = _classPrivateFieldGet2(_refs, this),
    captionToggleButton = _classPrivateFieldGet2$1.captionToggleButton;
  if (!captionToggleButton) return;
  captionToggleButton.classList.add('visible');

  // Clear existing timer
  if (_classPrivateFieldGet2(_state, this).captionToggleTimer) {
    this.clearManagedTimeout(_classPrivateFieldGet2(_state, this).captionToggleTimer);
  }

  // Set timer to auto-hide info button after 5s
  _classPrivateFieldGet2(_state, this).captionToggleTimer = this.setManagedTimeout(function () {
    captionToggleButton.classList.remove('visible');
  }, CAPTION_AUTO_HIDE_DELAY_MS);
}
function _hideCaptionToggle() {
  var _classPrivateFieldGet3 = _classPrivateFieldGet2(_refs, this),
    captionToggleButton = _classPrivateFieldGet3.captionToggleButton;
  if (!captionToggleButton) return;
  captionToggleButton.classList.remove('visible');

  // Clear auto-hide timer
  if (_classPrivateFieldGet2(_state, this).captionToggleTimer) {
    this.clearManagedTimeout(_classPrivateFieldGet2(_state, this).captionToggleTimer);
    _classPrivateFieldGet2(_state, this).captionToggleTimer = null;
  }
}
function _refreshSlides() {
  var listEl = this.querySelector(':scope > ul, :scope > ol');
  if (!listEl) return;
  listEl.classList.add('dax-slides');
  var slides = Array.from(listEl.children).filter(function (el) {
    return el.nodeType === Node.ELEMENT_NODE;
  });
  slides.forEach(function (slideEl, idx) {
    slideEl.classList.add('dax-slide');
    slideEl.dataset.daxIndex = String(idx);
  });
  _classPrivateFieldGet2(_state, this).slides = slides;

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

    // Remove extension and leading ./ from src for comparison
    // e.g. "./images/pic.jpg" -> "images/pic"
    var srcNoExt = src.replace(/^\.\//, '') // Strip leading ./
    .replace(/\.[^/.]+$/, ''); // Strip extension

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
    // Remove extension and leading ./ for the hash
    var srcNoExt = src.replace(/^\.\//, '') // Strip leading ./
    .replace(/\.[^/.]+$/, ''); // Strip extension

    // Update hash without scrolling
    var hash = "#".concat(srcNoExt);
    if (window.location.hash !== hash) {
      // usage of replaceState prevents cluttering history if we are just browsing
      window.history.replaceState(null, '', hash);
    }
  }
}
function _setActive(index) {
  var _classPrivateFieldGet4 = _classPrivateFieldGet2(_state, this),
    slides = _classPrivateFieldGet4.slides,
    currentIndex = _classPrivateFieldGet4.currentIndex;
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
    _assertClassBrand(_DaxCarousel_brand, this, _updateImageCounter).call(this, nextIndex);
  }
  _classPrivateFieldGet2(_state, this).currentIndex = nextIndex;
}
function _attachEventListeners() {
  var _this3 = this;
  var _classPrivateFieldGet5 = _classPrivateFieldGet2(_refs, this),
    prevButton = _classPrivateFieldGet5.prevButton,
    nextButton = _classPrivateFieldGet5.nextButton,
    playPauseButton = _classPrivateFieldGet5.playPauseButton;
  this.addManagedListener(prevButton, 'click', function () {
    _assertClassBrand(_DaxCarousel_brand, _this3, _prev).call(_this3);
    _assertClassBrand(_DaxCarousel_brand, _this3, _updateUrl).call(_this3, _classPrivateFieldGet2(_state, _this3).currentIndex);
    _assertClassBrand(_DaxCarousel_brand, _this3, _maintainAutoplayAfterManualNavigation).call(_this3);
  });
  this.addManagedListener(nextButton, 'click', function () {
    _assertClassBrand(_DaxCarousel_brand, _this3, _next).call(_this3);
    _assertClassBrand(_DaxCarousel_brand, _this3, _updateUrl).call(_this3, _classPrivateFieldGet2(_state, _this3).currentIndex);
    _assertClassBrand(_DaxCarousel_brand, _this3, _maintainAutoplayAfterManualNavigation).call(_this3);
  });
  this.addManagedListener(playPauseButton, 'click', function () {
    if (_classPrivateFieldGet2(_state, _this3).timer) {
      _classPrivateFieldGet2(_state, _this3).autoplay = false;
      _assertClassBrand(_DaxCarousel_brand, _this3, _stop).call(_this3);
    } else {
      // Advance to next slide then start autoplay
      _assertClassBrand(_DaxCarousel_brand, _this3, _next).call(_this3);
      _assertClassBrand(_DaxCarousel_brand, _this3, _start).call(_this3);
    }
  });

  // Show controls on mouse move, fade out after timeout
  // mousemove fires at ~60fps; use a dirty flag so we only schedule
  // the fade-out timeout once per visibility cycle.
  this.addManagedListener(this, 'mousemove', function () {
    if (!_classPrivateFieldGet2(_state, _this3).controlsVisible) _assertClassBrand(_DaxCarousel_brand, _this3, _showControls).call(_this3);
  });
  this.addManagedListener(this, 'mouseenter', function () {
    return _assertClassBrand(_DaxCarousel_brand, _this3, _showControls).call(_this3);
  });

  // Keyboard shortcuts
  this.addManagedListener(document, 'keydown', function (event) {
    if (event.key === 'ArrowLeft') {
      _assertClassBrand(_DaxCarousel_brand, _this3, _prev).call(_this3);
      _assertClassBrand(_DaxCarousel_brand, _this3, _updateUrl).call(_this3, _classPrivateFieldGet2(_state, _this3).currentIndex);
      _assertClassBrand(_DaxCarousel_brand, _this3, _maintainAutoplayAfterManualNavigation).call(_this3);
      _assertClassBrand(_DaxCarousel_brand, _this3, _showControls).call(_this3);
    }
    if (event.key === 'ArrowRight') {
      _assertClassBrand(_DaxCarousel_brand, _this3, _next).call(_this3);
      _assertClassBrand(_DaxCarousel_brand, _this3, _updateUrl).call(_this3, _classPrivateFieldGet2(_state, _this3).currentIndex);
      _assertClassBrand(_DaxCarousel_brand, _this3, _maintainAutoplayAfterManualNavigation).call(_this3);
      _assertClassBrand(_DaxCarousel_brand, _this3, _showControls).call(_this3);
    }
    if (event.key === ' ') {
      event.preventDefault();
      if (_classPrivateFieldGet2(_state, _this3).timer) {
        _classPrivateFieldGet2(_state, _this3).autoplay = false;
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

  // Touch swipe to navigate (mobile only)
  this.addManagedListener(this, 'touchstart', function (event) {
    _assertClassBrand(_DaxCarousel_brand, _this3, _handleTouchStart).call(_this3, event);
  }, {
    passive: true
  });
  this.addManagedListener(this, 'touchend', function (event) {
    _assertClassBrand(_DaxCarousel_brand, _this3, _handleTouchEnd).call(_this3, event);
  }, {
    passive: true
  });

  // Click on slide to advance based on click zone
  this.addManagedListener(this, 'click', function (event) {
    // Only handle clicks on slides/images, not controls or caption close button
    var slide = event.target.closest('.dax-slide');
    if (!slide || event.target.closest('.dax-carousel-controls') || event.target.closest('.dax-caption-close')) {
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

    // Update URL and restart autoplay on manual navigation
    if (didNavigate) {
      _assertClassBrand(_DaxCarousel_brand, _this3, _updateUrl).call(_this3, _classPrivateFieldGet2(_state, _this3).currentIndex);
      _assertClassBrand(_DaxCarousel_brand, _this3, _maintainAutoplayAfterManualNavigation).call(_this3);
    }
  });

  // Show controls initially
  _assertClassBrand(_DaxCarousel_brand, this, _showControls).call(this);
}
function _showControls() {
  var _this4 = this;
  this.classList.add('show-controls');
  _classPrivateFieldGet2(_state, this).controlsVisible = true;

  // If caption is closed, show the info toggle button
  if (!_classPrivateFieldGet2(_state, this).isCaptionOpen) {
    _assertClassBrand(_DaxCarousel_brand, this, _showCaptionToggle).call(this);
  }

  // Clear existing timer
  if (_classPrivateFieldGet2(_state, this).controlsTimer) {
    this.clearManagedTimeout(_classPrivateFieldGet2(_state, this).controlsTimer);
  }

  // Set new timer to hide controls
  _classPrivateFieldGet2(_state, this).controlsTimer = this.setManagedTimeout(function () {
    _this4.classList.remove('show-controls');
    _classPrivateFieldGet2(_state, _this4).controlsVisible = false;
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
  _assertClassBrand(_DaxCarousel_brand, this, _updateUrl).call(this, _classPrivateFieldGet2(_state, this).currentIndex);

  // Restart autoplay on manual scroll if active
  _assertClassBrand(_DaxCarousel_brand, this, _maintainAutoplayAfterManualNavigation).call(this);

  // Release lock after delay
  this.setManagedTimeout(function () {
    _classPrivateFieldGet2(_state, _this5).wheelLock = false;
  }, 300);
}
function _handleTouchStart(event) {
  // Only handle swipe on mobile breakpoint
  if (window.innerWidth > MOBILE_BREAKPOINT_PX) return;
  var touch = event.touches[0];
  if (!touch) return;
  _classPrivateFieldGet2(_state, this).touchStartX = touch.clientX;
  _classPrivateFieldGet2(_state, this).touchStartY = touch.clientY;
  _classPrivateFieldGet2(_state, this).touchStartTime = Date.now();
}
function _handleTouchEnd(event) {
  // Only handle swipe on mobile breakpoint
  if (window.innerWidth > MOBILE_BREAKPOINT_PX) return;
  var touch = event.changedTouches[0];
  if (!touch) return;
  var deltaX = touch.clientX - _classPrivateFieldGet2(_state, this).touchStartX;
  var deltaY = touch.clientY - _classPrivateFieldGet2(_state, this).touchStartY;
  var deltaTime = Date.now() - _classPrivateFieldGet2(_state, this).touchStartTime;

  // Check if this qualifies as a horizontal swipe:
  // 1. Horizontal distance exceeds threshold
  // 2. Horizontal movement is greater than vertical (not a scroll)
  // 3. Gesture completed within time limit
  var isHorizontalSwipe = Math.abs(deltaX) > SWIPE_THRESHOLD_PX && Math.abs(deltaX) > Math.abs(deltaY) && deltaTime < SWIPE_MAX_TIME_MS;
  if (!isHorizontalSwipe) return;
  if (deltaX < 0) {
    // Swipe left = next slide
    _assertClassBrand(_DaxCarousel_brand, this, _next).call(this);
  } else {
    // Swipe right = previous slide
    _assertClassBrand(_DaxCarousel_brand, this, _prev).call(this);
  }
  _assertClassBrand(_DaxCarousel_brand, this, _updateUrl).call(this, _classPrivateFieldGet2(_state, this).currentIndex);

  // Restart autoplay on manual swipe if active
  _assertClassBrand(_DaxCarousel_brand, this, _maintainAutoplayAfterManualNavigation).call(this);
}
function _next() {
  _assertClassBrand(_DaxCarousel_brand, this, _setActive).call(this, _classPrivateFieldGet2(_state, this).currentIndex + 1);
}
function _prev() {
  _assertClassBrand(_DaxCarousel_brand, this, _setActive).call(this, _classPrivateFieldGet2(_state, this).currentIndex - 1);
}
function _advance() {
  _assertClassBrand(_DaxCarousel_brand, this, _next).call(this);
  this.dispatchEvent(new CustomEvent('dax-carousel-advance', {
    bubbles: true,
    composed: true
  }));
}
function _start() {
  var _this6 = this;
  var isInitial = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  if (_classPrivateFieldGet2(_state, this).timer) return;
  _classPrivateFieldGet2(_state, this).timer = this.setManagedInterval(function () {
    return _assertClassBrand(_DaxCarousel_brand, _this6, _advance).call(_this6);
  }, _classPrivateFieldGet2(_state, this).intervalMs);
  _classPrivateFieldGet2(_state, this).autoplay = true;
  _assertClassBrand(_DaxCarousel_brand, this, _updatePlayPauseLabel).call(this);
  // Only dispatch autoplay-start event for user-initiated starts (not initial page load)
  if (!isInitial) {
    this.dispatchEvent(new CustomEvent('dax-carousel-autoplay-start', {
      bubbles: true,
      composed: true
    }));
  }
}
function _stop() {
  if (!_classPrivateFieldGet2(_state, this).timer) return;
  this.clearManagedInterval(_classPrivateFieldGet2(_state, this).timer);
  _classPrivateFieldGet2(_state, this).timer = null;
  _assertClassBrand(_DaxCarousel_brand, this, _updatePlayPauseLabel).call(this);
}
function _maintainAutoplayAfterManualNavigation() {
  var _this7 = this;
  if (!_classPrivateFieldGet2(_state, this).autoplay) return;

  // Unconditionally clear any existing timer and start fresh.
  // Avoids guard-clause gaps where the interval could expire
  // between the autoplay check and the restart attempt.
  if (_classPrivateFieldGet2(_state, this).timer) {
    this.clearManagedInterval(_classPrivateFieldGet2(_state, this).timer);
    _classPrivateFieldGet2(_state, this).timer = null;
  }
  _classPrivateFieldGet2(_state, this).timer = this.setManagedInterval(function () {
    return _assertClassBrand(_DaxCarousel_brand, _this7, _advance).call(_this7);
  }, _classPrivateFieldGet2(_state, this).intervalMs);
  _assertClassBrand(_DaxCarousel_brand, this, _updatePlayPauseLabel).call(this);
}
function _updatePlayPauseLabel() {
  var _classPrivateFieldGet6 = _classPrivateFieldGet2(_refs, this),
    playPauseButton = _classPrivateFieldGet6.playPauseButton;
  if (!playPauseButton) return;
  var isPlaying = Boolean(_classPrivateFieldGet2(_state, this).timer);
  var icon = playPauseButton.querySelector('.material-symbols-sharp');
  if (icon) {
    icon.textContent = isPlaying ? 'stop' : 'play_arrow';
  }
  playPauseButton.setAttribute('aria-label', isPlaying ? 'Stop slideshow' : 'Start slideshow');
}
function _updateImageCounter(index) {
  var _classPrivateFieldGet7 = _classPrivateFieldGet2(_refs, this),
    imageCounter = _classPrivateFieldGet7.imageCounter;
  if (!imageCounter) return;
  var total = _classPrivateFieldGet2(_state, this).slides.length;
  imageCounter.textContent = "".concat(index + 1, "/").concat(total);
}
function _handleAttributeChange(name, newValue) {
  if (name === 'interval') {
    var parsedInterval = Number(newValue);
    var newInterval = Number.isFinite(parsedInterval) && parsedInterval > 0 ? parsedInterval : DEFAULT_INTERVAL;
    _classPrivateFieldGet2(_state, this).intervalMs = newInterval;
    if (_classPrivateFieldGet2(_state, this).timer) {
      _assertClassBrand(_DaxCarousel_brand, this, _maintainAutoplayAfterManualNavigation).call(this);
    }
  }
}
_defineProperty(DaxCarousel, "observedAttributes", ['interval']);
_defineProperty(DaxCarousel, "styles", styles);
_defineProperty(DaxCarousel, "stylesId", 'dax-carousel-styles');
customElements.define('dax-carousel', DaxCarousel);

export { DaxCarousel as default };
//# sourceMappingURL=dax-carousel.js.map
