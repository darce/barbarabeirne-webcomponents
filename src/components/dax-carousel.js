const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: block;
      --dax-control-size: 42px;
      --dax-gap: 12px;
      --dax-bg: rgba(0, 0, 0, 0.65);
      --dax-fg: #fff;
      position: relative;
    }

    .carousel {
      position: relative;
      overflow: hidden;
    }

    .viewport {
      width: 100%;
      display: block;
    }

    ::slotted(*) {
      display: none;
      width: 100%;
      margin: 0;
      box-sizing: border-box;
    }

    ::slotted(img),
    ::slotted(figure) {
      max-width: 100%;
    }

    ::slotted(.dax-active) {
      display: block;
    }

    .controls {
      position: absolute;
      inset: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      pointer-events: none;
    }

    button {
      pointer-events: auto;
      width: var(--dax-control-size);
      height: var(--dax-control-size);
      border-radius: 50%;
      border: 1px solid var(--dax-fg);
      background: var(--dax-bg);
      color: var(--dax-fg);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s ease, background 0.2s ease;
    }

    button:hover {
      background: rgba(0, 0, 0, 0.8);
    }

    .dots {
      position: absolute;
      left: 50%;
      bottom: var(--dax-gap);
      transform: translateX(-50%);
      display: flex;
      gap: var(--dax-gap);
      pointer-events: none;
    }

    .dot {
      pointer-events: auto;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.7);
      cursor: pointer;
      transition: transform 0.2s ease, background 0.2s ease;
    }

    .dot.active {
      background: var(--dax-fg);
      transform: scale(1.15);
    }

    .play-pause {
      position: absolute;
      right: var(--dax-gap);
      bottom: var(--dax-gap);
      width: auto;
      padding: 0 12px;
      border-radius: 20px;
    }
  </style>
  <div class="carousel">
    <div class="viewport">
      <slot></slot>
    </div>
    <div class="controls" aria-hidden="true">
      <button class="prev" type="button" aria-label="Previous slide">‹</button>
      <button class="next" type="button" aria-label="Next slide">›</button>
    </div>
    <div class="dots" role="tablist" aria-label="Slide navigation"></div>
    <button class="play-pause" type="button" aria-label="Pause slideshow">Pause</button>
  </div>
`;

const stateMap = new WeakMap();
const refsMap = new WeakMap();

const setState = (host, updates) => {
    const state = stateMap.get(host);
    if (!state) return;
    Object.assign(state, updates);
};

const getState = (host) => stateMap.get(host);
const getRefs = (host) => refsMap.get(host);

const setActive = (host, index) => {
    const state = getState(host);
    const refs = getRefs(host);
    if (!state || !refs) return;
    if (!state.slides.length) return;

    const nextIndex = (index + state.slides.length) % state.slides.length;
    state.slides[state.currentIndex]?.classList.remove('dax-active');
    state.slides[state.currentIndex]?.setAttribute('aria-hidden', 'true');
    state.slides[state.currentIndex] && (state.slides[state.currentIndex].style.display = 'none');

    state.slides[nextIndex]?.classList.add('dax-active');
    state.slides[nextIndex]?.setAttribute('aria-hidden', 'false');
    state.slides[nextIndex] && (state.slides[nextIndex].style.display = 'block');

    const dots = Array.from(refs.dotsContainer.children);
    dots[state.currentIndex]?.classList.remove('active');
    dots[nextIndex]?.classList.add('active');

    state.currentIndex = nextIndex;
};

const buildDots = (host) => {
    const state = getState(host);
    const refs = getRefs(host);
    if (!state || !refs) return;

    refs.dotsContainer.innerHTML = '';
    state.slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'dot';
        dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
        dot.setAttribute('role', 'tab');
        dot.addEventListener('click', () => setActive(host, idx));
        refs.dotsContainer.appendChild(dot);
    });
};

const refreshSlides = (host) => {
    const state = getState(host);
    const refs = getRefs(host);
    if (!state || !refs) return;

    const assigned = refs.slotEl.assignedElements().filter((el) => el.nodeType === Node.ELEMENT_NODE);
    state.slides = assigned;
    state.slides.forEach((slide, idx) => {
        slide.classList.add('dax-slide');
        slide.dataset.daxIndex = String(idx);
        slide.setAttribute('aria-hidden', idx === state.currentIndex ? 'false' : 'true');
        slide.classList.toggle('dax-active', idx === state.currentIndex);
        slide.style.display = idx === state.currentIndex ? 'block' : 'none';
    });
    buildDots(host);
    setActive(host, state.currentIndex || 0);
};

const updatePlayPauseLabel = (host) => {
    const state = getState(host);
    const refs = getRefs(host);
    if (!state || !refs) return;

    if (state.timer) {
        refs.playPauseButton.textContent = 'Pause';
        refs.playPauseButton.setAttribute('aria-label', 'Pause slideshow');
    } else {
        refs.playPauseButton.textContent = 'Play';
        refs.playPauseButton.setAttribute('aria-label', 'Start slideshow');
    }
};

const stop = (host) => {
    const state = getState(host);
    if (!state) return;

    if (state.timer) {
        clearInterval(state.timer);
        state.timer = null;
    }
    state.autoplay = false;
    host.removeAttribute('autoplay');
    updatePlayPauseLabel(host);
};

const next = (host) => {
    setActive(host, getState(host).currentIndex + 1);
};

const prev = (host) => {
    setActive(host, getState(host).currentIndex - 1);
};

const start = (host) => {
    const state = getState(host);
    if (!state) return;

    stop(host);
    state.timer = setInterval(() => next(host), state.intervalMs);
    state.autoplay = true;
    host.setAttribute('autoplay', '');
    updatePlayPauseLabel(host);
};

const restartTimer = (host) => {
    const state = getState(host);
    if (!state || !state.timer) return;
    start(host);
};

const initHost = (host) => {
    const shadow = host.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));

    const slotEl = shadow.querySelector('slot');
    const prevButton = shadow.querySelector('.prev');
    const nextButton = shadow.querySelector('.next');
    const playPauseButton = shadow.querySelector('.play-pause');
    const dotsContainer = shadow.querySelector('.dots');

    refsMap.set(host, {
        slotEl,
        prevButton,
        nextButton,
        playPauseButton,
        dotsContainer,
        handlers: {},
    });

    stateMap.set(host, {
        intervalMs: Number(host.getAttribute('interval')) || 5000,
        autoplay: host.hasAttribute('autoplay'),
        currentIndex: 0,
        timer: null,
        slides: [],
    });
};

class DaxCarousel extends HTMLElement {
    static observedAttributes = ['interval', 'autoplay'];

    constructor() {
        super();
        initHost(this);
    }

    connectedCallback = () => {
        const refs = getRefs(this);
        if (!refs) return;

        const handlers = {
            slotChange: () => refreshSlides(this),
            onPrev: () => {
                prev(this);
                if (getState(this).timer) restartTimer(this);
            },
            onNext: () => {
                next(this);
                if (getState(this).timer) restartTimer(this);
            },
            onPlayPause: () => {
                if (getState(this).timer) {
                    stop(this);
                } else {
                    start(this);
                }
            },
        };

        refs.handlers = handlers;

        refs.slotEl.addEventListener('slotchange', handlers.slotChange);
        refs.prevButton.addEventListener('click', handlers.onPrev);
        refs.nextButton.addEventListener('click', handlers.onNext);
        refs.playPauseButton.addEventListener('click', handlers.onPlayPause);

        refreshSlides(this);
        start(this);
    };

    disconnectedCallback = () => {
        const refs = getRefs(this);
        if (!refs) return;
        stop(this);
        const { handlers } = refs;
        if (handlers.slotChange) refs.slotEl.removeEventListener('slotchange', handlers.slotChange);
        if (handlers.onPrev) refs.prevButton.removeEventListener('click', handlers.onPrev);
        if (handlers.onNext) refs.nextButton.removeEventListener('click', handlers.onNext);
        if (handlers.onPlayPause) refs.playPauseButton.removeEventListener('click', handlers.onPlayPause);
    };

    attributeChangedCallback = (name, oldValue, newValue) => {
        if (oldValue === newValue) return;
        if (name === 'interval') {
            setState(this, { intervalMs: Number(newValue) || 5000 });
            if (getState(this).timer) start(this);
        }
        if (name === 'autoplay') {
            setState(this, { autoplay: this.hasAttribute('autoplay') });
            if (getState(this).autoplay) {
                start(this);
            } else {
                stop(this);
            }
        }
    };
}

customElements.define('dax-carousel', DaxCarousel);

export default DaxCarousel;
