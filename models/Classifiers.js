const keystone = require('keystone');
const { Types } = keystone.Field;

/**
 * Classifier Model
 * ==================
 */

const Classifier = new keystone.List('Classifiers', {
	autokey: { from: 'name', path: 'slug', unique: true },
	track: true,
});

Classifier.add({
	name: { type: String, required: true, initial: true },
	desc: { type: Types.Markdown, initial: true },
});

Classifier.relationship({ ref: 'Infra', path: 'infra', refPath: 'classes' });
Classifier.relationship({ ref: 'Sensors', path: 'sensors', refPath: 'classes' });
Classifier.relationship({ ref: 'Faults', path: 'faults', refPath: 'classes' });

Classifier.register();
