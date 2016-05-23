import config from 'config'
import utils from 'utils'
import classes from 'dom-classes'
import event from 'dom-events'
import Default from './default'
import Manager from 'slider-manager'

class Contact extends Default {
    
    constructor(opt) {
        
        super(opt)

        this.slug = 'contact'
    }
    
    init(req, done) {

        super.init(req, done)
    }
    
    dataAdded(done) {
        
        super.dataAdded()

        this.addEvents()

        done()
    }
    
    addEvents() {
        
    }

    removeEvents() {

        
    }
    
    animateIn(req, done) {

        classes.remove(config.$body, 'is-loading')
        classes.add(config.$body, `is-${this.slug}`)
        
        const tl = new TimelineMax({ paused: true, onComplete: done })
        tl.from(this.page, 1, { autoAlpha: 0 })
        tl.staggerFrom(this.page.querySelectorAll('.p span'), 1, { y: '115%' }, .08, 0)
        tl.staggerFrom(this.page.querySelectorAll('.right .el'), 1, { x: '100%', autoAlpha: 0 }, .08, 0)
        tl.restart()
    }

    animateOut(req, done) {
        
        classes.add(config.$body, 'is-loading')
        classes.remove(config.$body, `is-${this.slug}`)
        
        const tl = new TimelineMax({ paused: true, onComplete: done })
        tl.staggerTo(this.page.querySelectorAll('.p span'), 1, { y: '-115%' }, .08, 0)
        tl.staggerTo(this.page.querySelectorAll('.right .el'), 1, { autoAlpha: 0 }, .08, 0)
        tl.to(this.page, 1, { autoAlpha: 0 }, '-=1')
        tl.restart()
    }

    resize(width, height) {

        super.resize(width, height)
    }
    
    destroy(req, done) {

        super.destroy()
        
        this.removeEvents()

        this.page.parentNode.removeChild(this.page)
        
        done()
    }
}

module.exports = Contact