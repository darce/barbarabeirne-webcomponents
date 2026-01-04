import BaseComponent from '../base/base-component';
import styles from './gallery-intro-toggle.scss';

const CONTROLS_FADE_INTERVAL = 2500;

class GalleryIntroToggle extends BaseComponent(HTMLElement) {
    static styles = styles;

    static stylesId = 'gallery-intro-toggle-styles';

    // Private state
    #state = {
        isOpen: false,
        controlsTimer: null,
        galleryContainer: null,
    };

    // Lifecycle methods
    connectedCallback() {
        this.initStyles();
        this.#initButton();
        this.#attachEventListeners();
        this.#showControls();
    }

    disconnectedCallback() {
        this.cleanup();
    }

    // Private methods
    #initButton() {
        // Look for gallery context using data attribute, then fall back to semantic <main>
        this.#state.galleryContainer = this.closest('[data-gallery-context]') || this.closest('main');
        this.setAttribute('role', 'button');
        this.setAttribute('tabindex', '0');
        this.setAttribute('aria-expanded', 'false');
        this.textContent = 'Intro';
    }

    #attachEventListeners() {
        this.addManagedListener(this, 'click', () => this.#toggle());
        this.addManagedListener(this, 'keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.#toggle();
            }
        });

        // Show controls on mouse move within gallery container
        const { galleryContainer } = this.#state;
        if (galleryContainer) {
            this.addManagedListener(galleryContainer, 'mousemove', () => this.#showControls());
            this.addManagedListener(galleryContainer, 'mouseenter', () => this.#showControls());
        }
    }

    #toggle() {
        const { galleryContainer } = this.#state;
        this.#state.isOpen = !this.#state.isOpen;

        galleryContainer?.classList.toggle('is-intro-open', this.#state.isOpen);
        this.setAttribute('aria-expanded', String(this.#state.isOpen));
        this.textContent = this.#state.isOpen ? 'Close' : 'Intro';

        // Dispatch event for other components to react
        this.dispatchEvent(new CustomEvent('ui-overlay-toggle', {
            bubbles: true,
            detail: { source: 'gallery-intro', isOpen: this.#state.isOpen },
        }));
        this.dispatchEvent(new CustomEvent('gallery-intro-toggle', {
            bubbles: true,
            detail: { isOpen: this.#state.isOpen },
        }));

        // Keep controls visible while intro is open
        if (this.#state.isOpen) {
            this.classList.add('show-controls');
            if (this.#state.controlsTimer) {
                this.clearManagedTimeout(this.#state.controlsTimer);
                this.#state.controlsTimer = null;
            }
        } else {
            this.#showControls();
        }
    }

    #showControls() {
        // Don't fade out if intro is open
        if (this.#state.isOpen) return;

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
}

customElements.define('gallery-intro-toggle', GalleryIntroToggle);

export default GalleryIntroToggle;
