import config from 'config'
import classes from 'dom-classes'
import create from 'dom-create-element'
import {on, off} from 'dom-events'
import Biggie from '../app'

class Preloader {
    
    constructor(onComplete) {
        
        this.preloaded = onComplete
        this.ready = this.ready.bind(this)
        this.view = config.$view
        this.el = null
    }
    
    init(req, done) {
        
        const preload = document.createElement('img')
        const int = Math.floor(Math.random()*APP.IMAGES.length)
        const random = APP.IMAGES[int]
        const image = config.isMobile ? random.image.sizes.large : random.image.url
        const template = `<div class="background" style="background-image: url('${image}')"></div>`
        const page = this.view.firstChild
        
        const app = new Biggie()
        app.init()

        this.el = create({
            selector: 'div',
            styles: 'preloader',
            html: template
        })
        
        this.view.insertBefore(this.el, page)
        
        preload.onload = done
        preload.src = image
    }

    addEvents() {

        on(this.el, 'click', this.ready)
        on(config.$body, 'mousewheel', this.ready)
    }

    removeEvents() {

        off(this.el, 'click', this.ready)
        off(config.$body, 'mousewheel', this.ready)
    }

    resize(width, height) {

        config.width = width
        config.height = height
    }
    
    ready() {

        if(this.called) return

        this.called = true
        
        // TweenMax.set(config.$logo, { opacity: .95, 'will-change': 'transform, opacity' }, 1)
        
        classes.add(config.$logo, 'rotate')

        classes.remove(config.$body, 'is-loaded')
        classes.remove(config.$bar, 'hidden')
        classes.remove(config.$body.querySelector('.email'), 'hidden')
        
        requestAnimationFrame(_ => this.el.querySelector('.background').style.opacity = 0)

        this.preloaded()
    }

    animateIn(req, done) {

        classes.remove(config.$name, 'hidden')
        classes.add(config.$body, 'is-loaded')
        classes.remove(config.$logo, 'hidden')
        classes.remove(config.$arrow, 'hidden')

        this.el.style.opacity = 1
        
        requestAnimationFrame(_ => {
            
            this.el.querySelector('.background').style.opacity = 1
            this.el.querySelector('.background').style[config.prefix.transform] = 'none'
        })
        
        TweenMax.delayedCall(.5, _ => {
            this.addEvents()
            done()
        })
    }
    
    animateOut(req, done) {

        classes.remove(config.$html, 'is-preloader')
        
        done()
    }
    
    destroy(req, done) {

        this.removeEvents()
        
        TweenMax.delayedCall(1.5, _ => {
            
            this.view.removeChild(this.el)
            done()
        })
    }
}

module.exports = Preloader