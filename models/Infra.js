var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Infra Model
 * ==========
 */

var Infra = new keystone.List('Infra', {
	autokey: { path: 'slug', from: 'name', unique: true },
	track: true,
	drilldown: 'classes location faults contact',
});

Infra.add({
	name: { type: String, required: true, initial: true },
	desc: { type: Types.Markdown, initial: true },
	qty: { type: Types.Number, label: 'Quantity', initial: true },
	age: { type: Types.Date, note: 'Does not need to be 100% accurate.', label: 'Date Purchased/Installed', initial: true },
	location: { type: Types.Relationship, ref: 'Locations', initial: true },
	classes: { type: Types.Relationship, ref: 'Classifiers', many: true, initial: true },
	faults: { type: Types.Relationship, ref: 'Faults', many: true, label: 'Known Faults', initial: true },
	images: { type: Types.CloudinaryImages },
	contact: { type: Types.Relationship, ref: 'User', initial: true },
	examples: { type: Types.TextArray, label: 'Example Problem Statements' },
});

// Infra.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Infra.register();
