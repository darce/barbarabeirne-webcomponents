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

var styles = ":root{--duration-fast: 0.15s;--duration-normal: 0.3s;--duration-slow: 0.5s;--duration-clip: 0.6s;--duration-fade: 0.6s;--ease-default: ease;--ease-in-out: ease-in-out;--ease-out: ease-out}@media(prefers-reduced-motion: reduce){:root{--duration-fast: 0s;--duration-normal: 0s;--duration-slow: 0s;--duration-clip: 0s;--duration-fade: 0s}}:host{display:block;--dax-sidebar-breakpoint-nav: 810px}.dax-sidebar{position:fixed;top:0;left:0;z-index:9999;width:clamp(240px,20vw,320px)}:host([data-nav-open=false]) .dax-sidebar{pointer-events:none}:host([data-nav-open=false]) .dax-sidebar-header{pointer-events:auto}.dax-sidebar-backdrop{display:none;position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:99;opacity:0;transition:opacity var(--duration-normal) var(--ease-out)}.dax-sidebar-header{background:#fff;display:flex;align-items:center;position:relative;z-index:10;min-height:3.5em;padding:0 8px;margin-right:6px}.masthead{flex:1;text-transform:uppercase;text-align:right;font-family:inherit;font-weight:700;font-size:18px;padding:4px 24px 4px 8px;margin:0;margin-right:6px;white-space:nowrap;background:rgba(0,0,0,0);border:none;cursor:pointer;color:#000}.masthead:hover{background:#666;color:#fff}.masthead:focus,.masthead:focus-visible{outline:1px solid #000;outline-offset:-1px}.dax-sidebar-toggle{background:#fff;border:none;cursor:pointer;color:#000}.dax-sidebar-toggle:hover{background:#666;color:#fff}.dax-sidebar-toggle:focus,.dax-sidebar-toggle:focus-visible{outline:1px solid #000;outline-offset:-1px}.dax-sidebar-toggle .material-symbols-sharp{font-size:24px;font-family:\"Material Symbols Sharp\";font-weight:400;font-style:normal;font-variation-settings:\"FILL\" 0,\"wght\" 400,\"GRAD\" 0,\"opsz\" 48;display:inline-block;transition:transform var(--duration-fast) var(--ease-out)}:host([data-nav-open=true]) .dax-sidebar-toggle .material-symbols-sharp{transform:rotate(90deg)}@media(max-width: 810px){.dax-sidebar{width:80%;z-index:100}.dax-sidebar-header{position:relative;top:0;left:0;width:100vw;z-index:100}.masthead{text-align:right}:host([data-nav-open=true]) .dax-sidebar-backdrop{display:block;opacity:1}}\n";

var _DaxSidebar;
var NAV_AUTO_CLOSE_DELAY_MS = 5000;
var TEMPLATE = "\n<aside class=\"dax-sidebar\" id=\"sidebar\" role=\"navigation\" aria-label=\"Main navigation\">\n    <header class=\"dax-sidebar-header\">\n        <button class=\"dax-sidebar-toggle\" type=\"button\" aria-label=\"Open menu\" aria-expanded=\"false\" aria-controls=\"dax-nav-menu\">\n            <span class=\"material-symbols-sharp\" aria-hidden=\"true\">menu</span>\n        </button>\n        <button class=\"masthead\" type=\"button\" aria-label=\"Toggle menu\" aria-expanded=\"false\" aria-controls=\"dax-nav-menu\">Barbara Beirne</button>\n    </header>\n    <slot></slot>\n</aside>\n<div class=\"dax-sidebar-backdrop\" aria-hidden=\"true\"></div>\n";
var _isMenuOpen = /*#__PURE__*/new WeakMap();
var _refs = /*#__PURE__*/new WeakMap();
var _lastFocusedElement = /*#__PURE__*/new WeakMap();
var _wasModalOpen = /*#__PURE__*/new WeakMap();
var _inertTargets = /*#__PURE__*/new WeakMap();
var _scrollState = /*#__PURE__*/new WeakMap();
var _isScrollLocked = /*#__PURE__*/new WeakMap();
var _autoCloseTimerId = /*#__PURE__*/new WeakMap();
var _DaxSidebar_brand = /*#__PURE__*/new WeakSet();
var DaxSidebar = /*#__PURE__*/function (_BaseComponent) {
  function DaxSidebar() {
    var _this;
    _classCallCheck(this, DaxSidebar);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, DaxSidebar, [].concat(args));
    _classPrivateMethodInitSpec(_this, _DaxSidebar_brand);
    _classPrivateFieldInitSpec(_this, _isMenuOpen, false);
    _classPrivateFieldInitSpec(_this, _refs, {});
    _classPrivateFieldInitSpec(_this, _lastFocusedElement, null);
    _classPrivateFieldInitSpec(_this, _wasModalOpen, false);
    _classPrivateFieldInitSpec(_this, _inertTargets, new Map());
    _classPrivateFieldInitSpec(_this, _scrollState, {
      body: '',
      html: ''
    });
    _classPrivateFieldInitSpec(_this, _isScrollLocked, false);
    _classPrivateFieldInitSpec(_this, _autoCloseTimerId, null);
    return _this;
  }
  _inherits(DaxSidebar, _BaseComponent);
  return _createClass(DaxSidebar, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      var _this2 = this;
      _assertClassBrand(_DaxSidebar_brand, this, _render).call(this);
      _assertClassBrand(_DaxSidebar_brand, this, _initMenuState).call(this);
      _assertClassBrand(_DaxSidebar_brand, this, _initTouchGestures).call(this);
      _assertClassBrand(_DaxSidebar_brand, this, _attachEventListeners).call(this);
      this.addManagedListener(window, 'resize', function () {
        return _assertClassBrand(_DaxSidebar_brand, _this2, _applyModalState).call(_this2);
      });
      _assertClassBrand(_DaxSidebar_brand, this, _initCarouselListener).call(this);
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      _assertClassBrand(_DaxSidebar_brand, this, _clearAutoCloseTimer).call(this);
      this.cleanup();
    }
  }]);
}(BaseComponent(HTMLElement));
_DaxSidebar = DaxSidebar;
function _render() {
  if (!this.shadowRoot) {
    if (this.initShadow) {
      var template = document.createElement('template');
      // Inject styles directly into Shadow DOM
      template.innerHTML = "<style>".concat(_DaxSidebar.styles, "</style>").concat(TEMPLATE);
      this.initShadow(template);
    } else {
      // Fallback if initShadow is not available (e.g. if BaseComponent mixin issue)
      this.attachShadow({
        mode: 'open'
      });
      var _template = document.createElement('template');
      _template.innerHTML = "<style>".concat(_DaxSidebar.styles, "</style>").concat(TEMPLATE);
      this.shadowRoot.appendChild(_template.content.cloneNode(true));
    }
  } else if (!this.shadowRoot.querySelector('aside')) {
    // Shadow root exists but content might be missing
    var _template2 = document.createElement('template');
    _template2.innerHTML = "<style>".concat(_DaxSidebar.styles, "</style>").concat(TEMPLATE);
    this.shadowRoot.appendChild(_template2.content.cloneNode(true));
  }
  _classPrivateFieldSet2(_refs, this, {
    container: this.shadowRoot.querySelector('.dax-sidebar'),
    toggle: this.shadowRoot.querySelector('.dax-sidebar-toggle'),
    masthead: this.shadowRoot.querySelector('.masthead'),
    nav: this.querySelector('dax-nav'),
    backdrop: this.shadowRoot.querySelector('.dax-sidebar-backdrop')
  });
}
function _getNavBreakpoint() {
  var value = getComputedStyle(this).getPropertyValue('--dax-sidebar-breakpoint-nav').trim();
  var parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}
function _isDesktopView() {
  return window.innerWidth > _assertClassBrand(_DaxSidebar_brand, this, _getNavBreakpoint).call(this);
}
function _initMenuState() {
  var nav = _assertClassBrand(_DaxSidebar_brand, this, _getNavElement).call(this);
  var navState = nav === null || nav === void 0 ? void 0 : nav.getAttribute('data-open');
  var hasExplicitState = navState === 'true' || navState === 'false';
  var isDesktop = _assertClassBrand(_DaxSidebar_brand, this, _isDesktopView).call(this);
  _classPrivateFieldSet2(_isMenuOpen, this, hasExplicitState ? navState === 'true' : isDesktop);
  _assertClassBrand(_DaxSidebar_brand, this, _applyMenuState).call(this);
  _assertClassBrand(_DaxSidebar_brand, this, _emitMenuToggle).call(this, false, 'init');
}
function _getNavElement() {
  if (!_classPrivateFieldGet2(_refs, this).nav) {
    _classPrivateFieldGet2(_refs, this).nav = this.querySelector('dax-nav');
  }
  return _classPrivateFieldGet2(_refs, this).nav;
}
function _applyMenuState() {
  var _classPrivateFieldGet2$1 = _classPrivateFieldGet2(_refs, this),
    toggle = _classPrivateFieldGet2$1.toggle,
    masthead = _classPrivateFieldGet2$1.masthead;
  var nav = _assertClassBrand(_DaxSidebar_brand, this, _getNavElement).call(this);
  var isOpen = _classPrivateFieldGet2(_isMenuOpen, this);
  this.setAttribute('data-nav-open', isOpen ? 'true' : 'false');
  if (nav) {
    nav.setAttribute('data-open', isOpen ? 'true' : 'false');
    if (isOpen) {
      nav.removeAttribute('aria-hidden');
    } else {
      nav.setAttribute('aria-hidden', 'true');
    }
  }
  if (toggle) {
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    var icon = toggle.querySelector('.material-symbols-sharp');
    if (icon) icon.textContent = isOpen ? 'close' : 'menu';
  }
  if (masthead) {
    masthead.setAttribute('aria-expanded', String(isOpen));
    masthead.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  }
  _assertClassBrand(_DaxSidebar_brand, this, _applyModalState).call(this);
}
function _emitMenuToggle() {
  var emitOverlay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  var source = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'menu';
  var isOpen = _classPrivateFieldGet2(_isMenuOpen, this);
  this.dispatchEvent(new CustomEvent('dax-nav-toggle', {
    detail: {
      isOpen: isOpen,
      source: source
    },
    bubbles: true,
    composed: true
  }));
  if (emitOverlay) {
    this.dispatchEvent(new CustomEvent('ui-overlay-toggle', {
      detail: {
        source: 'menu',
        isOpen: isOpen
      },
      bubbles: true,
      composed: true
    }));
  }
}
function _setMenuOpen(isOpen) {
  var emitEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var source = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'menu';
  if (_classPrivateFieldGet2(_isMenuOpen, this) === isOpen) {
    return;
  }
  _classPrivateFieldSet2(_isMenuOpen, this, isOpen);
  _assertClassBrand(_DaxSidebar_brand, this, _applyMenuState).call(this);
  if (emitEvent) {
    _assertClassBrand(_DaxSidebar_brand, this, _emitMenuToggle).call(this, true, source);
  }
}
function _attachEventListeners() {
  var _this3 = this;
  var _classPrivateFieldGet3 = _classPrivateFieldGet2(_refs, this),
    toggle = _classPrivateFieldGet3.toggle,
    masthead = _classPrivateFieldGet3.masthead,
    backdrop = _classPrivateFieldGet3.backdrop;
  if (toggle) {
    this.addManagedListener(toggle, 'click', function () {
      return _assertClassBrand(_DaxSidebar_brand, _this3, _toggleMenu).call(_this3);
    });
  }
  if (masthead) {
    this.addManagedListener(masthead, 'click', function () {
      return _assertClassBrand(_DaxSidebar_brand, _this3, _toggleMenu).call(_this3);
    });
  }
  if (backdrop) {
    this.addManagedListener(backdrop, 'click', function () {
      return _assertClassBrand(_DaxSidebar_brand, _this3, _closeMenu).call(_this3);
    });
  }
  this.addManagedListener(document, 'keydown', function (event) {
    if (event.key === 'Escape' && _classPrivateFieldGet2(_isMenuOpen, _this3)) {
      _assertClassBrand(_DaxSidebar_brand, _this3, _closeMenu).call(_this3);
      toggle === null || toggle === void 0 || toggle.focus();
    } else if (event.key === 'Tab') {
      _assertClassBrand(_DaxSidebar_brand, _this3, _handleTabKey).call(_this3, event);
    }
  });
}
function _handleTabKey(event) {
  // Only trap on mobile when menu is open
  if (!_classPrivateFieldGet2(_isMenuOpen, this) || _assertClassBrand(_DaxSidebar_brand, this, _isDesktopView).call(this)) return;
  var focusableElements = _assertClassBrand(_DaxSidebar_brand, this, _getFocusableElements).call(this);
  if (focusableElements.length === 0) return;
  var first = focusableElements[0];
  var last = focusableElements[focusableElements.length - 1];
  var currentFocus = this.shadowRoot.activeElement || document.activeElement;
  if (event.shiftKey && currentFocus === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && currentFocus === last) {
    event.preventDefault();
    first.focus();
  }
}
function _getFocusableElements() {
  var shadowFocusable = Array.from(this.shadowRoot.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
  var lightFocusable = Array.from(this.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
  return [].concat(shadowFocusable, lightFocusable);
}
function _applyModalState() {
  var isModalOpen = _classPrivateFieldGet2(_isMenuOpen, this) && !_assertClassBrand(_DaxSidebar_brand, this, _isDesktopView).call(this);
  _assertClassBrand(_DaxSidebar_brand, this, _setInertState).call(this, isModalOpen);
  _assertClassBrand(_DaxSidebar_brand, this, _setScrollLock).call(this, isModalOpen);
  if (isModalOpen && !_classPrivateFieldGet2(_wasModalOpen, this)) {
    _assertClassBrand(_DaxSidebar_brand, this, _captureLastFocus).call(this);
    _assertClassBrand(_DaxSidebar_brand, this, _focusFirstElement).call(this);
  } else if (!isModalOpen && _classPrivateFieldGet2(_wasModalOpen, this)) {
    _assertClassBrand(_DaxSidebar_brand, this, _restoreFocus).call(this);
  }
  _classPrivateFieldSet2(_wasModalOpen, this, isModalOpen);
}
function _captureLastFocus() {
  var activeElement = this.shadowRoot.activeElement || document.activeElement;
  _classPrivateFieldSet2(_lastFocusedElement, this, activeElement instanceof HTMLElement ? activeElement : null);
}
function _focusFirstElement() {
  var _classPrivateFieldGet4 = _classPrivateFieldGet2(_refs, this),
    toggle = _classPrivateFieldGet4.toggle;
  var focusableElements = _assertClassBrand(_DaxSidebar_brand, this, _getFocusableElements).call(this);
  var focusTarget = focusableElements.find(function (element) {
    return element !== toggle;
  }) || focusableElements[0];
  focusTarget === null || focusTarget === void 0 || focusTarget.focus();
}
function _restoreFocus() {
  var _classPrivateFieldGet5 = _classPrivateFieldGet2(_refs, this),
    toggle = _classPrivateFieldGet5.toggle;
  var hasLastFocus = _classPrivateFieldGet2(_lastFocusedElement, this) && document.contains(_classPrivateFieldGet2(_lastFocusedElement, this));
  var focusTarget = hasLastFocus ? _classPrivateFieldGet2(_lastFocusedElement, this) : toggle;
  focusTarget === null || focusTarget === void 0 || focusTarget.focus();
  _classPrivateFieldSet2(_lastFocusedElement, this, null);
}
function _getInertTargets() {
  var _this4 = this;
  var parent = this.parentElement || document.body;
  return Array.from(parent.children).filter(function (child) {
    return child !== _this4;
  });
}
function _setInertState(shouldInert) {
  var _this5 = this;
  if (shouldInert && _classPrivateFieldGet2(_inertTargets, this).size === 0) {
    _assertClassBrand(_DaxSidebar_brand, this, _getInertTargets).call(this).forEach(function (element) {
      _classPrivateFieldGet2(_inertTargets, _this5).set(element, element.getAttribute('aria-hidden'));
    });
  }
  _classPrivateFieldGet2(_inertTargets, this).forEach(function (previousAriaHidden, element) {
    var target = element;
    if (shouldInert) {
      target.setAttribute('aria-hidden', 'true');
      target.inert = true;
      target.setAttribute('inert', '');
    } else {
      if (previousAriaHidden === null) {
        target.removeAttribute('aria-hidden');
      } else {
        target.setAttribute('aria-hidden', previousAriaHidden);
      }
      target.inert = false;
      target.removeAttribute('inert');
    }
  });
  if (!shouldInert) {
    _classPrivateFieldGet2(_inertTargets, this).clear();
  }
}
function _setScrollLock(shouldLock) {
  if (shouldLock) {
    if (_classPrivateFieldGet2(_isScrollLocked, this)) return;
    _classPrivateFieldSet2(_scrollState, this, {
      html: document.documentElement.style.overflow,
      body: document.body.style.overflow
    });
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    _classPrivateFieldSet2(_isScrollLocked, this, true);
    return;
  }
  if (!_classPrivateFieldGet2(_isScrollLocked, this)) return;
  document.documentElement.style.overflow = _classPrivateFieldGet2(_scrollState, this).html;
  document.body.style.overflow = _classPrivateFieldGet2(_scrollState, this).body;
  _classPrivateFieldSet2(_scrollState, this, {
    body: '',
    html: ''
  });
  _classPrivateFieldSet2(_isScrollLocked, this, false);
}
function _initTouchGestures() {
  var _this6 = this;
  var startX = 0;
  var startY = 0;
  var SWIPE_THRESHOLD = 50;
  var EDGE_ZONE = 30; // pixels from left edge

  this.addManagedListener(document, 'touchstart', function (e) {
    if (e.touches.length > 1) return;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, {
    passive: true
  });
  this.addManagedListener(document, 'touchend', function (e) {
    if (e.changedTouches.length > 1) return;
    var deltaX = e.changedTouches[0].clientX - startX;
    var deltaY = e.changedTouches[0].clientY - startY;

    // Ignore vertical swipes
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;
    var isLeftEdge = startX < EDGE_ZONE;

    // Swipe right from left edge -> open
    if (isLeftEdge && deltaX > SWIPE_THRESHOLD && !_classPrivateFieldGet2(_isMenuOpen, _this6)) {
      _assertClassBrand(_DaxSidebar_brand, _this6, _openMenu).call(_this6);
    } else if (deltaX < -SWIPE_THRESHOLD && _classPrivateFieldGet2(_isMenuOpen, _this6)) {
      // Swipe left anywhere -> close (when open)
      _assertClassBrand(_DaxSidebar_brand, _this6, _closeMenu).call(_this6);
    }
  }, {
    passive: true
  });
}
function _toggleMenu() {
  _assertClassBrand(_DaxSidebar_brand, this, _setMenuOpen).call(this, !_classPrivateFieldGet2(_isMenuOpen, this));
}
function _openMenu() {
  _assertClassBrand(_DaxSidebar_brand, this, _setMenuOpen).call(this, true);
}
function _closeMenu() {
  _assertClassBrand(_DaxSidebar_brand, this, _setMenuOpen).call(this, false);
}
function _closeNavOnly() {
  // Close nav quietly using standard state management but suppressing events
  // This ensures toggle button and host attributes remain in sync
  _assertClassBrand(_DaxSidebar_brand, this, _setMenuOpen).call(this, false, false);
}
function _isGalleryPage() {
  // Gallery pages have a <main data-gallery-context> element
  return document.querySelector('main[data-gallery-context]') !== null;
}
function _clearAutoCloseTimer() {
  if (_classPrivateFieldGet2(_autoCloseTimerId, this) !== null) {
    clearTimeout(_classPrivateFieldGet2(_autoCloseTimerId, this));
    _classPrivateFieldSet2(_autoCloseTimerId, this, null);
  }
}
function _initCarouselListener() {
  var _this8 = this;
  // Close nav after inactivity when carousel auto-play starts (only on gallery pages)
  if (!_assertClassBrand(_DaxSidebar_brand, this, _isGalleryPage).call(this)) {
    return;
  }
  var startInactivityTimer = function startInactivityTimer() {
    // Only start timer if sidebar is open and no timer is already running
    if (_classPrivateFieldGet2(_isMenuOpen, _this8) && _classPrivateFieldGet2(_autoCloseTimerId, _this8) === null) {
      _classPrivateFieldSet2(_autoCloseTimerId, _this8, setTimeout(function () {
        if (_classPrivateFieldGet2(_isMenuOpen, _this8)) {
          _assertClassBrand(_DaxSidebar_brand, _this8, _closeNavOnly).call(_this8);
        }
        _classPrivateFieldSet2(_autoCloseTimerId, _this8, null);
      }, NAV_AUTO_CLOSE_DELAY_MS));
    }
  };

  // Start timer when autoplay is activated by user
  this.addManagedListener(document, 'dax-carousel-autoplay-start', startInactivityTimer);

  // Also start timer on slide advance (for when autoplay was already running)
  this.addManagedListener(document, 'dax-carousel-advance', startInactivityTimer);
}
_defineProperty(DaxSidebar, "styles", styles);
_defineProperty(DaxSidebar, "stylesId", 'dax-sidebar-styles');
customElements.define('dax-sidebar', DaxSidebar);

export { DaxSidebar as default };
//# sourceMappingURL=dax-sidebar.js.map
