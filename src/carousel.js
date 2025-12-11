const Carousel = (galleryContainerClass, linksContainerClass = null) => {
    const galleryContainer = document.querySelector(`.${galleryContainerClass}`)
    if (!galleryContainer) return

    const carouselContainer = galleryContainer.querySelector('.js-image-carousel')
    const controlsContainer = galleryContainer.querySelector('.js-gallery-controls')
    const images = carouselContainer.children
    const linksContainer = linksContainerClass && galleryContainer.querySelector(`.${linksContainerClass}`)
    const linksList = linksContainer?.children
    const minMobileWidth = 810

    // let nextButton
    let prevButton
    let startButton
    // let fullscreenButton
    // let captionsButton
    // let helpButton

    if (controlsContainer) {
        // nextButton = controlsContainer.querySelector('.js-next-button')
        prevButton = controlsContainer.querySelector('.js-prev-button')
        startButton = controlsContainer.querySelector('.js-start-button')
        // fullscreenButton = controlsContainer.querySelector('.js-fullscreen')
        // captionsButton = controlsContainer.querySelector('.js-display-captions')
        // helpButton = controlsContainer.querySelector('.js-display-help')
    }

    const state = {
        isFirstPlay: true,
        isPlaying: false,
        isFullscreen: false,
        isCaptions: true,
        isHelp: false,
        curIndex: 0,
        carouselTimer: null,
        controlsTimer: null,
        helpTimer: null,
        interval: carouselContainer.dataset.interval || 5000,
        controlsInterval: 2500,
        playOnce: carouselContainer.dataset.playOnce || false,
        imageCounter: carouselContainer.dataset.imageCounter || true,
    }

    const setFirstImageAsCurrent = () => {
        images[0].classList.add('current')
    }

    const setImage = (newIndex) => {
        images[state.curIndex].classList.remove('current')
        linksList?.[state.curIndex]?.classList.remove('current')
        state.curIndex = newIndex
        images[state.curIndex].classList.add('current')
        linksList?.[state.curIndex]?.classList.add('current')
        updateMobileImageEvents()
        updateImageCounter()
    }

    const stop = () => {
        clearInterval(state.carouselTimer)
        state.carouselTimer = null
        state.isPlaying = false
        if (controlsContainer) startButton.firstChild.innerHTML = 'play_arrow'
    }

    const next = () => {
        stop()
        setImage((state.curIndex + 1) % images.length)
    }

    const prev = () => {
        stop()
        setImage((state.curIndex - 1 + images.length) % images.length)
    }

    const togglePlay = () => {
        if (state.isPlaying) {
            stop()
        } else {
            start()
        }
    }

    // const toggleFullscreen = () => {
    //     galleryContainer.classList.toggle('fullscreen')
    //     state.isFullscreen = !state.isFullscreen
    //     if (!fullscreenButton) return
    //     fullscreenButton.firstChild.innerHTML = state.isFullscreen ? 'fullscreen_exit' : 'fullscreen'
    // }

    // const toggleCaptions = () => {
    //     carouselContainer.classList.add('show-captions')
    //     state.isCaptions = !state.isCaptions
    // }

    // const toggleHelp = () => {
    //     galleryContainer.classList.toggle('show-help')
    //     state.isHelp = !state.isHelp
    // }

    const toggleControls = () => {
        galleryContainer.classList.add('show-controls')
        clearTimeout(state.controlsTimer)
        state.controlsTimer = setTimeout(() => {
            galleryContainer.classList.remove('show-controls')
            // galleryContainer.classList.remove('show-help')
        }, state.controlsInterval)
    }

    const updateImageCounter = () => {
        if (state.imageCounter === 'false') return
        const curImageContainer = carouselContainer.querySelector('.current figure')
            || carouselContainer.querySelector('.current')
        let curImageCounter = curImageContainer.querySelector('.image-counter')
        if (curImageCounter) return

        curImageCounter = document.createElement('div')
        curImageCounter.classList.add('image-counter')
        curImageCounter.innerHTML = `${state.curIndex + 1} / ${images.length}`
        curImageContainer.prepend(curImageCounter)
    }

    const updateMobileImageEvents = () => {
        if (window.innerWidth > minMobileWidth) return
        const prevImage = images.item((state.curIndex - 1 + images.length) % images.length)
        const curImage = images.item(state.curIndex)
        prevImage.querySelector('img').removeEventListener('mousedown', mobileImageEvents)
        curImage.querySelector('img').addEventListener('mousedown', mobileImageEvents)
    }

    /** mobile fullscreen events */
    const mobileImageEvents = (event) => {
        if (window.innerWidth > minMobileWidth) return

        const clientWidthQuarter = window.innerWidth / 4
        const x = event.clientX
        if (x < clientWidthQuarter) {
            prev()
        } else if (x > clientWidthQuarter * 3) {
            // next()
        }
        // else {
        //     // toggleFullscreen()
        // }
    }

    if (controlsContainer) {
        /** Event handlers */
        // nextButton.addEventListener('click', next)
        prevButton.addEventListener('click', prev)
        startButton.addEventListener('click', togglePlay)
        // fullscreenButton.addEventListener('click', toggleFullscreen)
        // helpButton.addEventListener('click', toggleHelp)
        // captionsButton?.addEventListener('click', toggleCaptions)
        /** keyboard shortcuts */
        document.addEventListener('keydown', (event) => {
            toggleControls()
            // if (event.key === 'ArrowRight') next()
            if (event.key === 'ArrowLeft') prev()
            if (event.key === ' ') togglePlay()
            //if (event.key === 'f') toggleFullscreen()
            //if (event.key === 'h') toggleHelp()
            //if (captionsButton && event.key === 'i') toggleCaptions()
        })
        /** mouse events */
        document.addEventListener('mousemove', toggleControls)
    }

    const init = () => {
        state.isFirstPlay = false
        setFirstImageAsCurrent()
        updateMobileImageEvents()
        updateImageCounter()
    }

    const start = () => {
        /** Show next image on play, unless the gallery has just loaded */
        if (!state.isFirstPlay) {
            next()
        } else if (state.isFirstPlay) {
            /** Init gallery on first play */
            init()
        }

        state.carouselTimer = setInterval(() => {
            setImage((state.curIndex + 1) % images.length)
            if (state.playOnce === 'true' && state.curIndex === images.length - 1) {
                stop()
            }
        }, state.interval)
        if (controlsContainer) {
            startButton.firstChild.innerHTML = 'stop'
            toggleControls()
        }
        state.isPlaying = true
    }

    return {
        start,
    }
}

export default Carousel
