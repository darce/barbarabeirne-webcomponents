"use strict";

var initMenuToggle = function initMenuToggle() {
  var button = document.querySelector('.js-menu-toggle');
  var menu = document.querySelector('.js-menu');
  if (!button || !menu) return;
  menu.classList.remove('active');
  button.setAttribute('aria-expanded', 'false');
  button.addEventListener('click', function () {
    var isExpanded = menu.classList.toggle('active');
    button.setAttribute('aria-expanded', String(isExpanded));
    document.dispatchEvent(new CustomEvent('ui-overlay-toggle', {
      bubbles: true,
      detail: {
        source: 'menu',
        isOpen: isExpanded
      }
    }));
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