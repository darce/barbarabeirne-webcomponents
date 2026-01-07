import BaseComponent from '../base/base-component';
import styles from './gallery-intro-toggle.scss';

/**
 * Gallery intro toggle button.
 * Standard pattern: placed inside <aside> after </dax-nav>,
 * controls .gallery-intro inside <main data-gallery-context>.
 *
 * Visibility is controlled by dax-nav events - this component
 * shows/hides in sync with the nav menu's open/close state.
 */
class GalleryIntroToggle extends BaseComponent(HTMLElement) {
    static styles = styles;

    static stylesId = 'gallery-intro-toggle-styles';

    // Private state
    #state = {
        isOpen: false,
        isVisible: false,
        galleryContainer: null,
    };

    // Lifecycle methods
    connectedCallback() {
        this.initStyles();
        this.#initButton();
        this.#attachEventListeners();

        // Sync initial visibility with dax-nav state (handles case where
        // dax-nav opened before this component connected to DOM)
        const daxNav = document.querySelector('dax-nav');
        if (daxNav?.getAttribute('data-open') === 'true') {
            this.#setVisible(true);
        }
    }

    disconnectedCallback() {
        this.cleanup();
    }

    // Private methods
    #initButton() {
        // Standard pattern: toggle in <aside>, gallery in <main data-gallery-context>
        this.#state.galleryContainer = document.querySelector('[data-gallery-context]');
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

        // Sync visibility with dax-nav open/close state
        this.addManagedListener(document, 'dax-nav-toggle', (event) => {
            this.#setVisible(event.detail.isOpen);
        });
    }

    #setVisible(visible) {
        this.#state.isVisible = visible;
        this.classList.toggle('is-visible', visible);
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
    }
}

customElements.define('gallery-intro-toggle', GalleryIntroToggle);

export default GalleryIntroToggle;
