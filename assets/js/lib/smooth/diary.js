import config from 'config'
import utils from 'utils'
import classes from 'dom-classes'
import Smooth from 'smooth-scrolling'
import _ from 'underscore'

class Diary extends Smooth {

    constructor(opt) {

        super(opt)
                
        this.dom.left = utils.js.arrayFrom(opt.left)
        this.dom.right = utils.js.arrayFrom(opt.right)
        this.length = this.dom.left.length + this.dom.right.length
        
        this.autoScroll = true
        this.resizing = false
        this.idle = true
        this.cache = null
        this.debounce = _.debounce(this.debounce.bind(this), 50)
    }
    
    resize() {
        
        this.debounce()
    }
    
    debounce() {
        
        this.resizing = true
        
        this.dom.left.forEach((el, index) => el.style[config.prefix.transform] = `translate3d(-30%,${config.height*index}px,0)`)
        this.dom.right.forEach((el, index) => el.style[config.prefix.transform] = `translate3d(30%,-${config.height*index}px,0)`)
        
        this.vars.bounding = config.height * ((this.length / 2) - 1) + config.height / 2
        
        super.resize()

        this.resizing = false
    }

    calc(e) {

        super.calc(e)
        this.idle = e.deltaY === 0
    }
    
    run() {

        super.run()

        if(this.autoScroll && this.idle && this.vars.target < this.vars.bounding)
            this.vars.target += .6
            
        this.dom.left.forEach((el, index) => el.style[config.prefix.transform] = `translate3d(-30%,${(config.height*index) - this.vars.current}px,0)`)
        this.dom.right.forEach((el, index) => el.style[config.prefix.transform] = `translate3d(30%,${(config.height*(index*-1)) + this.vars.current}px,0)`)
    }
    
    destroy() {

        // this.dom.left.forEach((el, index) => el.style[config.prefix.transform] = '')
        // this.dom.right.forEach((el, index) => el.style[config.prefix.transform] = '')
        
        super.destroy()
    }
}

export default Diary