const keystone = require('keystone');
const { Types } = keystone.Field;

/**
 * Locations Model
 * ==================
 */

const Locations = new keystone.List('Locations', {
	autokey: { from: 'name', path: 'key', unique: true },
	track: true,
});

Locations.add({
	name: { type: String, required: true, initial: true },
	desc: { type: Types.Markdown, initial: true },
	coords: { type: Types.GeoPoint, default: [115.818079, -31.980106] },
});

Locations.relationship({ ref: 'Infra', path: 'infra', refPath: 'location' });

Locations.register();
