import BaseComponent from '../base/base-component';
// CSS is pre-compiled by build:css to .build/css/gallery-intro-toggle/gallery-intro-toggle.css
import styles from '../../../.build/css/gallery-intro-toggle/gallery-intro-toggle.css';

/**
 * Gallery intro toggle button.
 * Standard pattern: placed inside a gallery header within <main data-gallery-context>,
 * controls .gallery-intro inside the same gallery context.
 *
 * Visibility is controlled by the gallery intro open state.
 */
class GalleryIntroToggle extends BaseComponent(HTMLElement) {
    static styles = styles;

    static stylesId = 'gallery-intro-toggle-styles';

    // Private state
    #state = {
        isOpen: false,
        galleryContainer: null,
        introSection: null,
    };

    // Lifecycle methods
    connectedCallback() {
        this.initStyles();
        this.#initButton();
        this.#attachEventListeners();
    }

    disconnectedCallback() {
        this.cleanup();
    }

    // Private methods
    #initButton() {
        // Standard pattern: toggle in <main data-gallery-context>, gallery in the same context
        const galleryContainer = document.querySelector('[data-gallery-context]');
        const introSection = galleryContainer?.querySelector('.gallery-intro');
        const isOpen = Boolean(galleryContainer?.classList.contains('is-intro-open'));

        this.#state.galleryContainer = galleryContainer;
        this.#state.introSection = introSection;
        this.#state.isOpen = isOpen;

        if (introSection) {
            introSection.setAttribute('aria-hidden', String(!isOpen));
        }

        this.setAttribute('role', 'button');
        this.setAttribute('tabindex', '0');
        this.setAttribute('aria-expanded', String(isOpen));
        this.textContent = isOpen ? 'Close' : 'Intro';
    }

    #attachEventListeners() {
        this.addManagedListener(this, 'click', () => this.#toggle());
        this.addManagedListener(this, 'keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.#toggle();
            }
        });
    }

    #setOpen(isOpen) {
        if (this.#state.isOpen === isOpen) return;

        const { galleryContainer, introSection } = this.#state;
        this.#state.isOpen = isOpen;

        galleryContainer?.classList.toggle('is-intro-open', isOpen);
        this.setAttribute('aria-expanded', String(isOpen));
        this.textContent = isOpen ? 'Close' : 'Intro';

        if (introSection) {
            introSection.setAttribute('aria-hidden', String(!isOpen));
        }
    }

    #toggle() {
        this.#setOpen(!this.#state.isOpen);
    }
}

customElements.define('gallery-intro-toggle', GalleryIntroToggle);

export default GalleryIntroToggle;
