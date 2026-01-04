import './main';

const componentLoaders = [
    {
        tag: 'dax-carousel',
        loader: (baseUrl) => import(new URL('./components/dax-carousel/dax-carousel.js', baseUrl).href),
    },
    {
        tag: 'gallery-intro-toggle',
        loader: (baseUrl) => import(new URL('./components/gallery-intro-toggle/gallery-intro-toggle.js', baseUrl).href),
    },
    {
        tag: 'dax-nav',
        loader: (baseUrl) => import(new URL('./components/dax-nav/dax-nav.js', baseUrl).href),
    },
];

const getScriptBaseUrl = () => {
    const currentScript = document.currentScript
        || document.querySelector('script[src$="lib/init.js"]')
        || document.querySelector('script[src*="/lib/init.js"]');

    const scriptUrl = currentScript?.src
        ? new URL(currentScript.src, window.location.href)
        : new URL(window.location.href);

    return new URL('./', scriptUrl);
};

const loadComponents = () => {
    const baseUrl = getScriptBaseUrl();
    // eslint-disable-next-line no-console
    console.log('[init.js] loadComponents called, baseUrl:', baseUrl.href);

    componentLoaders.forEach(({ tag, loader }) => {
        const needsComponent = document.querySelector(tag) && !customElements.get(tag);
        // eslint-disable-next-line no-console
        console.log(`[init.js] ${tag}: needsComponent=${needsComponent}`);
        if (!needsComponent) return;

        loader(baseUrl).catch((error) => {
            // Log failures instead of throwing to avoid blocking other components.
            // eslint-disable-next-line no-console
            console.error(`Failed to load ${tag}`, error);
        });
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents, { once: true });
} else {
    loadComponents();
}
