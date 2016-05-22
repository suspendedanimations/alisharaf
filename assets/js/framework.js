import bigwheel from 'bigwheel';

/* ----------
create our framework instance
see https://github.com/bigwheel-framework/documentation/blob/master/quickstart.md#bigwheel-quick-start
---------- */
var framework = bigwheel((done) => {
	done({
		overlap: true,
        initSection: require('./sections/preloader'),
		routes: require('./routes')
	});
});

export default framework