import domselect from 'dom-select'
import utils from './utils'
import prefix from 'prefix'

const config = {
	
	PATH: '',
	
	prevRoute: '/',
	routes: {
		default: '/',
		home: '/diary'
	},
	
	$html: document.documentElement,
	$body: document.body,
	$view: domselect('#js-view'),
	$logo: domselect('.logo'),
	$name: domselect('.name'),
	$arrow: domselect('.arrow'),
	$bar: domselect('nav'),
	$nav: domselect.all('nav a'),
	$all: domselect.all('.project-list a'),
	
	width: window.innerWidth,
	height: window.innerHeight,
	
	formats: ['mp4'],
	
	prefix: {
		transform: prefix('transform')
	},

	mouseMultiplier: 1,
	firefoxMultiplier: 50,
	ease: .1,
	
	isMobile: window.innerWidth <= 768,
	hasVideo: true,
	hasBlendMode: 'backgroundBlendMode' in document.body.style
}

export default config