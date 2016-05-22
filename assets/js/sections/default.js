import framework from '../framework'
import config from '../config'
import utils from '../utils'
import classes from 'dom-classes'
import query from 'query-dom-components'
import _ from 'underscore'
import $ from 'dom-select'

class Default {
    
    constructor(opt) {
        
        opt = opt || {}
        
        this.isMobile = config.isMobile = config.width <= 768
        
        this.view = config.$view
        this.page = null

        this.debouncedResize = _.debounce(this.debounce.bind(this), 300)
    }
    
    init(req, done, options) {

        const opts = options || { sub: false }
        
        const view = this.view
        const ready = this.dataAdded.bind(this, done)
        const page = this.page = req.previous === undefined ? config.$view.querySelector('.page') : utils.biggie.loadPage(req, view, ready, opts)
        
        req.previous === undefined && (classes.remove(page, 'is-hidden'), this.dataAdded(done))
    }
    
    dataAdded() {
        
        this.page.style.display = 'block'
        
        this.ui = query({ el: this.page, prefix: 'ui-' })
        this.a = $.all('a', this.page)
        
        this.a && utils.biggie.addRoutingEL(this.a)
        
        // config.prevRoute = window.location.pathname
    }

    resize(width, height) {
        
        config.height = height
        config.width = width

        config.isMobile = config.width <= 768

        this.debouncedResize()
    }

    debounce() {}

    destroy() {
        
        this.a && utils.biggie.removeRoutingEL(this.a)
    }
}

export default Default