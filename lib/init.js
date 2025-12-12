(function () {
    'use strict';

    var initMenuToggle = function initMenuToggle() {
      var button = document.querySelector('.js-menu-toggle');
      var menu = document.querySelector('.js-menu');
      if (!button || !menu) return;
      menu.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
      button.addEventListener('click', function () {
        var isExpanded = menu.classList.toggle('active');
        button.setAttribute('aria-expanded', String(isExpanded));
      });
    };
    var initGalleryIntroToggle = function initGalleryIntroToggle() {
      var galleryContainers = document.querySelectorAll('.js-gallery-container');
      if (!galleryContainers.length) return;
      galleryContainers.forEach(function (galleryContainer) {
        var toggle = galleryContainer.querySelector('.toggle-gallery-intro');
        if (!toggle) return;
        toggle.addEventListener('click', function () {
          var isOpen = galleryContainer.classList.toggle('is-intro-open');
          toggle.setAttribute('aria-expanded', String(isOpen));
          toggle.textContent = isOpen ? 'Close' : 'Intro';
        });
      });
    };
    initMenuToggle();
    initGalleryIntroToggle();

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
