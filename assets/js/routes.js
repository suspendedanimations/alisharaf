/* ----------
all routes needs to be defined inline
see https://github.com/bigwheel-framework/documentation/blob/master/routes-defining.md#as-section-standard-form
---------- */
module.exports = {
	'/': '/diary',
	'/diary': { section: require('./sections/home') },
    '/diary/:id': { section: require('./sections/section') },
    '/profile': { section: require('./sections/about') },
    '/contact': { section: require('./sections/contact') },
    '404': '/diary'
}