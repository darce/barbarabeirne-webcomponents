import BaseComponent from '../base/base-component';
// CSS is pre-compiled by build:css to .build/css/dax-nav/dax-nav.css
import styles from '../../../.build/css/dax-nav/dax-nav.css';

class DaxNav extends BaseComponent(HTMLElement) {
    static styles = styles;

    static stylesId = 'dax-nav-styles';

    connectedCallback() {
        this.initStyles();
        this.#initDOM();
        this.#markCurrentPage();
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
        }

        // Find and enhance project list
        const projectList = this.querySelector('.dax-nav-projects, .project-list');
        if (projectList) {
            projectList.classList.add('dax-nav-projects');

            // "Projects" link: set flag so menu stays open on the destination page
            const projectsParentLi = projectList.closest('li');
            const projectsLink = projectsParentLi?.querySelector(':scope > a');
            if (projectsLink) {
                this.addManagedListener(projectsLink, 'click', () => {
                    sessionStorage.setItem('dax-nav-keep-open', 'true');
                });
            }

            // Individual project links: clear flag so menu closes on destination
            projectList.querySelectorAll('a[href]').forEach((link) => {
                this.addManagedListener(link, 'click', () => {
                    sessionStorage.removeItem('dax-nav-keep-open');
                });
            });
        }

        this.querySelectorAll('.dax-nav-menu a[href], .dax-nav-projects a[href]').forEach((link) => {
            if (!link.hasAttribute('tabindex')) {
                link.setAttribute('tabindex', '0');
            }
        });
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
}

customElements.define('dax-nav', DaxNav);

export default DaxNav;
