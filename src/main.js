const initMenuToggle = () => {
    const button = document.querySelector('.js-menu-toggle');
    const menu = document.querySelector('.js-menu');
    if (!button || !menu) return;

    menu.classList.remove('active');
    button.setAttribute('aria-expanded', 'false');

    button.addEventListener('click', () => {
        const isExpanded = menu.classList.toggle('active');
        button.setAttribute('aria-expanded', String(isExpanded));

        document.dispatchEvent(new CustomEvent('ui-overlay-toggle', {
            bubbles: true,
            detail: { source: 'menu', isOpen: isExpanded },
        }));
    });
};

const initGalleryIntroToggle = () => {
    const galleryContainers = document.querySelectorAll('.js-gallery-container');
    if (!galleryContainers.length) return;

    galleryContainers.forEach((galleryContainer) => {
        const toggle = galleryContainer.querySelector('.toggle-gallery-intro');
        if (!toggle) return;

        toggle.addEventListener('click', () => {
            const isOpen = galleryContainer.classList.toggle('is-intro-open');
            toggle.setAttribute('aria-expanded', String(isOpen));
            toggle.textContent = isOpen ? 'Close' : 'Intro';
        });
    });
};

initMenuToggle();
initGalleryIntroToggle();
