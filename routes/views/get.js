var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = req.url.match(/^\/[a-z]+/)[0].replace(/\//g, '');
	locals.list = ({
		piece: 'Infra',
		sensor: 'Sensors',
		class: 'Classifiers',
		fault: 'Faults',
		location: 'Locations',
	})[locals.section];
	locals.sing = locals.section;
	locals.populate = ({
		piece: 'classes contact location faults',
		sensor: 'classes',
		class: '',
		fault: 'classes',
		location: '',
	})[locals.section];
	locals.filters = {
		slug: req.params.slug,
	};
	locals.data = {
		row: {},
	};

	// Load the current post
	view.on('init', function (next) {

		var q = keystone.list(locals.list).model.findOne({
			slug: locals.filters.slug,
		}).populate(locals.populate);

		q.exec(function (err, result) {
			locals.data.row = result;

            // Load other related lists
			if (locals.section === 'infrastructure') {
				view.on('init', function (next) {
					var q = keystone.list('Sensors').model.find()
                        .where('classes')
                        .in(result.classes)
                        .sort('name')
                        .populate('classes');
					q.exec(function (err, results) {
						locals.data.row.sensors = results;
						next(err);
					});
				});
			}
			if (locals.section === 'sensors') {
				view.on('init', function (next) {
					var q = keystone.list('Infra').model.find()
                        .where('classes')
                        .in(result.classes)
                        .sort('name')
                        .populate('classes contact location faults');
					q.exec(function (err, results) {
						locals.data.row.infra = results;
						next(err);
					});
				});
			}
			next(err);
		});
	});

	// Render the view
	view.render('get');
};
