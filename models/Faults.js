const keystone = require('keystone');
const { Types } = keystone.Field;

/**
 * Faults Model
 * ==================
 */

const Faults = new keystone.List('Faults', {
	autokey: { from: 'name', path: 'slug', unique: true },
	track: true,
	drilldown: 'classes',
});

Faults.add({
	name: { type: String, required: true, initial: true },
	desc: { type: Types.Markdown, initial: true },
	classes: { type: Types.Relationship, ref: 'Classifiers', many: true, initial: true },
});

Faults.relationship({ ref: 'Infra', path: 'infra', refPath: 'classes' });

Faults.register();
