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

var styles = "dax-nav {\n  display: block;\n  background: #fff;\n}\ndax-nav .dax-nav-toggle {\n  display: none;\n  cursor: pointer;\n  position: absolute;\n  top: 0;\n  left: 0;\n  padding: 16px;\n  background: #fff;\n  border: 0;\n  z-index: 50;\n}\ndax-nav .dax-nav-toggle .material-symbols-sharp {\n  font-size: 48px;\n  color: #000;\n}\ndax-nav .dax-nav-toggle:hover, dax-nav .dax-nav-toggle:focus-visible {\n  background: #666;\n}\ndax-nav .dax-nav-toggle:hover .material-symbols-sharp, dax-nav .dax-nav-toggle:focus-visible .material-symbols-sharp {\n  color: #fff;\n}\ndax-nav .dax-nav-toggle:focus-visible {\n  outline: 2px solid #000;\n  outline-offset: -2px;\n}\ndax-nav .dax-nav-menu {\n  line-height: 2.2rem;\n  font-size: 16pt;\n  text-align: right;\n  padding-bottom: 16px;\n  list-style: none;\n  margin: 0;\n  background: #fff;\n}\ndax-nav .dax-nav-menu > li {\n  text-transform: uppercase;\n  font-weight: 500;\n}\ndax-nav .dax-nav-menu > li > a {\n  display: block;\n  width: 100%;\n  padding-right: 16px;\n  color: #000;\n  text-decoration: none;\n  cursor: pointer;\n}\ndax-nav .dax-nav-menu > li > a:hover {\n  background: #666;\n  color: #fff;\n}\ndax-nav .dax-nav-menu > li > a:focus-visible {\n  outline: 2px solid #000;\n  outline-offset: -2px;\n  background: #666;\n  color: #fff;\n}\ndax-nav .dax-nav-projects {\n  list-style: none;\n  padding: 0 0 50px;\n  margin: 0;\n}\ndax-nav .dax-nav-projects > li {\n  font-weight: 100;\n  text-transform: capitalize;\n}\ndax-nav .dax-nav-projects > li a {\n  display: block;\n  width: 100%;\n  padding-right: 16px;\n  color: #000;\n  text-decoration: none;\n  cursor: pointer;\n}\ndax-nav .dax-nav-projects > li a:hover {\n  background: #666;\n  color: #fff;\n}\ndax-nav .dax-nav-projects > li a:focus-visible {\n  outline: 2px solid #000;\n  outline-offset: -2px;\n  background: #666;\n  color: #fff;\n}\ndax-nav .dax-nav-projects > li:hover {\n  background: #666;\n}\ndax-nav .dax-nav-projects > li:hover a {\n  color: #fff;\n}\ndax-nav .dax-nav-projects .dax-nav-current {\n  background: #000;\n}\ndax-nav .dax-nav-projects .dax-nav-current a {\n  color: #fff;\n  cursor: default;\n}\ndax-nav .dax-nav-projects .dax-nav-current:hover {\n  background: #000;\n}\ndax-nav .dax-nav-menu > .dax-nav-current > a {\n  background: #000;\n  color: #fff;\n}\ndax-nav .dax-nav-menu > li {\n  padding: 5px 16px;\n}\ndax-nav .dax-nav-projects {\n  padding-bottom: 16px;\n}\n\n@media (max-width: 810px) {\n  dax-nav .dax-nav-toggle {\n    display: block;\n  }\n}";

// Auto-close delay in milliseconds - single canonical source for this value
var AUTO_CLOSE_DELAY_MS = 1600;

// Hover zone width as fraction of viewport (1/5 = 20%)
var HOVER_ZONE_FRACTION = 0.2;

// Feature detection: check if browser supports CSS :has() selector
// If not, we'll fall back to JS class toggling on <aside>
var HAS_CSS_HAS_SUPPORT = CSS.supports('selector(:has(*))');
var MENU_TEMPLATE = "\n    <button class=\"dax-nav-toggle\" type=\"button\" aria-label=\"Open menu\" aria-expanded=\"false\" aria-controls=\"dax-nav-menu\">\n        <span class=\"material-symbols-sharp\" aria-hidden=\"true\">menu</span>\n    </button>\n";
var REF_SELECTORS = {
  toggle: '.dax-nav-toggle',
  menu: '.dax-nav-menu',
  projectList: '.dax-nav-projects'
};
var _refs = /*#__PURE__*/new WeakMap();
var _isOpen = /*#__PURE__*/new WeakMap();
var _autoCloseTimer = /*#__PURE__*/new WeakMap();
var _wasAutoClosed = /*#__PURE__*/new WeakMap();
var _DaxNav_brand = /*#__PURE__*/new WeakSet();
var DaxNav = /*#__PURE__*/function (_BaseComponent) {
  function DaxNav() {
    var _this;
    _classCallCheck(this, DaxNav);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _callSuper(this, DaxNav, [].concat(args));
    _classPrivateMethodInitSpec(_this, _DaxNav_brand);
    _classPrivateFieldInitSpec(_this, _refs, {});
    _classPrivateFieldInitSpec(_this, _isOpen, false);
    _classPrivateFieldInitSpec(_this, _autoCloseTimer, null);
    // Prevents re-opening immediately after auto-close while mouse is still in hover zone
    _classPrivateFieldInitSpec(_this, _wasAutoClosed, false);
    return _this;
  }
  _inherits(DaxNav, _BaseComponent);
  return _createClass(DaxNav, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this.initStyles();
      _assertClassBrand(_DaxNav_brand, this, _initDOM).call(this);
      _assertClassBrand(_DaxNav_brand, this, _markCurrentPage).call(this);
      _assertClassBrand(_DaxNav_brand, this, _attachEventListeners).call(this);

      // Open menu initially and start auto-close timer
      _assertClassBrand(_DaxNav_brand, this, _openMenu).call(this);
      _assertClassBrand(_DaxNav_brand, this, _startAutoCloseTimer).call(this);
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      this.cleanup();
    }
  }]);
}(BaseComponent(HTMLElement));
function _initDOM() {
  // Find and enhance existing menu list
  var existingMenu = this.querySelector(':scope > ul');
  if (existingMenu) {
    existingMenu.classList.add('dax-nav-menu');
    existingMenu.id = 'dax-nav-menu';
    existingMenu.setAttribute('role', 'menubar');
  }

  // Find and enhance project list
  var projectList = this.querySelector('.dax-nav-projects, .project-list');
  if (projectList) {
    projectList.classList.add('dax-nav-projects');
    projectList.setAttribute('role', 'menu');
  }

  // Add menu items role
  this.querySelectorAll(':scope > ul > li').forEach(function (li) {
    li.setAttribute('role', 'none');
    var link = li.querySelector(':scope > a');
    if (link) {
      link.setAttribute('role', 'menuitem');
    }
  });

  // Add project items role
  this.querySelectorAll('.dax-nav-projects > li').forEach(function (li) {
    li.setAttribute('role', 'none');
    var link = li.querySelector('a');
    if (link) {
      link.setAttribute('role', 'menuitem');
    }
  });

  // Insert mobile toggle button
  var template = document.createElement('template');
  template.innerHTML = MENU_TEMPLATE;
  this.insertBefore(template.content.cloneNode(true), this.firstChild);
  _classPrivateFieldSet2(_refs, this, {
    toggle: this.querySelector(REF_SELECTORS.toggle),
    menu: this.querySelector(REF_SELECTORS.menu),
    projectList: this.querySelector(REF_SELECTORS.projectList)
  });

  // Set initial closed state via attribute
  this.setAttribute('data-open', 'false');
}
function _markCurrentPage() {
  var currentPath = window.location.pathname;

  // Remove any existing current markers
  this.querySelectorAll('.dax-nav-current').forEach(function (el) {
    el.classList.remove('dax-nav-current');
    var link = el.querySelector('a');
    if (link) {
      link.removeAttribute('aria-current');
    }
  });

  // Find matching link and mark as current
  var links = this.querySelectorAll('a[href]');
  var matchedLink = null;
  var longestMatch = 0;
  links.forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;

    // Resolve relative URLs
    var absoluteUrl = new URL(href, window.location.href);
    var linkPath = absoluteUrl.pathname;

    // Check if current path matches or starts with link path
    // Use longest match to handle nested routes
    if (currentPath === linkPath || currentPath.startsWith(linkPath.replace(/\/?$/, '/'))) {
      var matchLength = linkPath.length;
      if (matchLength > longestMatch) {
        longestMatch = matchLength;
        matchedLink = link;
      }
    }
  });
  if (matchedLink) {
    var parentLi = matchedLink.closest('li');
    if (parentLi) {
      parentLi.classList.add('dax-nav-current');
    }
    matchedLink.setAttribute('aria-current', 'page');
  }
}
function _attachEventListeners() {
  var _this2 = this;
  var _classPrivateFieldGet2$1 = _classPrivateFieldGet2(_refs, this),
    toggle = _classPrivateFieldGet2$1.toggle,
    menu = _classPrivateFieldGet2$1.menu;

  // Toggle button click
  if (toggle) {
    this.addManagedListener(toggle, 'click', function () {
      return _assertClassBrand(_DaxNav_brand, _this2, _toggleMenu).call(_this2);
    });
  }

  // Close menu on escape
  this.addManagedListener(document, 'keydown', function (event) {
    if (event.key === 'Escape' && _classPrivateFieldGet2(_isOpen, _this2)) {
      _assertClassBrand(_DaxNav_brand, _this2, _closeMenu).call(_this2);
      toggle === null || toggle === void 0 || toggle.focus();
    }
  });

  // Start auto-close timer on click outside (let timer control close, not immediate)
  this.addManagedListener(document, 'click', function (event) {
    if (_classPrivateFieldGet2(_isOpen, _this2) && !_this2.contains(event.target)) {
      _assertClassBrand(_DaxNav_brand, _this2, _startAutoCloseTimer).call(_this2);
    }
  });

  // Keyboard navigation within menu
  if (menu) {
    this.addManagedListener(menu, 'keydown', function (event) {
      _assertClassBrand(_DaxNav_brand, _this2, _handleMenuKeyboard).call(_this2, event);
    });

    // Cancel auto-close timer on any interaction within menu
    this.addManagedListener(menu, 'mousemove', function () {
      return _assertClassBrand(_DaxNav_brand, _this2, _clearAutoCloseTimer).call(_this2);
    });
    this.addManagedListener(menu, 'focusin', function () {
      return _assertClassBrand(_DaxNav_brand, _this2, _clearAutoCloseTimer).call(_this2);
    });
  }

  // Dispatch overlay event when menu state changes
  this.addManagedListener(this, 'dax-nav-toggle', function (event) {
    document.dispatchEvent(new CustomEvent('ui-overlay-toggle', {
      detail: {
        source: 'menu',
        isOpen: event.detail.isOpen
      }
    }));
  });

  // Auto-open when mouse enters left edge zone (1/5 of viewport width)
  this.addManagedListener(document, 'mousemove', function (event) {
    var hoverZoneWidth = window.innerWidth * HOVER_ZONE_FRACTION;
    var inHoverZone = event.clientX <= hoverZoneWidth;
    if (inHoverZone && !_classPrivateFieldGet2(_isOpen, _this2) && !_classPrivateFieldGet2(_wasAutoClosed, _this2)) {
      _assertClassBrand(_DaxNav_brand, _this2, _openMenu).call(_this2);
    }

    // Reset the auto-close flag when mouse leaves the hover zone
    if (!inHoverZone && _classPrivateFieldGet2(_wasAutoClosed, _this2)) {
      _classPrivateFieldSet2(_wasAutoClosed, _this2, false);
    }
  });

  // Keep menu open while mouse is over the nav or its parent sidebar
  // Use closest aside as hover target if it exists, otherwise use self
  var hoverTarget = this.closest('aside') || this;

  // Cancel any auto-close timer when mouse enters nav area
  this.addManagedListener(hoverTarget, 'mouseenter', function () {
    _assertClassBrand(_DaxNav_brand, _this2, _clearAutoCloseTimer).call(_this2);
  });

  // Start auto-close timer only when mouse leaves nav area
  this.addManagedListener(hoverTarget, 'mouseleave', function () {
    if (_classPrivateFieldGet2(_isOpen, _this2)) {
      _assertClassBrand(_DaxNav_brand, _this2, _startAutoCloseTimer).call(_this2);
    }
  });
}
function _toggleMenu() {
  if (_classPrivateFieldGet2(_isOpen, this)) {
    _assertClassBrand(_DaxNav_brand, this, _closeMenu).call(this);
  } else {
    _assertClassBrand(_DaxNav_brand, this, _openMenu).call(this);
  }
}
function _openMenu() {
  var _classPrivateFieldGet3 = _classPrivateFieldGet2(_refs, this),
    toggle = _classPrivateFieldGet3.toggle,
    menu = _classPrivateFieldGet3.menu;
  _classPrivateFieldSet2(_isOpen, this, true);

  // Set open state via attribute (CSS :has() will handle parent styling)
  this.setAttribute('data-open', 'true');

  // Fallback for browsers without :has() support
  if (!HAS_CSS_HAS_SUPPORT) {
    var _this$closest;
    (_this$closest = this.closest('aside')) === null || _this$closest === void 0 || _this$closest.classList.add('is-open');
  }
  if (toggle) {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    var icon = toggle.querySelector('.material-symbols-sharp');
    if (icon) icon.textContent = 'close';
  }
  if (menu) {
    menu.setAttribute('aria-hidden', 'false');
    // Focus first menu item
    var firstLink = menu.querySelector('a');
    if (firstLink) {
      this.setManagedTimeout(function () {
        return firstLink.focus();
      }, 100);
    }
  }
  this.dispatchEvent(new CustomEvent('dax-nav-toggle', {
    detail: {
      isOpen: true
    },
    bubbles: true
  }));

  // Note: Auto-close timer is NOT started here.
  // Timer only starts when cursor leaves the nav area (mouseleave).
}
function _closeMenu() {
  var _classPrivateFieldGet4 = _classPrivateFieldGet2(_refs, this),
    toggle = _classPrivateFieldGet4.toggle,
    menu = _classPrivateFieldGet4.menu;
  _classPrivateFieldSet2(_isOpen, this, false);

  // Set closed state via attribute
  this.setAttribute('data-open', 'false');

  // Fallback for browsers without :has() support
  if (!HAS_CSS_HAS_SUPPORT) {
    var _this$closest2;
    (_this$closest2 = this.closest('aside')) === null || _this$closest2 === void 0 || _this$closest2.classList.remove('is-open');
  }
  _assertClassBrand(_DaxNav_brand, this, _clearAutoCloseTimer).call(this);
  if (toggle) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    var icon = toggle.querySelector('.material-symbols-sharp');
    if (icon) icon.textContent = 'menu';
  }
  if (menu) {
    menu.setAttribute('aria-hidden', 'true');
  }
  this.dispatchEvent(new CustomEvent('dax-nav-toggle', {
    detail: {
      isOpen: false
    },
    bubbles: true
  }));
}
function _startAutoCloseTimer() {
  var _this3 = this;
  _assertClassBrand(_DaxNav_brand, this, _clearAutoCloseTimer).call(this);
  _classPrivateFieldSet2(_autoCloseTimer, this, this.setManagedTimeout(function () {
    if (_classPrivateFieldGet2(_isOpen, _this3)) {
      _classPrivateFieldSet2(_wasAutoClosed, _this3, true);
      _assertClassBrand(_DaxNav_brand, _this3, _closeMenu).call(_this3);
    }
  }, AUTO_CLOSE_DELAY_MS));
}
function _clearAutoCloseTimer() {
  if (_classPrivateFieldGet2(_autoCloseTimer, this)) {
    clearTimeout(_classPrivateFieldGet2(_autoCloseTimer, this));
    _classPrivateFieldSet2(_autoCloseTimer, this, null);
  }
}
function _handleMenuKeyboard(event) {
  var _focusableItems$, _focusableItems;
  var focusableItems = Array.from(this.querySelectorAll('a[href]'));
  var currentIndex = focusableItems.indexOf(document.activeElement);
  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      event.preventDefault();
      if (currentIndex < focusableItems.length - 1) {
        focusableItems[currentIndex + 1].focus();
      } else {
        focusableItems[0].focus();
      }
      break;
    case 'ArrowUp':
    case 'ArrowLeft':
      event.preventDefault();
      if (currentIndex > 0) {
        focusableItems[currentIndex - 1].focus();
      } else {
        focusableItems[focusableItems.length - 1].focus();
      }
      break;
    case 'Home':
      event.preventDefault();
      (_focusableItems$ = focusableItems[0]) === null || _focusableItems$ === void 0 || _focusableItems$.focus();
      break;
    case 'End':
      event.preventDefault();
      (_focusableItems = focusableItems[focusableItems.length - 1]) === null || _focusableItems === void 0 || _focusableItems.focus();
      break;
  }
}
_defineProperty(DaxNav, "styles", styles);
_defineProperty(DaxNav, "stylesId", 'dax-nav-styles');
customElements.define('dax-nav', DaxNav);

export { DaxNav as default };
//# sourceMappingURL=dax-nav.js.map
