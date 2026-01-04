import BaseComponent from '../base/base-component';
import styles from './dax-nav.scss';

// Auto-close delay in milliseconds - single canonical source for this value
const AUTO_CLOSE_DELAY_MS = 5000;

// Hover zone width as fraction of viewport (1/5 = 20%)
const HOVER_ZONE_FRACTION = 0.2;

const MENU_TEMPLATE = `
    <button class="dax-nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="dax-nav-menu">
        <span class="material-symbols-sharp" aria-hidden="true">menu</span>
    </button>
`;

const REF_SELECTORS = {
    toggle: '.dax-nav-toggle',
    menu: '.dax-nav-menu',
    projectList: '.dax-nav-projects',
};

class DaxNav extends BaseComponent(HTMLElement) {
    static styles = styles;

    static stylesId = 'dax-nav-styles';

    #refs = {};

    #isOpen = false;

    #autoCloseTimer = null;

    connectedCallback() {
        this.initStyles();
        this.#initDOM();
        this.#markCurrentPage();
        this.#attachEventListeners();
    }

    disconnectedCallback() {
        this.cleanup();
    }

    #initDOM() {
        // Find and enhance existing menu list
        const existingMenu = this.querySelector(':scope > ul');
        if (existingMenu) {
            existingMenu.classList.add('dax-nav-menu');
            existingMenu.id = 'dax-nav-menu';
            existingMenu.setAttribute('role', 'menubar');
        }

        // Find and enhance project list
        const projectList = this.querySelector('.dax-nav-projects, .project-list');
        if (projectList) {
            projectList.classList.add('dax-nav-projects');
            projectList.setAttribute('role', 'menu');
        }

        // Add menu items role
        this.querySelectorAll(':scope > ul > li').forEach((li) => {
            li.setAttribute('role', 'none');
            const link = li.querySelector(':scope > a');
            if (link) {
                link.setAttribute('role', 'menuitem');
            }
        });

        // Add project items role
        this.querySelectorAll('.dax-nav-projects > li').forEach((li) => {
            li.setAttribute('role', 'none');
            const link = li.querySelector('a');
            if (link) {
                link.setAttribute('role', 'menuitem');
            }
        });

        // Insert mobile toggle button
        const template = document.createElement('template');
        template.innerHTML = MENU_TEMPLATE;
        this.insertBefore(template.content.cloneNode(true), this.firstChild);

        this.#refs = {
            toggle: this.querySelector(REF_SELECTORS.toggle),
            menu: this.querySelector(REF_SELECTORS.menu),
            projectList: this.querySelector(REF_SELECTORS.projectList),
        };

        // Set initial closed state via attribute
        this.setAttribute('data-open', 'false');
    }

    #markCurrentPage() {
        const currentPath = window.location.pathname;

        // Remove any existing current markers
        this.querySelectorAll('.dax-nav-current').forEach((el) => {
            el.classList.remove('dax-nav-current');
            const link = el.querySelector('a');
            if (link) {
                link.removeAttribute('aria-current');
            }
        });

        // Find matching link and mark as current
        const links = this.querySelectorAll('a[href]');
        let matchedLink = null;
        let longestMatch = 0;

        links.forEach((link) => {
            const href = link.getAttribute('href');
            if (!href) return;

            // Resolve relative URLs
            const absoluteUrl = new URL(href, window.location.href);
            const linkPath = absoluteUrl.pathname;

            // Check if current path matches or starts with link path
            // Use longest match to handle nested routes
            if (currentPath === linkPath || currentPath.startsWith(linkPath.replace(/\/?$/, '/'))) {
                const matchLength = linkPath.length;
                if (matchLength > longestMatch) {
                    longestMatch = matchLength;
                    matchedLink = link;
                }
            }
        });

        if (matchedLink) {
            const parentLi = matchedLink.closest('li');
            if (parentLi) {
                parentLi.classList.add('dax-nav-current');
            }
            matchedLink.setAttribute('aria-current', 'page');
        }
    }

    #attachEventListeners() {
        const { toggle, menu } = this.#refs;

        // Toggle button click
        if (toggle) {
            this.addManagedListener(toggle, 'click', () => this.#toggleMenu());
        }

        // Close menu on escape
        this.addManagedListener(document, 'keydown', (event) => {
            if (event.key === 'Escape' && this.#isOpen) {
                this.#closeMenu();
                toggle?.focus();
            }
        });

        // Close menu on click outside
        this.addManagedListener(document, 'click', (event) => {
            if (this.#isOpen && !this.contains(event.target)) {
                this.#closeMenu();
            }
        });

        // Keyboard navigation within menu
        if (menu) {
            this.addManagedListener(menu, 'keydown', (event) => {
                this.#handleMenuKeyboard(event);
            });

            // Cancel auto-close timer on any interaction within menu
            this.addManagedListener(menu, 'mousemove', () => this.#clearAutoCloseTimer());
            this.addManagedListener(menu, 'focusin', () => this.#clearAutoCloseTimer());
        }

        // Dispatch overlay event when menu state changes
        this.addManagedListener(this, 'dax-nav-toggle', (event) => {
            document.dispatchEvent(new CustomEvent('ui-overlay-toggle', {
                detail: {
                    source: 'menu',
                    isOpen: event.detail.isOpen,
                },
            }));
        });

        // Auto-open when mouse enters left edge zone (1/5 of viewport width)
        this.addManagedListener(document, 'mousemove', (event) => {
            const hoverZoneWidth = window.innerWidth * HOVER_ZONE_FRACTION;
            if (event.clientX <= hoverZoneWidth && !this.#isOpen) {
                this.#openMenu();
            }
        });

        // Keep menu open while mouse is over the nav or its parent sidebar
        // Use closest aside as hover target if it exists, otherwise use self
        const hoverTarget = this.closest('aside') || this;

        // Cancel any auto-close timer when mouse enters nav area
        this.addManagedListener(hoverTarget, 'mouseenter', () => {
            this.#clearAutoCloseTimer();
        });

        // Start auto-close timer only when mouse leaves nav area
        this.addManagedListener(hoverTarget, 'mouseleave', () => {
            if (this.#isOpen) {
                this.#startAutoCloseTimer();
            }
        });
    }

    #toggleMenu() {
        if (this.#isOpen) {
            this.#closeMenu();
        } else {
            this.#openMenu();
        }
    }

    #openMenu() {
        const { toggle, menu } = this.#refs;
        this.#isOpen = true;

        // Set open state via attribute (CSS :has() will handle parent styling)
        this.setAttribute('data-open', 'true');

        if (toggle) {
            toggle.setAttribute('aria-expanded', 'true');
            toggle.setAttribute('aria-label', 'Close menu');
            const icon = toggle.querySelector('.material-symbols-sharp');
            if (icon) icon.textContent = 'close';
        }

        if (menu) {
            menu.setAttribute('aria-hidden', 'false');
            // Focus first menu item
            const firstLink = menu.querySelector('a');
            if (firstLink) {
                this.setManagedTimeout(() => firstLink.focus(), 100);
            }
        }

        this.dispatchEvent(new CustomEvent('dax-nav-toggle', {
            detail: { isOpen: true },
            bubbles: true,
        }));

        // Note: Auto-close timer is NOT started here.
        // Timer only starts when cursor leaves the nav area (mouseleave).
    }

    #closeMenu() {
        const { toggle, menu } = this.#refs;
        this.#isOpen = false;

        // Set closed state via attribute
        this.setAttribute('data-open', 'false');
        this.#clearAutoCloseTimer();

        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Open menu');
            const icon = toggle.querySelector('.material-symbols-sharp');
            if (icon) icon.textContent = 'menu';
        }

        if (menu) {
            menu.setAttribute('aria-hidden', 'true');
        }

        this.dispatchEvent(new CustomEvent('dax-nav-toggle', {
            detail: { isOpen: false },
            bubbles: true,
        }));
    }

    #startAutoCloseTimer() {
        this.#clearAutoCloseTimer();
        this.#autoCloseTimer = this.setManagedTimeout(() => {
            if (this.#isOpen) {
                this.#closeMenu();
            }
        }, AUTO_CLOSE_DELAY_MS);
    }

    #clearAutoCloseTimer() {
        if (this.#autoCloseTimer) {
            clearTimeout(this.#autoCloseTimer);
            this.#autoCloseTimer = null;
        }
    }

    #resetAutoCloseTimer() {
        if (this.#isOpen) {
            this.#startAutoCloseTimer();
        }
    }

    #handleMenuKeyboard(event) {
        const focusableItems = Array.from(this.querySelectorAll('a[href]'));
        const currentIndex = focusableItems.indexOf(document.activeElement);

        switch (event.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                event.preventDefault();
                if (currentIndex < focusableItems.length - 1) {
                    focusableItems[currentIndex + 1].focus();
                } else {
                    focusableItems[0].focus();
                }
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                event.preventDefault();
                if (currentIndex > 0) {
                    focusableItems[currentIndex - 1].focus();
                } else {
                    focusableItems[focusableItems.length - 1].focus();
                }
                break;
            case 'Home':
                event.preventDefault();
                focusableItems[0]?.focus();
                break;
            case 'End':
                event.preventDefault();
                focusableItems[focusableItems.length - 1]?.focus();
                break;
            default:
                break;
        }
    }
}

customElements.define('dax-nav', DaxNav);

export default DaxNav;
