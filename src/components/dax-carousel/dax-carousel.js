import BaseComponent from '../base/base-component';
import styles from './dax-carousel.scss';

const DEFAULT_INTERVAL = 5000;
const CONTROLS_FADE_INTERVAL = 2500;

const CONTROLS_TEMPLATE = `
    <div class="dax-carousel-controls">
        <button class="dax-prev" type="button" aria-label="Previous slide">
            <span class="material-symbols-sharp">skip_previous</span>
        </button>

        <button class="dax-play-pause" type="button" aria-label="Stop slideshow">
            <span class="material-symbols-sharp">stop</span>
        </button>

        <button class="dax-next" type="button" aria-label="Next slide">
            <span class="material-symbols-sharp">skip_next</span>
        </button>
    </div>
`;

const REF_SELECTORS = {
    prevButton: '.dax-prev',
    nextButton: '.dax-next',
    playPauseButton: '.dax-play-pause',
    buttonsContainer: '.dax-carousel-controls',
    dotsContainer: '.dax-carousel-dots',
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
        this.appendChild(template.content.cloneNode(true));

        // Create and append dots container to carousel (not inside slides)
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'dax-carousel-dots';
        dotsContainer.setAttribute('role', 'tablist');
        dotsContainer.setAttribute('aria-label', 'Slide navigation');
        this.appendChild(dotsContainer);

        this.#refs = {
            prevButton: this.querySelector(REF_SELECTORS.prevButton),
            nextButton: this.querySelector(REF_SELECTORS.nextButton),
            playPauseButton: this.querySelector(REF_SELECTORS.playPauseButton),
            buttonsContainer: this.querySelector(REF_SELECTORS.buttonsContainer),
            dotsContainer,
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
        const hash = window.location.hash;
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
                history.replaceState(null, '', hash);
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
        }

        // Update dots
        const dots = Array.from(this.#refs.dotsContainer.children);
        dots[currentIndex]?.classList.remove('active');
        dots[nextIndex]?.classList.add('active');

        this.#state.currentIndex = nextIndex;
    }

    #positionControls(slide) {
        const img = slide.querySelector('img');
        if (!img) return;

        const { dotsContainer, buttonsContainer } = this.#refs;

        // Position dots at bottom of image, buttons at 50% of image height
        const updatePosition = () => {
            const imgRect = img.getBoundingClientRect();
            const carouselRect = this.getBoundingClientRect();
            const imgTop = imgRect.top - carouselRect.top;
            const imgHeight = imgRect.height;

            // Dots at bottom of image
            if (dotsContainer) {
                dotsContainer.style.top = `${imgTop + imgHeight}px`;
            }

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

    #handleAttributeChange(name, newValue) {
        if (name === 'interval') {
            const newInterval = Number(newValue) || DEFAULT_INTERVAL;
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
