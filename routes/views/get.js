var keystone = require('keystone');
var _ = require('lodash');

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

	var loadRelated = (list, on, ids, key, next) => {
		keystone.list(list).model.find()
		.where(on)
		.in(ids)
		.sort('name')
		.exec(function (err, results) {
			_.set(locals.data.row, key, results);
			next(err);
		});
	};

	// Load the current post
	view.on('init', function (next) {

		var q = keystone.list(locals.list).model.findOne({
			slug: locals.filters.slug,
		}).populate(locals.populate);

		q.exec(function (err, result) {
			locals.data.row = result;

			// Load other related lists
			switch (locals.section) {
				case 'piece':
					loadRelated('Sensors', 'classes', result.classes.map(c => c._id), 'sensors', next);
					break;
				case 'sensor':
					loadRelated('Infra', 'classes', result.classes.map(c => c._id), 'infra', next);
					break;
				case 'fault':
					loadRelated('Infra', 'faults', [result._id], 'infra', next);
					break;
				case 'location':
					loadRelated('Infra', 'location', [result._id], 'infra', next);
					break;
				case 'class':
					loadRelated('Infra', 'classes', [result._id], 'infra', function (err) {
						if (err) next(err);
						else loadRelated('Sensors', 'classes', [result._id], 'sensors', next);
					});
					break;
				default:
					next();
					break;
			}
		});
	});

	// Render the view
	view.render('get');
};
