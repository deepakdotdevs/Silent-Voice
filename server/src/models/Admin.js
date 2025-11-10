import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const AdminSchema = new mongoose.Schema(
	{
		email: { type: String, unique: true, required: true, lowercase: true, trim: true },
		passwordHash: { type: String, required: true }
	},
	{ timestamps: true }
);

AdminSchema.methods.comparePassword = function comparePassword(plain) {
	return bcrypt.compare(plain, this.passwordHash);
};

AdminSchema.statics.seedDefaultAdminIfMissing = async function seed() {
	const email = process.env.ADMIN_EMAIL || 'admin@campus.edu';
	const password = process.env.ADMIN_PASSWORD || 'password123';
	const existing = await this.findOne({ email });
	if (existing) return existing;
	const passwordHash = await bcrypt.hash(password, 10);
	return this.create({ email, passwordHash });
};

export const Admin = mongoose.model('Admin', AdminSchema);


