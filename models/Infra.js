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
	qty: { type: Types.Number, name: 'Quantity', initial: true },
	age: { type: Types.Date, label: 'Does not need to be 100% accurate.', name: 'Date Purchased/Installed', initial: true },
	location: { type: Types.Relationship, ref: 'Locations', initial: true },
	classes: { type: Types.Relationship, ref: 'Classifiers', many: true, initial: true },
	faults: { type: Types.Relationship, ref: 'Faults', many: true, name: 'Known Faults', initial: true },
	images: { type: Types.CloudinaryImages },
	contact: { type: Types.Relationship, ref: 'User', initial: true },
	examples: { type: Types.TextArray, name: 'Example Problem Statements' },
});

// Infra.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';

').get(function () {
	return this.content.extended || this.content.brief;
});
 //
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Infra.add({
	title: { type: String, required: true },
	contact: { type: Types.Relationship, ref: 'User', index: true, initial: true },
	images: { type: Types.CloudinaryImages },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
	},
	categories: { type: Types.Relationship, ref: 'InfraCategory', many: true },
});

Infra.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Infra.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Infra Model
 * ==========
 */

var Infra = new keystone.List('Infra', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Infra.add({
	title: { type: String, required: true },
	contact: { type: Types.Relationship, ref: 'User', index: true, initial: true },
	images: { type: Types.CloudinaryImages },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
	},
	categories: { type: Types.Relationship, ref: 'InfraCategory', many: true },
});

Infra.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Infra.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Infra.register();