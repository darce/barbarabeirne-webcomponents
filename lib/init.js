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

    var Carousel = function Carousel(galleryContainerClass) {
      var linksContainerClass = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var galleryContainer = document.querySelector(".".concat(galleryContainerClass));
      if (!galleryContainer) return;
      var carouselContainer = galleryContainer.querySelector('.js-image-carousel');
      var controlsContainer = galleryContainer.querySelector('.js-gallery-controls');
      var images = carouselContainer.children;
      var linksContainer = linksContainerClass && galleryContainer.querySelector(".".concat(linksContainerClass));
      var linksList = linksContainer === null || linksContainer === void 0 ? void 0 : linksContainer.children;
      var minMobileWidth = 810;

      // let nextButton
      var prevButton;
      var startButton;
      // let fullscreenButton
      // let captionsButton
      // let helpButton

      if (controlsContainer) {
        // nextButton = controlsContainer.querySelector('.js-next-button')
        prevButton = controlsContainer.querySelector('.js-prev-button');
        startButton = controlsContainer.querySelector('.js-start-button');
        // fullscreenButton = controlsContainer.querySelector('.js-fullscreen')
        // captionsButton = controlsContainer.querySelector('.js-display-captions')
        // helpButton = controlsContainer.querySelector('.js-display-help')
      }
      var state = {
        isFirstPlay: true,
        isPlaying: false,
        curIndex: 0,
        carouselTimer: null,
        controlsTimer: null,
        interval: carouselContainer.dataset.interval || 5000,
        controlsInterval: 2500,
        playOnce: carouselContainer.dataset.playOnce || false,
        imageCounter: carouselContainer.dataset.imageCounter || true
      };
      var setFirstImageAsCurrent = function setFirstImageAsCurrent() {
        images[0].classList.add('current');
      };
      var setImage = function setImage(newIndex) {
        var _linksList$state$curI, _linksList$state$curI2;
        images[state.curIndex].classList.remove('current');
        linksList === null || linksList === void 0 || (_linksList$state$curI = linksList[state.curIndex]) === null || _linksList$state$curI === void 0 || _linksList$state$curI.classList.remove('current');
        state.curIndex = newIndex;
        images[state.curIndex].classList.add('current');
        linksList === null || linksList === void 0 || (_linksList$state$curI2 = linksList[state.curIndex]) === null || _linksList$state$curI2 === void 0 || _linksList$state$curI2.classList.add('current');
        updateMobileImageEvents();
        updateImageCounter();
      };
      var stop = function stop() {
        clearInterval(state.carouselTimer);
        state.carouselTimer = null;
        state.isPlaying = false;
        if (controlsContainer) startButton.firstChild.innerHTML = 'play_arrow';
      };
      var next = function next() {
        stop();
        setImage((state.curIndex + 1) % images.length);
      };
      var prev = function prev() {
        stop();
        setImage((state.curIndex - 1 + images.length) % images.length);
      };
      var togglePlay = function togglePlay() {
        if (state.isPlaying) {
          stop();
        } else {
          start();
        }
      };

      // const toggleFullscreen = () => {
      //     galleryContainer.classList.toggle('fullscreen')
      //     state.isFullscreen = !state.isFullscreen
      //     if (!fullscreenButton) return
      //     fullscreenButton.firstChild.innerHTML = state.isFullscreen ? 'fullscreen_exit' : 'fullscreen'
      // }

      // const toggleCaptions = () => {
      //     carouselContainer.classList.add('show-captions')
      //     state.isCaptions = !state.isCaptions
      // }

      // const toggleHelp = () => {
      //     galleryContainer.classList.toggle('show-help')
      //     state.isHelp = !state.isHelp
      // }

      var toggleControls = function toggleControls() {
        galleryContainer.classList.add('show-controls');
        clearTimeout(state.controlsTimer);
        state.controlsTimer = setTimeout(function () {
          galleryContainer.classList.remove('show-controls');
          // galleryContainer.classList.remove('show-help')
        }, state.controlsInterval);
      };
      var updateImageCounter = function updateImageCounter() {
        if (state.imageCounter === 'false') return;
        var curImageContainer = carouselContainer.querySelector('.current figure') || carouselContainer.querySelector('.current');
        var curImageCounter = curImageContainer.querySelector('.image-counter');
        if (curImageCounter) return;
        curImageCounter = document.createElement('div');
        curImageCounter.classList.add('image-counter');
        curImageCounter.innerHTML = "".concat(state.curIndex + 1, " / ").concat(images.length);
        curImageContainer.prepend(curImageCounter);
      };
      var updateMobileImageEvents = function updateMobileImageEvents() {
        if (window.innerWidth > minMobileWidth) return;
        var prevImage = images.item((state.curIndex - 1 + images.length) % images.length);
        var curImage = images.item(state.curIndex);
        prevImage.querySelector('img').removeEventListener('mousedown', mobileImageEvents);
        curImage.querySelector('img').addEventListener('mousedown', mobileImageEvents);
      };

      /** mobile fullscreen events */
      var mobileImageEvents = function mobileImageEvents(event) {
        if (window.innerWidth > minMobileWidth) return;
        var clientWidthQuarter = window.innerWidth / 4;
        var x = event.clientX;
        if (x < clientWidthQuarter) {
          prev();
        }
        // else {
        //     // toggleFullscreen()
        // }
      };
      if (controlsContainer) {
        /** Event handlers */
        // nextButton.addEventListener('click', next)
        prevButton.addEventListener('click', prev);
        startButton.addEventListener('click', togglePlay);
        // fullscreenButton.addEventListener('click', toggleFullscreen)
        // helpButton.addEventListener('click', toggleHelp)
        // captionsButton?.addEventListener('click', toggleCaptions)
        /** keyboard shortcuts */
        document.addEventListener('keydown', function (event) {
          toggleControls();
          // if (event.key === 'ArrowRight') next()
          if (event.key === 'ArrowLeft') prev();
          if (event.key === ' ') togglePlay();
          //if (event.key === 'f') toggleFullscreen()
          //if (event.key === 'h') toggleHelp()
          //if (captionsButton && event.key === 'i') toggleCaptions()
        });
        /** mouse events */
        document.addEventListener('mousemove', toggleControls);
      }
      var init = function init() {
        state.isFirstPlay = false;
        setFirstImageAsCurrent();
        updateMobileImageEvents();
        updateImageCounter();
      };
      var start = function start() {
        /** Show next image on play, unless the gallery has just loaded */
        if (!state.isFirstPlay) {
          next();
        } else if (state.isFirstPlay) {
          /** Init gallery on first play */
          init();
        }
        state.carouselTimer = setInterval(function () {
          setImage((state.curIndex + 1) % images.length);
          if (state.playOnce === 'true' && state.curIndex === images.length - 1) {
            stop();
          }
        }, state.interval);
        if (controlsContainer) {
          startButton.firstChild.innerHTML = 'stop';
          toggleControls();
        }
        state.isPlaying = true;
      };
      return {
        start: start
      };
    };

    var carousel = Carousel('js-gallery-container', 'js-links-container');
    carousel.start();

})();
//# sourceMappingURL=init.js.map
