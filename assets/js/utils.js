import framework from 'framework'
import ajax from 'please-ajax'
import create from 'dom-create-element'
import classes from 'dom-classes'

const utils = {
	
	css: {
		
		getRect(top=0, right, bottom, left=0) {

			return `rect(${top}px, ${right}px, ${bottom}px, ${left}px)`;
		}
	},
	
	js: {

		prependChild(el, parent) {

			parent.insertBefore(el, parent.firstChild);
		},
		
		arrayFrom(opt) {
			
			return Array.prototype.slice.call(opt, 0);
		},

		clamp(min, value, max) {

			return Math.max(min, Math.min(value, max));
		},
		
		scrollTop() {

			if (window.pageYOffset) return window.pageYOffset;
			return document.documentElement.clientHeight ? document.documentElement.scrollTop : document.body.scrollTop;
		}
	},
	
	biggie: {
		
		addRoutingEL(a) {

			utils.js.arrayFrom(a).forEach((el) => el.onclick = utils.biggie.handleRoute)
		},
		
		removeRoutingEL(a) {
			
			utils.js.arrayFrom(a).forEach((el) => el.onclick = null)
		},

		handleRoute(e) {
        	
	        const target = e.currentTarget

	        if(classes.has(target, 'no-route') || target.getAttribute('target') === '_blank') return
			
	        e.preventDefault()

	        framework.go(target.getAttribute('href'))
	    },
	    
		getSlug(req, options) {
			
			let route = req.route === "/" ? '/home' : req.route;
			const params = Object.keys(req.params).length === 0 && JSON.stringify(req.params) === JSON.stringify({})
			
			if(!params) {
				
				for (var key in req.params) {
			        if (req.params.hasOwnProperty(key)) {

			        	route.indexOf(key) > -1 && (route = route.replace(`:${key}`, options.sub ? '' : req.params[key]))
			        }
			    }
			}
			
			route.substring(route.length-1) == '/' && (route = route.slice(0, -1))
			return route.substr(1)
		},
		
		createPage(req, slug) {
			
			return create({
				selector: 'section',
				id: `page-${slug.replace('/', '-')}`,
				styles: `page page-${slug.replace('/', '-')}`
			})
		},
		
		loadPage(req, view, done, options) {
			
			const slug = utils.biggie.getSlug(req, options)
			const page = utils.biggie.createPage(req, slug)

			ajax.get(`/${slug}`, {
				success: (object) => {
					
					const title = object.data.split(/(<title>|<\/title>)/ig)[2]
					const inner = object.data.split(/(<body>|<\/body>)/ig)[2]
					page.innerHTML = inner
					document.title = title.replace(/&amp;/g, '&')
					done()
				}
			})

			return view.appendChild(page)
		}
	}
}

export default utils