import framework from 'framework'
import config from 'config'
import utils from 'utils'
import gsap from 'gsap'
import SplitText from 'gsap-splitext'
import classes from 'dom-classes'

TweenLite.defaultEase = Expo.easeOut

class Biggie {
    
    constructor(opt) {

        this.animating = false
        this.open = false

        this.handler = this.handler.bind(this)
        this.animateMenuIn = this.animateMenuIn.bind(this)
        this.animateMenuOut = this.animateMenuOut.bind(this)
    }
    
    init() {
        
        utils.biggie.addRoutingEL([config.$name])
        utils.biggie.addRoutingEL(config.$nav)
        utils.biggie.addRoutingEL(config.$all)
        
        this.trigger = config.$body.querySelector('.mobile-menu')
        this.menu = config.$body.querySelector('.menu')
        this.a = utils.js.arrayFrom(this.menu.querySelectorAll('a'))
        
        this.trigger.onclick = this.handler
        this.a.forEach((el) => el.onclick = this.handler) 
    }
    
    handler(e) {
        
        e.preventDefault()

        if(this.animating) return

        const target = e.srcElement
        const href = target.getAttribute('href')

        // console.log(target.hasAttribute('href'), href)

        this.open === true ? this.animateMenuOut() : this.animateMenuIn()

        target.hasAttribute('href') && framework.go(href)
    }

    animateMenuIn() {

        this.open = true
        this.animating = true

        this.trigger.innerHTML = 'Close'
        
        classes.add(config.$body, 'has-menu-open')
          
        const tl = new TimelineMax({ paused: true, onComplete: () => {
            this.animating = false
        }})
        tl.to(this.menu, 1, { autoAlpha: 1 })
        tl.staggerFrom(this.a, 1, { y: '100%', autoAlpha: 0 }, .02, 0)
        tl.restart()
    }

    animateMenuOut() {

        this.animating = true

        this.trigger.innerHTML = 'Menu'

        classes.remove(config.$body, 'has-menu-open')

        const tl = new TimelineMax({ paused: true, onComplete: () => {
            this.open = false
            this.animating = false
        }})
        tl.to(this.menu, 1, { autoAlpha: 0 })
        tl.staggerTo(this.a, 1, { autoAlpha: 0, clearProps: 'opacity, hidden, transform' }, -.02, 0)
        tl.restart()
    }
}

module.exports = Biggie