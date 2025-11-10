import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema(
	{
		category: {
			type: String,
			required: true,
			enum: ['Harassment', 'Theft', 'Bullying', 'Vandalism', 'Assault', 'Other']
		},
		description: { type: String, required: true },
		location: { type: String, required: true },
		photoUrl: { type: String }, // base64 data URL or hosted URL
		status: { type: String, default: 'pending', enum: ['pending', 'in_review', 'resolved'] },
		priority: { type: String, default: 'normal', enum: ['low', 'normal', 'high'] },
		coordinates: {
			lat: { type: Number },
			lng: { type: Number }
		}
	},
	{ timestamps: true }
);

// Derive coordinates if not provided by pseudo-hashing the location to a point near a campus center
function pseudoCoordsFromLocation(location) {
	const campus = { lat: 37.4275, lng: -122.1697 };
	let hash = 0;
	for (let i = 0; i < location.length; i += 1) {
		hash = (hash << 5) - hash + location.charCodeAt(i);
		hash |= 0;
	}
	const latOffset = ((hash % 1000) / 1000) * 0.01; // ~1km box
	const lngOffset = (((hash >> 4) % 1000) / 1000) * 0.01;
	return { lat: campus.lat + latOffset, lng: campus.lng + lngOffset };
}

ReportSchema.pre('save', function preSave(next) {
	if (this.isModified('category') || this.isNew) {
		if (this.category === 'Harassment') {
			this.priority = 'high';
		}
	}
	if ((!this.coordinates || (!this.coordinates.lat && !this.coordinates.lng)) && this.location) {
		this.coordinates = pseudoCoordsFromLocation(this.location);
	}
	next();
});

export const Report = mongoose.model('Report', ReportSchema);


