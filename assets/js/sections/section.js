import framework from 'framework'
import config from 'config'
import utils from 'utils'
import classes from 'dom-classes'
import Default from './default'
import Smooth from '../lib/smooth/single'

class Section extends Default {
	
    constructor(opt) {

        super(opt)

        this.slug = 'section'
    }

    init(req, done) {

        this.prevRoute = req.previous ? req.previous.route : '/'

        super.init(req, done)
    }
	
    dataAdded(done) {

        super.dataAdded()
        
        !config.isMobile && this.addEvents()

        done()
    }

    addEvents() {

        this.smooth = new Smooth({
            section: this.ui.section,
            ease: .075
        })
        
        this.smooth.init()
    }

    removeEvents() {
        
        this.smooth && this.smooth.destroy()
    }
    
    animateIn(req, done) {
        
        classes.remove(config.$body, 'is-loading')
        
        const previous = req.previous && req.previous.route
        const home = req.previous && req.previous.route === (config.routes.default || config.routes.home)
        
        !previous && classes.add(config.$body, `is-${this.slug}`)

        const tl = new TimelineMax({ paused: true, onComplete: done })
        tl.from(this.page, 1.2, { autoAlpha: 0, y: previous ? '-15%' : '0%', ease: Expo.easeInOut }, home ? 3 : 0)
        tl.staggerTo(this.page.querySelectorAll('.intrinsic .el'), 3.5, { opacity: 1, scale: 1 }, 1, .8)
        previous && tl.add(_ => classes.add(config.$body, `is-${this.slug}`), .8)
        tl.restart()
    }
    
	animateOut(req, done) {

        classes.add(config.$body, 'is-loading')
        classes.remove(config.$body, `is-${this.slug}`)

        this.page.style.zIndex = '10'
        
        // const home = req.route === (config.routes.default || config.routes.home)
        // const work = req.route === config.routes.work
        
        const tl = new TimelineMax({ paused: true, onComplete: done }) 
        tl.to(this.page, .6, { autoAlpha: 0, ease: Expo.easeOut })
        tl.staggerTo(this.page.querySelectorAll('.intrinsic .el'), 1, { opacity: 0 }, .02, 0)
        tl.restart()
    }

    resize(width, height) {

        super.resize(width, height)
    }
    
    debounce() {

        super.debounce()

        if(config.isMobile) {
            this.smooth && (this.smooth.destroy(), this.smooth = null)
        } else {
            !this.smooth && (this.addEvents(), console.log(this.smooth))
        }
    }
    
    destroy(req, done) {

        super.destroy()

        !config.isMobile && this.removeEvents()

        this.page.parentNode.removeChild(this.page)

        done()
	}
}

module.exports = Section