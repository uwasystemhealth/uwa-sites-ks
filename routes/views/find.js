var keystone = require('keystone');
var async = require('async');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Init locals
	locals.section = req.path.match(/^\/[a-z]\//).replace(/\//g, '');
	locals.list = ({
		infrastructure: 'Infra',
		sensors: 'Sensors',
		classifiers: 'Classifiers',
		faults: 'Faults',
		locations: 'Locations',
	})[locals.section];
	locals.populate = ({
		infrastructure: 'classes contact location faults',
		sensors: 'classes',
		classifiers: '',
		faults: 'classes',
		locations: '',
	})[locals.section];
	locals.filters = {
		class: req.params.class,
	};
	locals.data = {
		rows: [],
		classes: [],
	};

	// Load all categories
	if (['locations', 'classifiers'].indexOf(locals.section) === -1) {
		view.on('init', function (next) {

			keystone.list('Classifiers').model.find().sort('name').exec(function (err, results) {

				if (err || !results.length) {
					return next(err);
				}

				locals.data.classes = results;

				// Load the counts for each category
				async.each(locals.data.classes, function (category, next) {

					keystone.list(locals.list).model.count().where('classes').in([category.id]).exec(function (err, count) {
						category.rowCount = count;
						next(err);
					});

				}, function (err) {
					next(err);
				});
			});
		});
	}

	// Load the current category filter
	view.on('init', function (next) {

		if (req.params.class) {
			keystone.list('Classifiers').model.findOne({ key: locals.filters.class }).exec(function (err, result) {
				locals.data.class = result;
				next(err);
			});
		} else {
			next();
		}
	});

	// Load the posts
	view.on('init', function (next) {

		var q = keystone.list(locals.list).paginate({
			page: req.query.page || 1,
			perPage: req.query.limit || 20,
			maxPages: 100,
			filters: {},
		})
			.sort('name')
			.populate(locals.populate);

		if (locals.data.class) {
			q.where('classes').in([locals.data.class]);
		}

		q.exec(function (err, results) {
			locals.data.rows = results;
			next(err);
		});
	});

	// Render the view
	view.render('find');
};
