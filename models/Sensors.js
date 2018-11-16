var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Sensors Model
 * ==========
 */

var Sensors = new keystone.List('Sensors', {
	autokey: { path: 'slug', from: 'name', unique: true },
	track: true,
	drilldown: 'classes',
});

Sensors.add({
	name: { type: String, required: true, initial: true },
	desc: { type: Types.Markdown, initial: true },
	classes: { type: Types.Relationship, ref: 'Classifiers', many: true, initial: true },
	images: { type: Types.CloudinaryImages },
	examples: { type: Types.TextArray, name: 'Example Solution Statements' },
});

Sensors.register();
