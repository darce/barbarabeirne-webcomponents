import BaseComponent from '../base/base-component';
// CSS is pre-compiled by build:css to lib/components/dax-carousel/dax-carousel.css
import styles from '../../../lib/components/dax-carousel/dax-carousel.css';

const DEFAULT_INTERVAL = 9995000;
const CONTROLS_FADE_INTERVAL = 9992500;
const CAPTION_AUTO_HIDE_DELAY_MS = 5000;

// Swipe detection thresholds
const SWIPE_THRESHOLD_PX = 50; // Minimum distance for a swipe
const SWIPE_MAX_TIME_MS = 300; // Maximum time for a swipe gesture
const MOBILE_BREAKPOINT_PX = 810; // Match $breakpoint-nav

const CONTROLS_TEMPLATE = `
    <nav class="dax-carousel-controls" aria-label="Slideshow controls">
        <span class="dax-control dax-control--counter dax-image-counter" aria-live="polite"></span>
        <button class="dax-control dax-control--button dax-prev" type="button" aria-label="Previous slide">
            <span class="material-symbols-sharp">skip_previous</span>
        </button>
        <button class="dax-control dax-control--button dax-play-pause" type="button" aria-label="Stop slideshow">
            <span class="material-symbols-sharp">stop</span>
        </button>
        <button class="dax-control dax-control--button dax-next" type="button" aria-label="Next slide">
            <span class="material-symbols-sharp">skip_next</span>
        </button>
    </nav>
`;

const CAPTION_CLOSE_TEMPLATE = `
    <button class="dax-caption-close" type="button" aria-label="Hide caption">
        <span class="material-symbols-sharp">close</span>
    </button>
`;

const CAPTION_TOGGLE_TEMPLATE = `
    <button class="dax-caption-toggle dax-control dax-control--button" type="button" aria-label="Show caption">
        <span class="material-symbols-sharp">info</span>
    </button>
`;

const REF_SELECTORS = {
    prevButton: '.dax-prev',
    nextButton: '.dax-next',
    playPauseButton: '.dax-play-pause',
    buttonsContainer: '.dax-carousel-controls',
    imageCounter: '.dax-image-counter',
    captionCloseButton: '.dax-caption-close',
    captionToggleButton: '.dax-caption-toggle',
};

class DaxCarousel extends BaseComponent(HTMLElement) {
    static observedAttributes = ['interval', 'autoplay', 'fullscreen', 'no-controls'];

    static styles = styles;

    static stylesId = 'dax-carousel-styles';

    // Private state
    #state = {
        intervalMs: DEFAULT_INTERVAL,
        autoplay: true,
        fullscreen: false,
        noControls: false,
        currentIndex: 0,
        timer: null,
        controlsTimer: null,
        wheelLock: false,
        slides: [],
        listEl: null,
        isCaptionOpen: true,
        captionToggleTimer: null,
        // Swipe tracking
        touchStartX: 0,
        touchStartY: 0,
        touchStartTime: 0,
    };

    #refs = {};

    // Lifecycle methods
    constructor() {
        super();
        this.#state.intervalMs = this.getNumberAttr('interval', DEFAULT_INTERVAL);
        this.#state.autoplay = this.getBooleanAttr('autoplay');
        this.#state.fullscreen = this.hasAttribute('fullscreen');
        this.#state.noControls = this.hasAttribute('no-controls');
    }

    connectedCallback() {
        this.initStyles();
        if (this.#state.fullscreen) {
            this.classList.add('fullscreen');
        }
        if (this.#state.noControls) {
            this.classList.add('no-controls');
        }
        this.#initControls();
        this.#initCaptionToggle();
        this.#refreshSlides();
        this.#attachEventListeners();
        if (this.#state.autoplay) {
            this.#start();
        }
        this.#updatePlayPauseLabel();
    }

    disconnectedCallback() {
        this.cleanup();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        this.#handleAttributeChange(name, newValue);
    }

    // Private methods
    #initControls() {
        const template = document.createElement('template');
        template.innerHTML = CONTROLS_TEMPLATE;
        this.appendChild(template.content.cloneNode(true));

        this.#refs = {
            prevButton: this.querySelector(REF_SELECTORS.prevButton),
            nextButton: this.querySelector(REF_SELECTORS.nextButton),
            playPauseButton: this.querySelector(REF_SELECTORS.playPauseButton),
            buttonsContainer: this.querySelector(REF_SELECTORS.buttonsContainer),
            imageCounter: this.querySelector(REF_SELECTORS.imageCounter),
        };
    }

    #initCaptionToggle() {
        // Inject close button into each figcaption
        const figcaptions = this.querySelectorAll('figcaption');
        figcaptions.forEach((figcaption) => {
            const closeTemplate = document.createElement('template');
            closeTemplate.innerHTML = CAPTION_CLOSE_TEMPLATE;
            figcaption.insertBefore(closeTemplate.content.cloneNode(true), figcaption.firstChild);
        });

        // Add info toggle button to carousel (positioned same as controls)
        const toggleTemplate = document.createElement('template');
        toggleTemplate.innerHTML = CAPTION_TOGGLE_TEMPLATE;
        this.appendChild(toggleTemplate.content.cloneNode(true));

        // Store refs
        this.#refs.captionCloseButtons = this.querySelectorAll(REF_SELECTORS.captionCloseButton);
        this.#refs.captionToggleButton = this.querySelector(REF_SELECTORS.captionToggleButton);

        // Attach event listeners for caption toggle
        this.#refs.captionCloseButtons.forEach((btn) => {
            this.addManagedListener(btn, 'click', (e) => {
                e.stopPropagation();
                this.#setCaptionOpen(false);
            });
        });

        if (this.#refs.captionToggleButton) {
            this.addManagedListener(this.#refs.captionToggleButton, 'click', (e) => {
                e.stopPropagation();
                this.#setCaptionOpen(true);
            });
        }

        // Apply initial state (caption open by default)
        this.#applyCaptionState();
    }

    #setCaptionOpen(isOpen) {
        this.#state.isCaptionOpen = isOpen;
        this.#applyCaptionState();

        if (!isOpen) {
            // Caption closed - show the info toggle button with auto-hide timer
            this.#showCaptionToggle();
        } else {
            // Caption open - hide info toggle button immediately
            this.#hideCaptionToggle();
        }
    }

    #applyCaptionState() {
        const isOpen = this.#state.isCaptionOpen;
        this.setAttribute('data-caption-open', isOpen ? 'true' : 'false');
    }

    #showCaptionToggle() {
        const { captionToggleButton } = this.#refs;
        if (!captionToggleButton) return;

        captionToggleButton.classList.add('visible');

        // Clear existing timer
        if (this.#state.captionToggleTimer) {
            this.clearManagedTimeout(this.#state.captionToggleTimer);
        }

        // Set timer to auto-hide info button after 5s
        this.#state.captionToggleTimer = this.setManagedTimeout(() => {
            captionToggleButton.classList.remove('visible');
        }, CAPTION_AUTO_HIDE_DELAY_MS);
    }

    #hideCaptionToggle() {
        const { captionToggleButton } = this.#refs;
        if (!captionToggleButton) return;

        captionToggleButton.classList.remove('visible');

        // Clear auto-hide timer
        if (this.#state.captionToggleTimer) {
            this.clearManagedTimeout(this.#state.captionToggleTimer);
            this.#state.captionToggleTimer = null;
        }
    }

    #refreshSlides() {
        const listEl = this.querySelector(':scope > ul, :scope > ol');
        if (!listEl) return;

        listEl.classList.add('dax-slides');
        this.#state.listEl = listEl;

        const slides = Array.from(listEl.children)
            .filter((el) => el.nodeType === Node.ELEMENT_NODE);

        slides.forEach((slideEl, idx) => {
            slideEl.classList.add('dax-slide');
            slideEl.dataset.daxIndex = String(idx);
        });

        this.#state.slides = slides;
        this.#buildDots();

        // Check URL for initial slide
        const initialIndex = this.#checkUrl();
        if (initialIndex !== -1) {
            this.#state.currentIndex = initialIndex;
        }

        this.#setActive(this.#state.currentIndex);
    }

    #checkUrl() {
        const { hash } = window.location;
        if (!hash) return -1;

        // Expectations: #images/filename (no extension)
        const query = hash.replace(/^#/, '');
        if (!query) return -1;

        const index = this.#state.slides.findIndex((slide) => {
            const img = slide.querySelector('img');
            if (!img) return false;

            const src = img.getAttribute('src');
            if (!src) return false;

            // Remove extension and leading ./ from src for comparison
            // e.g. "./images/pic.jpg" -> "images/pic"
            const srcNoExt = src
                .replace(/^\.\//, '') // Strip leading ./
                .replace(/\.[^/.]+$/, ''); // Strip extension

            return srcNoExt.endsWith(query);
        });

        return index;
    }

    #updateUrl(index) {
        const slide = this.#state.slides[index];
        if (!slide) return;
        const img = slide.querySelector('img');
        if (!img) return;

        const src = img.getAttribute('src');
        if (src) {
            // Remove extension and leading ./ for the hash
            const srcNoExt = src
                .replace(/^\.\//, '') // Strip leading ./
                .replace(/\.[^/.]+$/, ''); // Strip extension

            // Update hash without scrolling
            const hash = `#${srcNoExt}`;
            if (window.location.hash !== hash) {
                // usage of replaceState prevents cluttering history if we are just browsing
                window.history.replaceState(null, '', hash);
            }
        }
    }

    #buildDots() {
        const { dotsContainer } = this.#refs;
        if (!dotsContainer) return;

        dotsContainer.innerHTML = '';
        this.#state.slides.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'dax-dot';
            dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
            dot.setAttribute('role', 'tab');
            this.addManagedListener(dot, 'click', () => this.#setActive(idx));
            dotsContainer.appendChild(dot);
        });
    }

    #setActive(index) {
        const { slides, currentIndex } = this.#state;
        if (!slides.length) return;

        const currentSlide = slides[currentIndex];
        const nextIndex = (index + slides.length) % slides.length;
        const nextSlide = slides[nextIndex];

        if (currentSlide) {
            currentSlide.classList.remove('dax-active');
            currentSlide.setAttribute('aria-hidden', 'true');
        }

        if (nextSlide) {
            nextSlide.classList.add('dax-active');
            nextSlide.setAttribute('aria-hidden', 'false');
            this.#updateUrl(nextIndex);
            this.#updateImageCounter(nextIndex);
        }

        // Update dots
        // const dots = Array.from(this.#refs.dotsContainer.children);
        // dots[currentIndex]?.classList.remove('active');
        // dots[nextIndex]?.classList.add('active');

        this.#state.currentIndex = nextIndex;
    }

    #attachEventListeners() {
        const { prevButton, nextButton, playPauseButton } = this.#refs;

        this.addManagedListener(prevButton, 'click', () => {
            this.#prev();
            if (this.#state.timer) this.#restartTimer();
        });

        this.addManagedListener(nextButton, 'click', () => {
            this.#next();
            if (this.#state.timer) this.#restartTimer();
        });

        this.addManagedListener(playPauseButton, 'click', () => {
            if (this.#state.timer) {
                this.#stop();
            } else {
                // Advance to next slide then start autoplay
                this.#next();
                this.#start();
            }
        });

        // Show controls on mouse move, fade out after timeout
        this.addManagedListener(this, 'mousemove', () => this.#showControls());
        this.addManagedListener(this, 'mouseenter', () => this.#showControls());

        // Keyboard shortcuts
        this.addManagedListener(document, 'keydown', (event) => {
            if (event.key === 'ArrowLeft') {
                this.#prev();
                this.#showControls();
            }
            if (event.key === 'ArrowRight') {
                this.#next();
                this.#showControls();
            }
            if (event.key === ' ') {
                event.preventDefault();
                if (this.#state.timer) {
                    this.#stop();
                } else {
                    this.#next();
                    this.#start();
                }
                this.#showControls();
            }
        });

        // Scroll/wheel to advance slides
        this.addManagedListener(this, 'wheel', (event) => {
            this.#handleWheel(event);
        }, { passive: false });

        // Touch swipe to navigate (mobile only)
        this.addManagedListener(this, 'touchstart', (event) => {
            this.#handleTouchStart(event);
        }, { passive: true });

        this.addManagedListener(this, 'touchend', (event) => {
            this.#handleTouchEnd(event);
        }, { passive: true });

        // Click on slide to advance based on click zone
        this.addManagedListener(this, 'click', (event) => {
            // Only handle clicks on slides/images, not controls
            const slide = event.target.closest('.dax-slide');
            if (!slide || event.target.closest('.dax-carousel-controls')) {
                return;
            }

            const image = slide.querySelector('img');
            const imageRect = image?.getBoundingClientRect();
            const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
            const clickX = event.clientX;
            const clickY = event.clientY;
            let didNavigate = false;

            if (imageRect) {
                const isInsideImage = clickX >= imageRect.left
                    && clickX <= imageRect.right
                    && clickY >= imageRect.top
                    && clickY <= imageRect.bottom;
                const leftEdge = imageRect.left + imageRect.width * 0.4;

                if (isInsideImage && clickX <= leftEdge) {
                    this.#prev();
                    didNavigate = true;
                }
            }

            if (!didNavigate && viewportWidth > 0 && clickX >= viewportWidth * 0.6) {
                this.#next();
                didNavigate = true;
            }

            this.#showControls();

            // Stop autoplay on manual navigation
            if (didNavigate && this.#state.timer) {
                this.#stop();
            }
        });

        // Show controls initially
        this.#showControls();

        // Stop autoplay when sidebar opens
        this.addManagedListener(document, 'dax-nav-toggle', (event) => {
            if (event.detail?.isOpen && this.#state.timer) {
                this.#stop();
            }
        });
    }

    #showControls() {
        this.classList.add('show-controls');

        // If caption is closed, show the info toggle button
        if (!this.#state.isCaptionOpen) {
            this.#showCaptionToggle();
        }

        // Clear existing timer
        if (this.#state.controlsTimer) {
            this.clearManagedTimeout(this.#state.controlsTimer);
        }

        // Set new timer to hide controls
        this.#state.controlsTimer = this.setManagedTimeout(() => {
            this.classList.remove('show-controls');
        }, CONTROLS_FADE_INTERVAL);
    }

    #handleWheel(event) {
        // Prevent page scroll
        event.preventDefault();

        // Debounce to avoid rapid-fire advances
        if (this.#state.wheelLock) return;

        const delta = event.deltaY;
        const threshold = 30; // Minimum scroll delta to trigger

        if (Math.abs(delta) < threshold) return;

        this.#state.wheelLock = true;

        if (delta > 0) {
            // Scroll down = next
            this.#next();
        } else {
            // Scroll up = previous
            this.#prev();
        }

        this.#showControls();

        // Stop autoplay on manual scroll
        if (this.#state.timer) {
            this.#stop();
        }

        // Release lock after delay
        this.setManagedTimeout(() => {
            this.#state.wheelLock = false;
        }, 300);
    }

    #handleTouchStart(event) {
        // Only handle swipe on mobile breakpoint
        if (window.innerWidth > MOBILE_BREAKPOINT_PX) return;

        const touch = event.touches[0];
        if (!touch) return;

        this.#state.touchStartX = touch.clientX;
        this.#state.touchStartY = touch.clientY;
        this.#state.touchStartTime = Date.now();
    }

    #handleTouchEnd(event) {
        // Only handle swipe on mobile breakpoint
        if (window.innerWidth > MOBILE_BREAKPOINT_PX) return;

        const touch = event.changedTouches[0];
        if (!touch) return;

        const deltaX = touch.clientX - this.#state.touchStartX;
        const deltaY = touch.clientY - this.#state.touchStartY;
        const deltaTime = Date.now() - this.#state.touchStartTime;

        // Check if this qualifies as a horizontal swipe:
        // 1. Horizontal distance exceeds threshold
        // 2. Horizontal movement is greater than vertical (not a scroll)
        // 3. Gesture completed within time limit
        const isHorizontalSwipe = Math.abs(deltaX) > SWIPE_THRESHOLD_PX
            && Math.abs(deltaX) > Math.abs(deltaY)
            && deltaTime < SWIPE_MAX_TIME_MS;

        if (!isHorizontalSwipe) return;

        if (deltaX < 0) {
            // Swipe left = next slide
            this.#next();
        } else {
            // Swipe right = previous slide
            this.#prev();
        }

        // Stop autoplay on manual swipe
        if (this.#state.timer) {
            this.#stop();
        }
    }

    #next() {
        this.#setActive(this.#state.currentIndex + 1);
    }

    #prev() {
        this.#setActive(this.#state.currentIndex - 1);
    }

    #start() {
        if (this.#state.timer) return;
        this.#state.timer = this.setManagedInterval(
            () => {
                this.#next();
                this.dispatchEvent(new CustomEvent('dax-carousel-advance', {
                    bubbles: true,
                    composed: true,
                }));
            },
            this.#state.intervalMs,
        );
        this.#state.autoplay = true;
        this.#updatePlayPauseLabel();
    }

    #stop() {
        if (!this.#state.timer) return;
        this.clearManagedInterval(this.#state.timer);
        this.#state.timer = null;
        this.#state.autoplay = false;
        this.#updatePlayPauseLabel();
    }

    #restartTimer() {
        if (!this.#state.timer) return;
        this.#stop();
        this.#start();
    }

    #updatePlayPauseLabel() {
        const { playPauseButton } = this.#refs;
        if (!playPauseButton) return;

        const isPlaying = Boolean(this.#state.timer);
        const icon = playPauseButton.querySelector('.material-symbols-sharp');
        if (icon) {
            icon.textContent = isPlaying ? 'stop' : 'play_arrow';
        }
        playPauseButton.setAttribute(
            'aria-label',
            isPlaying ? 'Stop slideshow' : 'Start slideshow',
        );
    }

    #updateImageCounter(index) {
        const { imageCounter } = this.#refs;
        if (!imageCounter) return;
        const total = this.#state.slides.length;
        imageCounter.textContent = `${index + 1}/${total}`;
    }

    #handleAttributeChange(name, newValue) {
        if (name === 'interval') {
            const parsedInterval = Number(newValue);
            const newInterval = Number.isFinite(parsedInterval) && parsedInterval > 0
                ? parsedInterval
                : DEFAULT_INTERVAL;
            this.#state.intervalMs = newInterval;
            if (this.#state.timer) {
                this.clearManagedInterval(this.#state.timer);
                this.#state.timer = this.setManagedInterval(
                    () => this.#next(),
                    newInterval,
                );
            }
        }
    }
}

customElements.define('dax-carousel', DaxCarousel);

export default DaxCarousel;
