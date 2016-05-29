import config from 'config'
import utils from 'utils'
import Smooth from 'smooth-scrolling'
import classes from 'dom-classes'

class Custom extends Smooth {
    
    constructor(opt) {

        super(opt)

        this.dom.section = opt.section
    }

    resize() {
        
        super.resize()
        
        this.vars.bounding = this.dom.section.getBoundingClientRect().height - this.vars.height
    }
    
    run() {
                
        super.run()
           
        this.dom.section.style[this.prefix] = `translate3d(0,${-this.vars.current.toFixed(3)}px,0)`
    }
    
    destroy() {

        // this.dom.section.style[this.prefix] = ''
        
        super.destroy()
    }
}

export default Custom