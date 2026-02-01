import BaseComponent from '../base/base-component';
// CSS is pre-compiled by build:css to lib/components/dax-sidebar/dax-sidebar.css
import styles from '../../../lib/components/dax-sidebar/dax-sidebar.css';

const NAV_AUTO_CLOSE_DELAY_MS = 5000;

const TEMPLATE = `
<aside class="dax-sidebar" id="sidebar" role="navigation" aria-label="Main navigation">
    <header class="dax-sidebar-header">
        <button class="dax-sidebar-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="dax-nav-menu">
            <span class="material-symbols-sharp" aria-hidden="true">menu</span>
        </button>
        <h1 class="masthead"><a href="/" id="home-link">Barbara Beirne</a></h1>
    </header>
    <slot></slot>
</aside>
<div class="dax-sidebar-backdrop" aria-hidden="true"></div>
`;

class DaxSidebar extends BaseComponent(HTMLElement) {
    static styles = styles;

    static stylesId = 'dax-sidebar-styles';

    #isMenuOpen = false;

    #refs = {};

    #lastFocusedElement = null;

    #wasModalOpen = false;

    #inertTargets = new Map();

    #scrollState = { body: '', html: '' };

    #isScrollLocked = false;

    #autoCloseTimerId = null;

    static get observedAttributes() {
        return ['home-link'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'home-link' && oldValue !== newValue) {
            this.#updateHomeLink();
        }
    }

    connectedCallback() {
        this.#render();
        this.#updateHomeLink();
        this.#initMenuState();
        this.#initTouchGestures();
        this.#attachEventListeners();
        this.addManagedListener(window, 'resize', () => this.#applyModalState());
        this.#initCarouselListener();
    }

    disconnectedCallback() {
        this.#clearAutoCloseTimer();
        this.cleanup();
    }

    #render() {
        if (!this.shadowRoot) {
            if (this.initShadow) {
                const template = document.createElement('template');
                // Inject styles directly into Shadow DOM
                template.innerHTML = `<style>${DaxSidebar.styles}</style>${TEMPLATE}`;
                this.initShadow(template);
            } else {
                // Fallback if initShadow is not available (e.g. if BaseComponent mixin issue)
                this.attachShadow({ mode: 'open' });
                const template = document.createElement('template');
                template.innerHTML = `<style>${DaxSidebar.styles}</style>${TEMPLATE}`;
                this.shadowRoot.appendChild(template.content.cloneNode(true));
            }
        } else if (!this.shadowRoot.querySelector('aside')) {
            // Shadow root exists but content might be missing
            const template = document.createElement('template');
            template.innerHTML = `<style>${DaxSidebar.styles}</style>${TEMPLATE}`;
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        this.#refs = {
            container: this.shadowRoot.querySelector('.dax-sidebar'),
            toggle: this.shadowRoot.querySelector('.dax-sidebar-toggle'),
            nav: this.querySelector('dax-nav'),
            backdrop: this.shadowRoot.querySelector('.dax-sidebar-backdrop'),
        };
    }

    #updateHomeLink() {
        const link = this.getAttribute('home-link') || '/';
        const anchor = this.shadowRoot?.querySelector('#home-link');
        if (anchor) {
            anchor.setAttribute('href', link);
        }
    }

    #getNavBreakpoint() {
        const value = getComputedStyle(this)
            .getPropertyValue('--dax-sidebar-breakpoint-nav')
            .trim();
        const parsed = Number.parseFloat(value);

        return Number.isNaN(parsed) ? 0 : parsed;
    }

    #isDesktopView() {
        return window.innerWidth > this.#getNavBreakpoint();
    }

    #initMenuState() {
        const nav = this.#getNavElement();
        const navState = nav?.getAttribute('data-open');
        const hasExplicitState = navState === 'true' || navState === 'false';
        const isDesktop = this.#isDesktopView();

        this.#isMenuOpen = hasExplicitState ? navState === 'true' : isDesktop;
        this.#applyMenuState();
        this.#emitMenuToggle(false);
    }

    #getNavElement() {
        if (!this.#refs.nav) {
            this.#refs.nav = this.querySelector('dax-nav');
        }

        return this.#refs.nav;
    }

    #applyMenuState() {
        const { toggle } = this.#refs;
        const nav = this.#getNavElement();
        const isOpen = this.#isMenuOpen;

        this.setAttribute('data-nav-open', isOpen ? 'true' : 'false');

        if (nav) {
            nav.setAttribute('data-open', isOpen ? 'true' : 'false');
            if (isOpen) {
                nav.removeAttribute('aria-hidden');
            } else {
                nav.setAttribute('aria-hidden', 'true');
            }
        }

        if (toggle) {
            toggle.setAttribute('aria-expanded', String(isOpen));
            toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
            const icon = toggle.querySelector('.material-symbols-sharp');
            if (icon) icon.textContent = isOpen ? 'close' : 'menu';
        }

        this.#applyModalState();
    }

    #emitMenuToggle(emitOverlay = true, source = 'menu') {
        const isOpen = this.#isMenuOpen;

        this.dispatchEvent(new CustomEvent('dax-nav-toggle', {
            detail: { isOpen, source },
            bubbles: true,
            composed: true,
        }));

        if (emitOverlay) {
            this.dispatchEvent(new CustomEvent('ui-overlay-toggle', {
                detail: { source: 'menu', isOpen },
                bubbles: true,
                composed: true,
            }));
        }
    }

    #setMenuOpen(isOpen, emitEvent = true, source = 'menu') {
        if (this.#isMenuOpen === isOpen) {
            return;
        }

        this.#isMenuOpen = isOpen;
        this.#applyMenuState();

        if (emitEvent) {
            this.#emitMenuToggle(true, source);
        }
    }

    #attachEventListeners() {
        const { toggle, backdrop } = this.#refs;

        if (toggle) {
            this.addManagedListener(toggle, 'click', () => this.#toggleMenu());
        }

        if (backdrop) {
            this.addManagedListener(backdrop, 'click', () => this.#closeMenu());
        }

        this.addManagedListener(document, 'keydown', (event) => {
            if (event.key === 'Escape' && this.#isMenuOpen) {
                this.#closeMenu();
                toggle?.focus();
            } else if (event.key === 'Tab') {
                this.#handleTabKey(event);
            }
        });
    }

    #handleTabKey(event) {
        // Only trap on mobile when menu is open
        if (!this.#isMenuOpen || this.#isDesktopView()) return;

        const focusableElements = this.#getFocusableElements();

        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        const currentFocus = this.shadowRoot.activeElement || document.activeElement;

        if (event.shiftKey && currentFocus === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && currentFocus === last) {
            event.preventDefault();
            first.focus();
        }
    }

    #getFocusableElements() {
        const shadowFocusable = Array.from(this.shadowRoot.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ));
        const lightFocusable = Array.from(this.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ));
        return [...shadowFocusable, ...lightFocusable];
    }

    #applyModalState() {
        const isModalOpen = this.#isMenuOpen && !this.#isDesktopView();

        this.#setInertState(isModalOpen);
        this.#setScrollLock(isModalOpen);

        if (isModalOpen && !this.#wasModalOpen) {
            this.#captureLastFocus();
            this.#focusFirstElement();
        } else if (!isModalOpen && this.#wasModalOpen) {
            this.#restoreFocus();
        }

        this.#wasModalOpen = isModalOpen;
    }

    #captureLastFocus() {
        const activeElement = this.shadowRoot.activeElement || document.activeElement;
        this.#lastFocusedElement = activeElement instanceof HTMLElement ? activeElement : null;
    }

    #focusFirstElement() {
        const { toggle } = this.#refs;
        const focusableElements = this.#getFocusableElements();
        const focusTarget = focusableElements.find((element) => element !== toggle)
            || focusableElements[0];
        focusTarget?.focus();
    }

    #restoreFocus() {
        const { toggle } = this.#refs;
        const hasLastFocus = this.#lastFocusedElement
            && document.contains(this.#lastFocusedElement);
        const focusTarget = hasLastFocus ? this.#lastFocusedElement : toggle;

        focusTarget?.focus();
        this.#lastFocusedElement = null;
    }

    #getInertTargets() {
        const parent = this.parentElement || document.body;
        return Array.from(parent.children).filter((child) => child !== this);
    }

    #setInertState(shouldInert) {
        if (shouldInert && this.#inertTargets.size === 0) {
            this.#getInertTargets().forEach((element) => {
                this.#inertTargets.set(element, element.getAttribute('aria-hidden'));
            });
        }

        this.#inertTargets.forEach((previousAriaHidden, element) => {
            const target = element;
            if (shouldInert) {
                target.setAttribute('aria-hidden', 'true');
                target.inert = true;
                target.setAttribute('inert', '');
            } else {
                if (previousAriaHidden === null) {
                    target.removeAttribute('aria-hidden');
                } else {
                    target.setAttribute('aria-hidden', previousAriaHidden);
                }
                target.inert = false;
                target.removeAttribute('inert');
            }
        });

        if (!shouldInert) {
            this.#inertTargets.clear();
        }
    }

    #setScrollLock(shouldLock) {
        if (shouldLock) {
            if (this.#isScrollLocked) return;
            this.#scrollState = {
                html: document.documentElement.style.overflow,
                body: document.body.style.overflow,
            };
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            this.#isScrollLocked = true;
            return;
        }

        if (!this.#isScrollLocked) return;
        document.documentElement.style.overflow = this.#scrollState.html;
        document.body.style.overflow = this.#scrollState.body;
        this.#scrollState = { body: '', html: '' };
        this.#isScrollLocked = false;
    }

    #initTouchGestures() {
        let startX = 0;
        let startY = 0;
        const SWIPE_THRESHOLD = 50;
        const EDGE_ZONE = 30; // pixels from left edge

        this.addManagedListener(document, 'touchstart', (e) => {
            if (e.touches.length > 1) return;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        this.addManagedListener(document, 'touchend', (e) => {
            if (e.changedTouches.length > 1) return;
            const deltaX = e.changedTouches[0].clientX - startX;
            const deltaY = e.changedTouches[0].clientY - startY;

            // Ignore vertical swipes
            if (Math.abs(deltaY) > Math.abs(deltaX)) return;

            const isLeftEdge = startX < EDGE_ZONE;

            // Swipe right from left edge -> open
            if (isLeftEdge && deltaX > SWIPE_THRESHOLD && !this.#isMenuOpen) {
                this.#openMenu();
            } else if (deltaX < -SWIPE_THRESHOLD && this.#isMenuOpen) {
                // Swipe left anywhere -> close (when open)
                this.#closeMenu();
            }
        }, { passive: true });
    }

    #toggleMenu() {
        this.#setMenuOpen(!this.#isMenuOpen);
    }

    #openMenu() {
        this.#setMenuOpen(true);
    }

    #closeMenu() {
        this.#setMenuOpen(false);
    }

    #closeNavOnly() {
        // Close nav quietly using standard state management but suppressing events
        // This ensures toggle button and host attributes remain in sync
        this.#setMenuOpen(false, false);
    }

    #isGalleryPage() {
        // Gallery pages have a <main data-gallery-context> element
        return document.querySelector('main[data-gallery-context]') !== null;
    }

    #initAutoCloseTimer() {
        // Only auto-close dax-nav on gallery pages
        if (!this.#isGalleryPage()) {
            return;
        }

        this.#clearAutoCloseTimer();
        this.#autoCloseTimerId = setTimeout(() => {
            if (this.#isMenuOpen) {
                this.#closeNavOnly();
            }
        }, NAV_AUTO_CLOSE_DELAY_MS);
    }

    #clearAutoCloseTimer() {
        if (this.#autoCloseTimerId !== null) {
            clearTimeout(this.#autoCloseTimerId);
            this.#autoCloseTimerId = null;
        }
    }

    #initCarouselListener() {
        // Close nav after inactivity when carousel auto-play starts (only on gallery pages)
        if (!this.#isGalleryPage()) {
            return;
        }

        const startInactivityTimer = () => {
            // Only start timer if sidebar is open and no timer is already running
            if (this.#isMenuOpen && this.#autoCloseTimerId === null) {
                this.#autoCloseTimerId = setTimeout(() => {
                    if (this.#isMenuOpen) {
                        this.#closeNavOnly();
                    }
                    this.#autoCloseTimerId = null;
                }, NAV_AUTO_CLOSE_DELAY_MS);
            }
        };

        // Start timer when autoplay is activated by user
        this.addManagedListener(document, 'dax-carousel-autoplay-start', startInactivityTimer);

        // Also start timer on slide advance (for when autoplay was already running)
        this.addManagedListener(document, 'dax-carousel-advance', startInactivityTimer);
    }
}

customElements.define('dax-sidebar', DaxSidebar);

export default DaxSidebar;
