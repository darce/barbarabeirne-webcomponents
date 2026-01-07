import BaseComponent from '../base/base-component';
import styles from './dax-carousel.scss';

const DEFAULT_INTERVAL = 9995000;
const CONTROLS_FADE_INTERVAL = 9992500;

const CONTROLS_TEMPLATE = `
    <nav class="dax-carousel-controls" aria-label="Slideshow controls">
        <span class="dax-image-counter" aria-live="polite"></span>
        <button class="dax-prev" type="button" aria-label="Previous slide">
            <span class="material-symbols-sharp">skip_previous</span>
        </button>
        <button class="dax-play-pause" type="button" aria-label="Stop slideshow">
            <span class="material-symbols-sharp">stop</span>
        </button>
        <button class="dax-next" type="button" aria-label="Next slide">
            <span class="material-symbols-sharp">skip_next</span>
        </button>
    </nav>
`;

const REF_SELECTORS = {
    prevButton: '.dax-prev',
    nextButton: '.dax-next',
    playPauseButton: '.dax-play-pause',
    buttonsContainer: '.dax-carousel-controls',
    imageCounter: '.dax-image-counter',
    // dotsContainer: '.dax-carousel-dots',
};

class DaxCarousel extends BaseComponent(HTMLElement) {
    static observedAttributes = ['interval', 'autoplay', 'fullscreen', 'no-controls', 'controls-target'];

    static styles = styles;

    static stylesId = 'dax-carousel-styles';

    // Private state
    #state = {
        intervalMs: DEFAULT_INTERVAL,
        autoplay: true,
        fullscreen: false,
        noControls: false,
        controlsTarget: null,
        currentIndex: 0,
        timer: null,
        controlsTimer: null,
        wheelLock: false,
        slides: [],
        listEl: null,
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
        // Read controls-target at connect time to ensure attribute is available
        this.#state.controlsTarget = this.getAttribute('controls-target');

        this.initStyles();
        if (this.#state.fullscreen) {
            this.classList.add('fullscreen');
        }
        if (this.#state.noControls) {
            this.classList.add('no-controls');
        }
        this.#initControls();
        this.#refreshSlides();
        this.#attachEventListeners();
        if (this.#state.autoplay) {
            this.#start();
        }
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
        const controlsFragment = template.content.cloneNode(true);

        // Determine where to render controls
        let controlsContainer = null;
        const targetSelector = this.#state.controlsTarget;

        if (targetSelector) {
            controlsContainer = document.querySelector(targetSelector);
            // Debug: log whether target was found
            // eslint-disable-next-line no-console
            console.log(`[dax-carousel] controls-target="${targetSelector}", found:`, !!controlsContainer);

            if (controlsContainer) {
                // Mark controls as external for styling
                const nav = controlsFragment.querySelector('.dax-carousel-controls');
                if (nav) {
                    nav.classList.add('dax-carousel-controls--external');
                }
                controlsContainer.appendChild(controlsFragment);
            } else {
                // Fallback to internal if target not found
                // eslint-disable-next-line no-console
                console.warn(`[dax-carousel] Target "${targetSelector}" not found, rendering controls internally`);
                this.appendChild(controlsFragment);
            }
        } else {
            this.appendChild(controlsFragment);
        }

        // Query from the correct container
        const queryRoot = controlsContainer || this;
        this.#refs = {
            prevButton: queryRoot.querySelector(REF_SELECTORS.prevButton),
            nextButton: queryRoot.querySelector(REF_SELECTORS.nextButton),
            playPauseButton: queryRoot.querySelector(REF_SELECTORS.playPauseButton),
            buttonsContainer: queryRoot.querySelector(REF_SELECTORS.buttonsContainer),
            imageCounter: queryRoot.querySelector(REF_SELECTORS.imageCounter),
        };
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

            // Remove extension from src for comparison
            // e.g. "images/pic.jpg" -> "images/pic"
            const srcNoExt = src.replace(/\.[^/.]+$/, '');

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
            // Remove extension for the hash
            const srcNoExt = src.replace(/\.[^/.]+$/, '');

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
            this.#positionControls(nextSlide);
            this.#updateUrl(nextIndex);
            this.#updateImageCounter(nextIndex);
        }

        // Update dots
        // const dots = Array.from(this.#refs.dotsContainer.children);
        // dots[currentIndex]?.classList.remove('active');
        // dots[nextIndex]?.classList.add('active');

        this.#state.currentIndex = nextIndex;
    }

    #positionControls(slide) {
        const img = slide.querySelector('img');
        if (!img) return;

        const { buttonsContainer } = this.#refs;

        // Position dots at bottom of image, buttons at 50% of image height
        const updatePosition = () => {
            const imgRect = img.getBoundingClientRect();
            const carouselRect = this.getBoundingClientRect();
            const imgTop = imgRect.top - carouselRect.top;
            const imgHeight = imgRect.height;

            // Dots at bottom of image
            // if (dotsContainer) {
            //     dotsContainer.style.top = `${imgTop + imgHeight}px`;
            // }

            // Buttons at 50% of image height
            if (buttonsContainer) {
                buttonsContainer.style.top = `${imgTop + imgHeight / 2}px`;
            }
        };

        // Update immediately and after image loads
        if (img.complete) {
            updatePosition();
        } else {
            img.addEventListener('load', updatePosition, { once: true });
        }
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

        // Reposition controls on window resize
        this.addManagedListener(window, 'resize', () => {
            const activeSlide = this.#state.slides[this.#state.currentIndex];
            if (activeSlide) {
                this.#positionControls(activeSlide);
                // this.#updateCaptionWidth(activeSlide);
            }
        });

        // Show controls on mouse move, fade out after timeout
        this.addManagedListener(this, 'mousemove', () => this.#showControls());
        this.addManagedListener(this, 'mouseenter', () => this.#showControls());

        // Listen for gallery intro toggle to hide/show controls
        this.addManagedListener(document, 'gallery-intro-toggle', (event) => {
            this.#handleIntroToggle(event.detail.isOpen);
        });
        this.addManagedListener(document, 'ui-overlay-toggle', (event) => {
            const { source, isOpen } = event.detail || {};
            if (source === 'gallery-intro' || source === 'menu') {
                this.#handleIntroToggle(isOpen);
            }
        });

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

        // Click on slide to advance to next
        this.addManagedListener(this, 'click', (event) => {
            // Only handle clicks on slides/images, not controls
            const slide = event.target.closest('.dax-slide');
            if (slide && !event.target.closest('.dax-carousel-controls')) {
                this.#next();
                this.#showControls();
                // Stop autoplay on manual click
                if (this.#state.timer) {
                    this.#stop();
                }
            }
        });

        // Show controls initially
        this.#showControls();
    }

    #showControls() {
        this.classList.add('show-controls');

        // Clear existing timer
        if (this.#state.controlsTimer) {
            this.clearManagedTimeout(this.#state.controlsTimer);
        }

        // Set new timer to hide controls
        this.#state.controlsTimer = this.setManagedTimeout(() => {
            this.classList.remove('show-controls');
        }, CONTROLS_FADE_INTERVAL);
    }

    #handleIntroToggle(isOpen) {
        // Hide controls immediately (no transition) when intro opens
        if (isOpen) {
            this.classList.add('hide-controls');
            this.classList.remove('show-controls');
            if (this.#state.controlsTimer) {
                this.clearManagedTimeout(this.#state.controlsTimer);
                this.#state.controlsTimer = null;
            }
        } else {
            this.classList.remove('hide-controls');
            this.#showControls();
        }
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

    #next() {
        this.#setActive(this.#state.currentIndex + 1);
    }

    #prev() {
        this.#setActive(this.#state.currentIndex - 1);
    }

    #start() {
        if (this.#state.timer) return;
        this.#state.timer = this.setManagedInterval(
            () => this.#next(),
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
