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

var styles = ":root{--duration-fast: 0.15s;--duration-normal: 0.3s;--duration-slow: 0.5s;--duration-clip: 0.6s;--duration-fade: 0.6s;--ease-default: ease;--ease-in-out: ease-in-out;--ease-out: ease-out}@media(prefers-reduced-motion: reduce){:root{--duration-fast: 0s;--duration-normal: 0s;--duration-slow: 0s;--duration-clip: 0s;--duration-fade: 0s}}dax-nav{display:block;position:relative;overflow:hidden;padding-right:6px;padding-bottom:6px}dax-nav .dax-nav-menu{line-height:2.2rem;font-size:18px;text-align:right;padding-bottom:16px;background:hsla(0,0%,100%,.5);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);box-shadow:4px 4px 0 rgba(0,0,0,.2);transition:opacity var(--duration-normal) var(--ease-out),visibility 0s linear var(--duration-normal),transform var(--duration-normal) var(--ease-out);transform-origin:top}dax-nav .dax-nav-menu>li{text-transform:uppercase;font-weight:500;padding-right:24px}dax-nav[data-open=false]{pointer-events:none}dax-nav[data-open=false] .dax-nav-menu{opacity:0;visibility:hidden;transform:translateY(-100%);pointer-events:none}dax-nav[data-open=true]{pointer-events:auto}dax-nav[data-open=true] .dax-nav-menu{opacity:1;visibility:visible;transform:translateY(0);transition:opacity var(--duration-normal) var(--ease-out),visibility 0s linear 0s,transform var(--duration-normal) var(--ease-out)}dax-nav .dax-nav-projects{padding-bottom:16px}dax-nav .dax-nav-projects>li{font-weight:100;text-transform:capitalize;padding-right:24px}dax-nav .dax-nav-projects .dax-nav-current a{background:#000;color:#fff;box-shadow:48px 0 0 0 #000;cursor:default}dax-nav .dax-nav-menu>.dax-nav-current>a{background:#000;color:#fff;box-shadow:24px 0 0 0 #000;cursor:default}dax-nav .dax-nav-menu>li>a,dax-nav .dax-nav-projects>li a{display:block;width:100%;color:#000;text-decoration:none;cursor:pointer;transition:transform var(--duration-fast) var(--ease-out),box-shadow var(--duration-fast) var(--ease-out)}dax-nav .dax-nav-menu>li>a:hover,dax-nav .dax-nav-menu>li>a:focus-visible{background:#000;color:#fff;box-shadow:24px 0 0 0 #000}dax-nav .dax-nav-projects>li a:hover,dax-nav .dax-nav-projects>li a:focus-visible{background:#000;color:#fff;box-shadow:48px 0 0 0 #000}dax-nav .dax-nav-menu>li>a:focus-visible,dax-nav .dax-nav-projects>li a:focus-visible{outline:1px solid #000;outline-offset:-1px}@media(max-width: 810px){dax-nav .dax-nav-menu{background:#fff;backdrop-filter:none;-webkit-backdrop-filter:none}}\n";

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
    return _this;
  }
  _inherits(DaxNav, _BaseComponent);
  return _createClass(DaxNav, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this.initStyles();
      _assertClassBrand(_DaxNav_brand, this, _initDOM).call(this);
      _assertClassBrand(_DaxNav_brand, this, _markCurrentPage).call(this);
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
  }

  // Find and enhance project list
  var projectList = this.querySelector('.dax-nav-projects, .project-list');
  if (projectList) {
    projectList.classList.add('dax-nav-projects');
  }
  this.querySelectorAll('.dax-nav-menu a[href], .dax-nav-projects a[href]').forEach(function (link) {
    if (!link.hasAttribute('tabindex')) {
      link.setAttribute('tabindex', '0');
    }
  });
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
_defineProperty(DaxNav, "styles", styles);
_defineProperty(DaxNav, "stylesId", 'dax-nav-styles');
customElements.define('dax-nav', DaxNav);

export { DaxNav as default };
//# sourceMappingURL=dax-nav.js.map
