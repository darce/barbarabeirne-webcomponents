import BaseComponent from '../base/base-component';
import styles from './dax-carousel.scss';

const DEFAULT_INTERVAL = 5000;
const CONTROLS_FADE_INTERVAL = 2500;

const CONTROLS_TEMPLATE = `
    <div class="dax-carousel-buttons">
        <button class="dax-prev" type="button" aria-label="Previous slide">
            <span class="material-symbols-sharp">skip_previous</span>
        </button>
        <button class="dax-play-pause" type="button" aria-label="Stop slideshow">
            <span class="material-symbols-sharp">stop</span>
        </button>
    </div>
    <div class="dax-image-counter" aria-live="polite"></div>
`;

const REF_SELECTORS = {
    prevButton: '.dax-prev',
    playPauseButton: '.dax-play-pause',
    dotsContainer: '.dax-carousel-dots',
    imageCounter: '.dax-image-counter',
};

class DaxCarousel extends BaseComponent(HTMLElement) {
    static observedAttributes = ['interval', 'autoplay'];

    static styles = styles;

    static stylesId = 'dax-carousel-styles';

    // Private state
    #state = {
        intervalMs: DEFAULT_INTERVAL,
        autoplay: true,
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
    }

    connectedCallback() {
        this.initStyles();
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
            dotsContainer,
            imageCounter: this.querySelector(REF_SELECTORS.imageCounter),
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
        this.#setActive(this.#state.currentIndex);
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
            this.#positionDots(nextSlide);
        }

        // Update dots
        const dots = Array.from(this.#refs.dotsContainer.children);
        dots[currentIndex]?.classList.remove('active');
        dots[nextIndex]?.classList.add('active');

        // Update image counter
        if (this.#refs.imageCounter) {
            this.#refs.imageCounter.textContent = `${nextIndex + 1} / ${slides.length}`;
        }

        this.#state.currentIndex = nextIndex;
    }

    #positionDots(slide) {
        const img = slide.querySelector('img');
        if (!img || !this.#refs.dotsContainer) return;

        // Position dots at the bottom of the image
        const updatePosition = () => {
            const imgRect = img.getBoundingClientRect();
            const carouselRect = this.getBoundingClientRect();
            const topOffset = imgRect.bottom - carouselRect.top;
            this.#refs.dotsContainer.style.top = `${topOffset}px`;
        };

        // Update immediately and after image loads
        if (img.complete) {
            updatePosition();
        } else {
            img.addEventListener('load', updatePosition, { once: true });
        }
    }

    #attachEventListeners() {
        const { prevButton, playPauseButton } = this.#refs;

        this.addManagedListener(prevButton, 'click', () => {
            this.#prev();
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

        // Reposition dots on window resize
        this.addManagedListener(window, 'resize', () => {
            const activeSlide = this.#state.slides[this.#state.currentIndex];
            if (activeSlide) {
                this.#positionDots(activeSlide);
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
