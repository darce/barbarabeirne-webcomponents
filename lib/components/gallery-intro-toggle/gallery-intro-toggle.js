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

var styles = ":root{--duration-fast: 0.15s;--duration-normal: 0.3s;--duration-slow: 0.5s;--duration-clip: 0.6s;--duration-fade: 0.6s;--ease-default: ease;--ease-in-out: ease-in-out;--ease-out: ease-out}@media(prefers-reduced-motion: reduce){:root{--duration-fast: 0s;--duration-normal: 0s;--duration-slow: 0s;--duration-clip: 0s;--duration-fade: 0s}}dax-sidebar[data-nav-open=false]+main[data-gallery-context] gallery-intro-toggle{pointer-events:none}gallery-intro-toggle{pointer-events:auto;display:inline-flex;align-items:center;justify-content:center;padding:4px 12px;background:#fff;color:#000;border:1px solid #000;box-shadow:4px 4px 0 rgba(0,0,0,.2);border-radius:0;font-size:14px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;user-select:none;outline:none;transition:background var(--duration-fast) var(--ease-out),border-color var(--duration-fast) var(--ease-out),color var(--duration-fast) var(--ease-out)}gallery-intro-toggle:hover{background:#000;border-color:#000;color:#fff}gallery-intro-toggle:focus-visible{outline:1px solid #000;outline-offset:-1px}.gallery-intro{position:absolute;inset:0;padding:calc(16px*5) 16px;background:#f8f8f6;overflow-y:auto;clip-path:polygon(0 0, 0 160px, 0 0, 0 0);-webkit-clip-path:polygon(0 0, 0 160px, 0 0, 0 0);pointer-events:none;transition:clip-path var(--duration-clip) var(--ease-default),-webkit-clip-path var(--duration-clip) var(--ease-default);z-index:10;text-align:left}.gallery-intro h2{font-size:32px;padding-bottom:16px;text-align:center;line-height:1.2}.gallery-intro h3{font-size:18px;padding-top:16px;padding-bottom:16px}.gallery-intro p{padding-bottom:16px;line-height:1.6}.gallery-intro ul{list-style:disc;margin-left:16px;padding-bottom:16px}.gallery-intro li{padding-bottom:10px}[data-gallery-context].is-intro-open .gallery-intro{clip-path:polygon(0 0, 0 100%, 100% 100%, 100% 0);-webkit-clip-path:polygon(0 0, 0 100%, 100% 100%, 100% 0);pointer-events:auto;z-index:50}@media(min-width: 811px){.gallery-intro{padding-left:calc(clamp(240px, 20vw, 320px) + 16px)}}@media(max-width: 810px){dax-sidebar[data-nav-open=false]+main[data-gallery-context] gallery-intro-toggle{pointer-events:auto}.gallery-intro{padding-top:calc(3.5em + 3.5em);padding-left:24px;padding-right:24px}}\n";

/**
 * Gallery intro toggle button.
 * Standard pattern: placed inside a gallery header within <main data-gallery-context>,
 * controls .gallery-intro inside the same gallery context.
 *
 * Visibility is controlled by the gallery intro open state.
 */
var _state = /*#__PURE__*/new WeakMap();
var _GalleryIntroToggle_brand = /*#__PURE__*/new WeakSet();
var GalleryIntroToggle = /*#__PURE__*/function (_BaseComponent) {
  function GalleryIntroToggle() {
    var _this;
    _classCallCheck(this, GalleryIntroToggle);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, GalleryIntroToggle, [].concat(args));
    // Private methods
    _classPrivateMethodInitSpec(_this, _GalleryIntroToggle_brand);
    // Private state
    _classPrivateFieldInitSpec(_this, _state, {
      isOpen: false,
      galleryContainer: null
    });
    return _this;
  }
  _inherits(GalleryIntroToggle, _BaseComponent);
  return _createClass(GalleryIntroToggle, [{
    key: "connectedCallback",
    value:
    // Lifecycle methods
    function connectedCallback() {
      this.initStyles();
      _assertClassBrand(_GalleryIntroToggle_brand, this, _initButton).call(this);
      _assertClassBrand(_GalleryIntroToggle_brand, this, _attachEventListeners).call(this);
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      this.cleanup();
    }
  }]);
}(BaseComponent(HTMLElement));
function _initButton() {
  // Standard pattern: toggle in <main data-gallery-context>, gallery in the same context
  var galleryContainer = document.querySelector('[data-gallery-context]');
  var introSection = galleryContainer === null || galleryContainer === void 0 ? void 0 : galleryContainer.querySelector('.gallery-intro');
  var isOpen = Boolean(galleryContainer === null || galleryContainer === void 0 ? void 0 : galleryContainer.classList.contains('is-intro-open'));
  _classPrivateFieldGet2(_state, this).galleryContainer = galleryContainer;
  _classPrivateFieldGet2(_state, this).isOpen = isOpen;
  if (introSection) {
    introSection.setAttribute('aria-hidden', String(!isOpen));
  }
  this.setAttribute('role', 'button');
  this.setAttribute('tabindex', '0');
  this.setAttribute('aria-expanded', String(isOpen));
  this.textContent = isOpen ? 'Close' : 'Intro';
}
function _attachEventListeners() {
  var _this2 = this;
  this.addManagedListener(this, 'click', function () {
    return _assertClassBrand(_GalleryIntroToggle_brand, _this2, _toggle).call(_this2);
  });
  this.addManagedListener(this, 'keydown', function (event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      _assertClassBrand(_GalleryIntroToggle_brand, _this2, _toggle).call(_this2);
    }
  });
}
function _setOpen(isOpen) {
  if (_classPrivateFieldGet2(_state, this).isOpen === isOpen) return;
  var _classPrivateFieldGet2$1 = _classPrivateFieldGet2(_state, this),
    galleryContainer = _classPrivateFieldGet2$1.galleryContainer;
  var introSection = galleryContainer === null || galleryContainer === void 0 ? void 0 : galleryContainer.querySelector('.gallery-intro');
  _classPrivateFieldGet2(_state, this).isOpen = isOpen;
  if (isOpen && introSection) {
    introSection.setAttribute('aria-hidden', 'false');
  }
  galleryContainer === null || galleryContainer === void 0 || galleryContainer.classList.toggle('is-intro-open', isOpen);
  this.setAttribute('aria-expanded', String(isOpen));
  this.textContent = isOpen ? 'Close' : 'Intro';
  if (!isOpen && introSection) {
    introSection.setAttribute('aria-hidden', 'true');
  }
}
function _toggle() {
  _assertClassBrand(_GalleryIntroToggle_brand, this, _setOpen).call(this, !_classPrivateFieldGet2(_state, this).isOpen);
}
_defineProperty(GalleryIntroToggle, "styles", styles);
_defineProperty(GalleryIntroToggle, "stylesId", 'gallery-intro-toggle-styles');
customElements.define('gallery-intro-toggle', GalleryIntroToggle);

export { GalleryIntroToggle as default };
//# sourceMappingURL=gallery-intro-toggle.js.map
