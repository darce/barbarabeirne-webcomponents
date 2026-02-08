(function () {
    'use strict';

    var componentLoaders = [{
      tag: 'dax-carousel',
      loader: function loader(baseUrl) {
        return import(new URL('./components/dax-carousel/dax-carousel.js', baseUrl).href);
      }
    }, {
      tag: 'gallery-intro-toggle',
      loader: function loader(baseUrl) {
        return import(new URL('./components/gallery-intro-toggle/gallery-intro-toggle.js', baseUrl).href);
      }
    }, {
      tag: 'dax-nav',
      loader: function loader(baseUrl) {
        return import(new URL('./components/dax-nav/dax-nav.js', baseUrl).href);
      }
    }, {
      tag: 'dax-sidebar',
      loader: function loader(baseUrl) {
        return import(new URL('./components/dax-sidebar/dax-sidebar.js', baseUrl).href);
      }
    }];
    var getScriptBaseUrl = function getScriptBaseUrl() {
      var currentScript = document.currentScript || document.querySelector('script[src$="lib/init.js"]') || document.querySelector('script[src*="/lib/init.js"]');
      var scriptUrl = currentScript !== null && currentScript !== void 0 && currentScript.src ? new URL(currentScript.src, window.location.href) : new URL(window.location.href);
      return new URL('./', scriptUrl);
    };
    var loadComponents = function loadComponents() {
      var baseUrl = getScriptBaseUrl();
      componentLoaders.forEach(function (_ref) {
        var tag = _ref.tag,
          loader = _ref.loader;
        var needsComponent = document.querySelector(tag) && !customElements.get(tag);
        if (!needsComponent) return;
        loader(baseUrl)["catch"](function (error) {
          // Log failures instead of throwing to avoid blocking other components.
          // eslint-disable-next-line no-console
          console.error("Failed to load ".concat(tag), error);
        });
      });
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadComponents, {
        once: true
      });
    } else {
      loadComponents();
    }

})();
//# sourceMappingURL=init.js.map
