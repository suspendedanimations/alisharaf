import framework from 'framework'
import config from 'config'
import utils from 'utils'
import create from 'dom-create-element'
import classes from 'dom-classes'
import Default from './default'
import Smooth from '../lib/smooth/diary'
import {on, off} from 'dom-events'

class Home extends Default {
	
	constructor(opt) {
		
		super(opt)

		this.slug = 'home'
		this.ui = null
		this.all = false
		this.links = utils.js.arrayFrom(config.$all)
		
		this.state = {
			current: 1
		}

		this.animateInAll = this.animateInAll.bind(this)
		this.animateOutAll = this.animateOutAll.bind(this)
		this.changeMask = this.changeMask.bind(this)
	}
	
	init(req, done) {

		// req.previous && req.previous.route.substring(0, 5) === '/work' && req.previous.params && (this.index = req.previous.params.id)
		
		super.init(req, done)
	}
	
	dataAdded(done) {
		
		super.dataAdded()
		
		this.ui.close = config.$body.querySelector('.list-close')
		
		this.lazyLoad()

		!config.isMobile && this.addEvents()
		
		done()
	}
	
	addEvents() {

		const image = config.$logo.getAttribute('data-mask')
		
		this.els = utils.js.arrayFrom(this.page.querySelectorAll('.section a'))

		on(this.ui.all, 'click', this.animateInAll)
		on(this.ui.close, 'click', this.animateOutAll)

		this.els.forEach((el) => on(el, 'mouseenter', this.changeZIndex))
		this.els.forEach((el) => on(el, 'mouseleave', this.changeZIndex))
		this.links.forEach((el) => on(el, 'mouseenter', this.changeMask))
		
		this.initSmooth()
		this.smooth.vs.off(this.smooth.calc)
		
		this.createCanvas()
		this.createMask(image)
	}

	lazyLoad() {

		this.lazyload = utils.js.arrayFrom(this.page.querySelectorAll('.el .el'))
		
		this.lazyload.forEach((el) => {

			const img = document.createElement('img')
			const image = el.getAttribute('data-src')
			
			img.onload = () => {
				
				el.style['background-image'] = `url('${image}')`
				
				requestAnimationFrame(() => el.opacity = 1)
			}

			img.src = image
		})
	}
	
	initSmooth() {

		this.smooth = new Smooth({
			extends: true,
			left: this.ui.left,
			right: this.ui.right,
			ease: .075
		})
		
		this.smooth.init()
	}
	
	removeEvents() {
		
		off(this.ui.all, 'click', this.animateInAll)
		off(this.ui.close, 'click', this.animateOutAll)
		
		this.els.forEach((el) => off(el, 'mouseenter', this.changeZIndex))
		this.els.forEach((el) => off(el, 'mouseleave', this.changeZIndex))
		this.links.forEach((el) => off(el, 'mouseenter', this.changeMask))
		
		this.smooth && this.smooth.destroy()
	}

	createCanvas() {

		const canvas = this.canvas = document.createElement('canvas')
		const ctx = this.ctx = canvas.getContext('2d')
		
		config.$logo.appendChild(canvas)
	}

	removeMask() {

		config.$logo.removeChild(this.canvas)
	}

	createMask(image) {

		const mask = document.createElement('img')

  		mask.onload = () => {

  			const originwidth = mask.width
  			const originheight = mask.height

  			const img = document.createElement('img')

  			img.onload = () => {

		        const width = img.width
		        const height = img.height

		        const newidth = (originwidth / originheight) * height
		        const x = ((newidth) - width) / 2

		        this.canvas.width = newidth
	          	this.canvas.height = height

	          	this.ctx.clearRect(0, 0, config.width, config.height)
	    		this.ctx.drawImage(mask, 0, 0, newidth, height)
				this.ctx.globalCompositeOperation = 'source-atop'
				this.ctx.drawImage(img, x, 0)
	      	}

	      	img.src = image
  		}
    	
      	mask.src = config.$logo.getAttribute('data-svg')
	}

	changeMask(e) {

		const target = e.currentTarget
		const index = target.getAttribute('data-index')
		const image = target.getAttribute('data-mask')

		if(this.state.current == index) return

		this.state.current = index

		this.createMask(image)
	}

	changeZIndex(e) {

		const target = e.currentTarget

		target.style.zIndex = e.type == 'mouseenter' ? '5' : ''
	}

	animateInAll() {

		if(this.all) return

		this.all = true
		
		classes.remove(this.page, 'has-hover')
		classes.add(this.ui.all, 'is-hidden')
		classes.add(config.$logo, 'scaled')
		
		const tl = new TimelineMax({ paused: true, onComplete: () => {
			this.smooth && this.smooth.off()
		}})
		tl.staggerTo(this.lazyload, 1.1, { cycle: { x: (index) => (index & 1) ? config.width/3 : -config.width/3 }, autoAlpha: 0, ease: Expo.easeOut }, 0, 0)
  		tl.to(config.$body.querySelector('.project-list'), 1, { autoAlpha: 1 }, 1)
  		tl.staggerFrom(config.$body.querySelectorAll('.project-list a'), 1.5, { cycle: {
  			skewX: (index) => (index & 1) ? '-5deg' : '5deg',
  			scale: (index) => (index & 1) ? '1.1' : '.9'
  		}, autoAlpha: 0 }, .1, 0)
  		tl.restart()
	}

	animateOutAll(onComplete) {

		if(!this.all) return

		classes.remove(config.$logo, 'scaled')
		classes.remove(this.ui.all, 'is-hidden')

		this.smooth && this.smooth.on()

		const tl = new TimelineMax({ paused: true, onComplete: () => {

			classes.add(this.page, 'has-hover')
			this.all = false
			typeof onComplete === 'function' && onComplete()
		}})
  		tl.staggerTo(this.lazyload, 1.1, { x: 0, autoAlpha: 1, ease: Expo.easeOut }, .02, 0)
  		tl.to(config.$body.querySelector('.project-list'), .6, { autoAlpha: 0, clearProps: 'all', ease: Expo.easeOut }, 0)
  		tl.restart()
	}

	animateIn(req, done) {
		
		const work = req.previous && req.previous.route === `/work/:id`
		
		classes.remove(config.$body, `is-loading`)
		classes.add(config.$body, `is-${this.slug}`)
		
		const half = config.height/2
		const tl = new TimelineMax({ paused: true, onComplete: () => {
			
			classes.add(this.page, 'has-hover')
			done()
		}})
  		tl.from(this.page, 1.1, { autoAlpha: 0, scale: 1.2, ease: Power2.easeInOut }, 0)
  		tl.staggerTo(this.lazyload, 1, { autoAlpha: 1, ease: Expo.easeOut }, .08, 0)
  		
  		!config.isMobile && tl.add(() => this.smooth.vs.on(this.smooth.calc), 1)

  		tl.restart()
	}
	
	animateOut(req, done) {

		this.page.style.zIndex = '10'

		const tween = () => {

			classes.add(config.$body, `is-loading`)
			classes.remove(config.$body, `is-${this.slug}`)
			classes.remove(this.page, 'has-hover')

			!config.isMobile && this.removeEvents()

			const tl = new TimelineMax({ paused: true, onComplete: done })
	  		tl.staggerTo(this.lazyload, 3, { autoAlpha: 0, ease: Expo.easeInOut }, .08, 0)
	  		tl.to(this.page, 1.3, { y: '100%', ease: Expo.easeInOut }, 0)
	  		tl.restart()
		}

		this.all ? this.animateOutAll(() => tween()) : tween()
	}
	
	resize(width, height) {
		
		super.resize(width, height)
	}

	debounce() {

		super.debounce()
		
		if(config.isMobile) {
            this.smooth && (this.smooth.destroy(), this.smooth = null)
        } else {
            !this.smooth && this.initSmooth()
        }
	}

	destroy(req, done) {

		super.destroy()
		
		this.removeMask()
		
		this.page.parentNode.removeChild(this.page)
		
		done()
	}
}

module.exports = Home