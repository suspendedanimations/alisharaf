import config from 'config'
import utils from 'utils'
import classes from 'dom-classes'
import event from 'dom-events'
import Default from './default'
import Manager from 'slider-manager'
import Jello from '../lib/jello'
import {on, off} from 'dom-events'

class About extends Default {
    
    constructor(opt) {
        
        super(opt)

        this.slug = 'about'

        this.goNext = this.goNext.bind(this)
    }
    
    init(req, done) {

        super.init(req, done)
    }
    
    dataAdded(done) {
        
        super.dataAdded()

        !config.isMobile && this.addEvents()

        done()
    }
    
    addEvents() {
        
        this.ui.index = utils.js.arrayFrom(this.ui.index)
        this.paragraphs = utils.js.arrayFrom(this.page.querySelectorAll('.p p'))
        
        config.$arrow.style.cursor = 'pointer'
        on(config.$arrow, 'click', this.goNext)

        this.addSplit()
        this.addJello()
        this.addSlider()
    }

    addSplit() {

        this.splits = []

        this.paragraphs.forEach((el) => {

            const split = new SplitText(el, { type: 'lines, words' })
            this.splits.push(split)
        })
    }

    addSlider() {

        this.slider = new Manager({
            length: this.paragraphs.length,
            loop: true,
            callback: (event) => this.onScroll(event)
        })

        this.slider.init()
        this.slider.animating = true

        TweenMax.delayedCall(1.5, _ => {

            this.slider.animating = false
            this.slider.goTo(1)
        })
    }
    
    addJello() {

        const hasRetina = utils.hardware.hasRetina()
        const images = []

        APP.ABOUT.forEach((el) => {

            const image = hasRetina ? el.image.sizes.large : el.image.sizes.medium_large
            const width = hasRetina ? el.image.sizes['large-width'] : el.image.sizes['medium_large-width']
            const height = hasRetina ? el.image.sizes['large-height'] : el.image.sizes['medium_large-height']
            const obj = { image: image, width: width, height: height }
            images.push(obj)
        })
        
        this.jello = new Jello({
            container: this.ui.image,
            images: images
        })

        this.jello.init()
    }

    onScroll(event) {

        if(config.isMobile) return

        const index = event.current
        const previous = event.previous
        const down = event.direction === 'downwards'

        this.jello.isTransitioning = true
        
        this.slider.animating = true
        index == this.paragraphs.length ? classes.add(config.$arrow, 'rotate') : classes.remove(config.$arrow, 'rotate')
        
        const stagger = index == 1 ? 'staggerFrom' : 'staggerTo'
        const inverse = index == 0 ? 1 : 0
        
        this.ui.index.forEach((el, loop) => {
            classes.remove(el, 'is-current-index')
            loop == index-1 && classes.add(el, 'is-current-index')
        })

        const tl = new TimelineMax({ paused: true, onComplete: _ => {
            
            this.jello.isTransitioning = false
            this.splits[previous-1] && tl.set(this.splits[previous-1].words, { clearProps: 'opacity, visibility, transform' })
            this.slider.animating = false
        }})
        
        tl.set(config.$logo, { opacity: inverse }, index == 0 ? .6 : 0)
        tl.staggerTo(this.paragraphs, 1, { cycle: { opacity: (i) => index === 0 ? 0 : i === index-1 ? 1 : 0, delay: (i) => index === 0 ? .6 : i === index-1 ? 0 : .6 }}, 0, 0)
        
        this.splits[previous-1] && tl.staggerTo(this.splits[previous-1].words, .9, { autoAlpha: 0, y: '-100%', cycle: { scale: [.8, 1], rotationY: ['-5deg', '5deg'], skewX: ['-5deg', '5deg'] }, ease: Expo.easeInOut }, -.6 / this.splits[previous-1].words.length, 0)
        this.splits[index-1] && tl.staggerFrom(this.splits[index-1].words, .9, { autoAlpha: 0, y: '100%', cycle: { scale: [.8, 1.1], rotationY: ['-15deg', '15deg'], skewX: ['-10deg', '10deg'] }, ease: Expo.easeInOut }, .8 / this.splits[index-1].words.length, this.splits[previous-1] ? .6 : 0)
        
        tl.to(this.page.querySelector('.intrinsic'), 1, { autoAlpha: index == 0 ? 1 : .6, ease: Expo.easeInOut }, 0)
        
        tl.to(this.jello.settings, .6, {
            transition: 1,
            speed: .6,
            dispScale: 40,
            ease: Power2.easeOut
        }, 0)
        
        tl.add(() => this.jello.changeImage(), .35)
        
        tl.to(this.jello.settings, .6, {
            transition: 0,
            speed: 0,
            dispScale: 0,
            ease: Linear.easeNone
        }, 1)
        
        tl.restart()
    }

    goNext(e) {

        const next = this.slider.index == this.slider.length ? 0 : this.slider.index+1
        
        this.slider.goTo(next)
    }

    removeEvents() {

        config.$arrow.style.cursor = ''
        off(config.$arrow, 'click', this.goNext)

        this.jello && this.jello.destroy()
        this.slider && this.slider.destroy()
    }
    
    animateIn(req, done) {

        classes.remove(config.$body, 'is-loading')
        classes.add(config.$body, `is-${this.slug}`)
        
        const tl = new TimelineMax({ paused: true, onComplete: done })
        tl.to(this.page, 1.2, { autoAlpha: 1, ease: Expo.easeOut })
        tl.to(this.page.querySelector('.intrinsic'), 5, { autoAlpha: config.isMobile ? .2 : 1, scale: 1, ease: Expo.easeOut }, .5)
        tl.restart()
    }

    animateOut(req, done) {
        
        this.slider && this.slider.index != 0 && this.slider.goTo(0)
        
        this.page.style.zIndex = '10'

        classes.add(config.$body, 'is-loading')
        classes.remove(config.$body, `is-${this.slug}`)
        
        const tl = new TimelineMax({ paused: true, onComplete: done })
        tl.to(this.page.querySelector('.intrinsic'), 1, { autoAlpha: 0, ease: Expo.easeOut }, this.slider ? this.slider.index / 2 : 0)
        tl.to(this.page, 1.1, { y: '100%' })
        tl.restart()
    }

    resize(width, height) {

        super.resize(width, height)

        this.jello && this.jello.resize()
    }
    
    destroy(req, done) {

        super.destroy()
        
        !config.isMobile && this.removeEvents()

        this.page.parentNode.removeChild(this.page)
        
        done()
    }
}

module.exports = About