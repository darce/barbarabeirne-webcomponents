/**
 * BaseComponent mixin - provides common functionality for web components.
 *
 * Public API (for subclasses):
 *   Styles:     initStyles (reads static styles/stylesId)
 *   DOM:        initShadow
 *   Attributes: getNumberAttr, getBooleanAttr
 *   Events:     addManagedListener
 *   Timers:     setManagedInterval, clearManagedInterval, setManagedTimeout, clearManagedTimeout
 *   Cleanup:    cleanup (call in disconnectedCallback)
 */
const BaseComponent = (Base = HTMLElement) => class extends Base {
    // Private fields
    #listeners = [];

    #timers = { intervals: [], timeouts: [] };

    // ─────────────────────────────────────────────────────────────
    // Styles (Public API)
    // ─────────────────────────────────────────────────────────────

    /**
     * Inject component styles into document head.
     * Reads styles from static `styles` and `stylesId` properties.
     * Only injects once per unique ID.
     */
    initStyles() {
        const { styles, stylesId } = this.constructor;
        if (!styles || !stylesId) return;
        if (document.getElementById(stylesId)) return;
        const styleEl = document.createElement('style');
        styleEl.id = stylesId;
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
    }

    // ─────────────────────────────────────────────────────────────
    // DOM Initialization (Public API)
    // ─────────────────────────────────────────────────────────────

    initShadow(template, mode = 'open') {
        const shadow = this.attachShadow({ mode });
        shadow.appendChild(template.content.cloneNode(true));
        return shadow;
    }

    // ─────────────────────────────────────────────────────────────
    // Attribute Helpers (Public API)
    // ─────────────────────────────────────────────────────────────

    getNumberAttr(name, defaultValue = 0) {
        const value = this.getAttribute(name);
        return value !== null ? Number(value) : defaultValue;
    }

    getBooleanAttr(name) {
        return this.hasAttribute(name);
    }

    // ─────────────────────────────────────────────────────────────
    // Event Listener Management (Public API + Private cleanup)
    // ─────────────────────────────────────────────────────────────

    addManagedListener(target, event, handler, options) {
        target.addEventListener(event, handler, options);
        this.#listeners.push({
            target,
            event,
            handler,
            options,
        });
    }

    #removeAllListeners() {
        this.#listeners.forEach(({
            target,
            event,
            handler,
            options,
        }) => {
            target.removeEventListener(event, handler, options);
        });
        this.#listeners = [];
    }

    // ─────────────────────────────────────────────────────────────
    // Timer Management (Public API + Private cleanup)
    // ─────────────────────────────────────────────────────────────

    setManagedInterval(callback, delay) {
        const id = setInterval(callback, delay);
        this.#timers.intervals.push(id);
        return id;
    }

    clearManagedInterval(id) {
        clearInterval(id);
        this.#timers.intervals = this.#timers.intervals.filter((i) => i !== id);
    }

    setManagedTimeout(callback, delay) {
        const id = setTimeout(callback, delay);
        this.#timers.timeouts.push(id);
        return id;
    }

    clearManagedTimeout(id) {
        clearTimeout(id);
        this.#timers.timeouts = this.#timers.timeouts.filter((i) => i !== id);
    }

    #clearAllTimers() {
        this.#timers.intervals.forEach((id) => clearInterval(id));
        this.#timers.timeouts.forEach((id) => clearTimeout(id));
        this.#timers = { intervals: [], timeouts: [] };
    }

    // ─────────────────────────────────────────────────────────────
    // Cleanup (Public API - call in disconnectedCallback)
    // ─────────────────────────────────────────────────────────────

    cleanup() {
        this.#removeAllListeners();
        this.#clearAllTimers();
    }
};

export default BaseComponent;
